import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonList, IonListHeader, IonPage, IonProgressBar, IonRow, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getEnv, loadKeys, storeKeys } from '../lib/xmtp';
import { useQuery } from '@apollo/client';
import { TribeContent } from '../components/TribeContent';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { paperPlane, pushOutline } from 'ionicons/icons';
import { MemberBadge, MemberChip } from '../components/MemberBadge';
import { Client, Conversation, ConversationV2, DecodedMessage, MessageV2 } from '@xmtp/xmtp-js';
import { useTitle } from '../hooks/useTitle';
import { CachedConversation, CachedMessage, Signer, useClient, useConversations, useMessages, useStreamAllMessages, useStreamMessages } from '@xmtp/react-sdk';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { timeAgo } from '../components/TradeItem';
import { TribeHeader } from '../components/TribeHeader';
import { Message } from '../models/Message';

import { uuid } from 'uuidv4';


import { Firestore, addDoc, arrayUnion, collection, doc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, updateDoc } from "firebase/firestore";
import { app } from '../App';
import { setCode } from 'viem/_types/actions/test/setCode';

export const WriteMessage: React.FC<{ address: string, sendMessage: (content: string) => void }> = ({ address, sendMessage }) => {
    const [newNote, setNewNote] = useState<string | undefined>(undefined)
    const makeComment = () => {
        newNote && sendMessage(newNote);
        setNewNote(undefined);
    }

    return <IonToolbar>
        <IonTextarea autoGrow style={{ padding: 5, marginLeft: 10 }} value={newNote} placeholder="send a message" onKeyUp={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                makeComment();
            }
        }} onIonInput={(e) => {
            setNewNote(e.detail.value!)
        }} />
        <IonButtons slot='end'>
            <IonButton onClick={async () => {
                makeComment();
            }}>
                <IonIcon color={typeof newNote !== 'undefined' && newNote.length > 0 ? 'primary' : 'light'} icon={paperPlane} />
            </IonButton>
        </IonButtons>
    </IonToolbar>
}

const Test: React.FC = () => {
    const { client } = useClient();
    return <>

    </>
}

const Room: React.FC = () => {
    const { address } = useParams<{ address: string }>()
    const { wallet, ready } = usePrivyWagmi();
    const { user } = usePrivy();
    const [signer, setSigner] = useState<any>();
    const messages = useGroupMessages(x => x.groupMessages[address.toLowerCase()] || [])
    const { pushMessages, modMessage } = useGroupMessages()
    const channel = address.toLowerCase();
    const [scroll, setScroll] = useState(0)

    const sendMessage = useCallback(async (content: string) => {
        const author = wallet!.address.toLowerCase();
        const newMessage = ({ id: uuid(), content, author, channel, sent: serverTimestamp() });
        const db = getFirestore(app);

        const messagesCol = collection(db, "channel", channel, "messages");

        try {
            const docRef = await addDoc(messagesCol, newMessage);
            console.log("Message sent with ID: ", docRef.id);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [wallet?.address, wallet, address])

    useEffect(() => {
        if (!channel) {
            return;
        }
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");
        async function fetchMessages(afterDoc?: number) {
            let q = query(messagesCol, orderBy("sent", "desc"), limit(10));
            if (afterDoc) {
                q = query(messagesCol, orderBy("sent", "desc"), startAfter(afterDoc), limit(10));
            }

            getDocs(q).then((snapshot) => {
                const messages = snapshot.docs.map(doc => doc.data());
                pushMessages(channel, messages as any)
            });
        }
        fetchMessages();

        onSnapshot(messagesCol
            , (channelDocs) => {
                const changes = channelDocs.docChanges()
                changes.forEach((change) => {
                    change.type == 'added' && pushMessages(channel, [change.doc.data()] as Message[])
                    change.type == 'modified' && modMessage(channel, change.doc.data() as Message)
                })
                setScroll(x => x + 1);
            })

    }, [channel])
    const messageList = useMemo(() => messages.map((msg: any) =>
        <IonItem lines='none' color='light' key={msg.id}>
            <IonButtons slot='start'>
                <MemberBadge address={msg.author} />
            </IonButtons>
            <IonText style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</IonText>
            <IonButtons slot='end'>
                {timeAgo(new Date(msg.sent.seconds * 1000))}
            </IonButtons>
        </IonItem>
    ), [messages])
    const contentRef = useRef<HTMLIonContentElement>(null);
    useEffect(() => {
        contentRef.current!.scrollToBottom(300); // 300ms scroll duration
    }, [scroll, messages]); // this will trigger every time the messages array changes


    const channelOwner = useMember(x => x.getFriend(address.toLowerCase()))


    const { subscribed, subcribing } = useGroupMessages();
    useEffect(() => {
    }, [address])

    return <IonPage>
        <IonContent ref={contentRef}>
            <TribeHeader title={(channelOwner?.twitterName || address) + " Tribe"} sticky={false} />
            <IonList style={{ display: 'flex!important', 'flexDirection': 'column-reverse' }}>
                {messageList}
            </IonList>
        </IonContent>
        <IonFooter >
            < WriteMessage address={user?.wallet?.address || ""} sendMessage={sendMessage} />
        </IonFooter>
    </IonPage>
}

export default Room;
