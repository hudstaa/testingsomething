import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCardHeader, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonLoading, IonPage, IonSpinner, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { MemberPfp } from '../components/MemberBadge';
import { TribeHeader } from '../components/TribeHeader';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { useMember } from '../hooks/useMember';

import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from '../App';
import { WriteMessage } from '../components/WriteMessage';
import { Message } from '../models/Message';
import { TribePage } from './TribePage';
import VirtuosoRoom from './VirtuosoRoom';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { hideTabs, showTabs } from '../lib/sugar';
import Chat from './Chat';




const Room: React.FC = () => {
    const { address } = useParams<{ address: string }>()

    const channelOwner = useMember(x => x.getFriend(address, true))
    const me = useMember(x => x.getCurrentUser());

    const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const [focused, setFocus] = useState<boolean>(false);
    const channel = address;

    useIonViewDidEnter(() => {
        hideTabs();
    })
    useIonViewDidLeave(() => {
        showTabs();
    })

    const sendMessage = useCallback(async (message: Message) => {
        setFocus(false);
        const author = me!.address;
        const newMessage: any = ({ ...message, author, sent: serverTimestamp(), type: typeof message?.media === 'undefined' ? 'string' : 'media' });
        const db = getFirestore(app);
        if (typeof replyingToMessageId !== null) {
            newMessage.reply = replyingToMessageId;
        }
        const messagesCol = collection(db, "channel", channel, "messages");
        setReplyingToMessageId(null);
        try {
            await addDoc(messagesCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me, channel, replyingToMessageId])

    const reply = useCallback((id: string) => {
        setReplyingToMessageId(id)
        setFocus(true);

    }, []);

    const replyingToMessage = messages.find(x => x.id === replyingToMessageId);
    const footerMemo = useMemo(() => replyingToMessageId !== null && replyingToMessage ? <IonItem>
        <MemberPfp size='smol' address={replyingToMessage.author} />
        {replyingToMessage.content}
        {replyingToMessage.media && <IonAvatar>
            <IonImg src={replyingToMessage.media.src} />
        </IonAvatar>}
        <IonButtons slot='end'>
            <IonButton fill='clear' onClick={() => { setReplyingToMessageId(null) }}>
                <IonIcon color='danger' icon={close} />
            </IonButton>
        </IonButtons>
    </IonItem> : <>
    </>, [replyingToMessageId, messages, me]);

    return <TribePage page='room'>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot='start'>
                    <IonButton routerLink='/channel'>
                        {(channelOwner?.twitterName) || address}
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        {me !== null ? <VirtuosoRoom reply={reply} channel={channel} me={me} /> : <IonSpinner />}
        <IonFooter style={{ borderTop: '1px solid' }}> {/* Add your border style here */}
            {footerMemo}
            < WriteMessage focused={focused} placeHolder='Start a message' address={me?.address || ""} sendMessage={sendMessage as any} />
        </IonFooter>
    </TribePage>
}

export default Room;
