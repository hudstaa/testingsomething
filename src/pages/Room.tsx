import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonList, IonListHeader, IonLoading, IonPage, IonProgressBar, IonRouterLink, IonRow, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { getEnv, loadKeys, storeKeys } from '../lib/xmtp';
import { useQuery } from '@apollo/client';
import { TribeContent } from '../components/TribeContent';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { alertOutline, lockClosed, notificationsCircle, notificationsOff, notificationsOutline, paperPlane, pushOutline } from 'ionicons/icons';
import { ChatBubble, MemberBadge, MemberChip } from '../components/MemberBadge';
import { Client, Conversation, ConversationV2, DecodedMessage, MessageV2 } from '@xmtp/xmtp-js';
import { useTitle } from '../hooks/useTitle';
import { CachedConversation, CachedMessage, Signer, useClient, useConversations, useMessages, useStreamAllMessages, useStreamMessages } from '@xmtp/react-sdk';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { timeAgo } from '../components/TradeItem';
import { TribeHeader } from '../components/TribeHeader';
import { Message } from '../models/Message';

import { uuid } from 'uuidv4';


import { Firestore, Timestamp, addDoc, arrayUnion, collection, doc, getDocs, getFirestore, limit, limitToLast, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, startAt, updateDoc } from "firebase/firestore";
import { app, messaging } from '../App';
import { setCode } from 'viem/_types/actions/test/setCode';
import { getMessaging } from 'firebase/messaging';
import usePassBalance from '../hooks/usePassBalance';
import { Address } from 'viem';
import useBoosters from '../hooks/useBoosters';

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
    const channelOwner = useMember(x => x.getFriend(address, true))

    const [signer, setSigner] = useState<any>();
    const [lastMessageLoaded, setLastMessageLoaded] = useState<boolean>(false);
    const a = useGroupMessages(x => x.groupMessages);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const { pushMessages, modMessage } = useGroupMessages()
    const channel = address;
    const balance: bigint | undefined = usePassBalance(wallet?.address || "" as any, channel as Address);
    const [latestMessageSent, setLatestMessageSent] = useState<Timestamp | null>()
    const sendMessage = useCallback(async (content: string) => {
        const author = wallet!.address;
        const newMessage = ({ id: uuid(), channel, content, author, sent: serverTimestamp(), type: 'string' });
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");

        try {
            await addDoc(messagesCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [wallet?.address, wallet, address])
    const { syncing } = useBoosters(wallet?.address, address)
    useEffect(() => {
        if (!channel) {
            return;
        }
        (async () => {

            const db = getFirestore(app);
            const messagesCol = collection(db, "channel", channel, "messages");
            // async function fetchMessages() {
            //     const q = query(messagesCol, orderBy("sent", "desc"), limit(10));

            //     const snapshot = await getDocs(q);
            //     const messages = snapshot.docs.map(doc => doc.data());
            //     // Save the timestamp of the last message fetched
            //     let lastFetchedTimestamp = 0;
            //     if (messages.length > 0) {
            //         lastFetchedTimestamp = messages[messages.length - 1].sent;
            //     }
            //     pushMessages(channel, messages as any);
            //     return lastFetchedTimestamp;
            // }

            // // Fetch the initial 10 messages on load
            // console.log("FETCHING")
            // const lastFetchedTimestamp = await fetchMessages();
            // console.log("FECTHED", lastFetchedTimestamp)

            // Listen for real-time changes
            onSnapshot(
                query(
                    messagesCol,
                    orderBy("sent", "desc"),
                    limit(20)
                ),
                (channelDocs) => {
                    console.log("GOT SNAP")
                    const changes = channelDocs.docChanges();
                    changes.forEach((change) => {
                        if (change.type == 'added') {
                            const newMessage = change.doc.data() as Message;
                            pushMessages(channel, [newMessage]);
                            console.log("new")
                        } else if (change.type == 'modified') {
                            const newMessageTimestamped = change.doc.data() as Message;
                            newMessageTimestamped.sent !== null && setLatestMessageSent(newMessageTimestamped.sent)
                            modMessage(channel, change.doc.data() as Message);
                            console.log("mod")
                        }
                    });
                }
            );
        })();

    }, [channel])
    const messageList = useMemo(() => messages.map((msg: any) =>
        <ChatBubble sent={msg.sent} isMe={msg.author === user?.wallet?.address} address={msg.author} message={msg.content}></ChatBubble>
    ), [messages])
    const contentRef = useRef<HTMLIonContentElement>(null);
    useLayoutEffect(() => {
        contentRef.current && contentRef.current.scrollToBottom(420);
    }, [latestMessageSent]); // this will trigger every time the messages array changes
    useLayoutEffect(() => {
        if (messages.length <= 20) {
            setTimeout(() => {
                if (contentRef.current !== null) {
                    contentRef.current!.scrollToBottom(1000);
                }
            }, 1000)
        }
    }, [messages, contentRef.current]); // this will trigger every time the messages array changes




    const fetchMore = useCallback(async (complete: () => void) => {
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");
        console.log("fetch older")
        const lastFetchedTimestamp = messages[0].sent;
        const q = query(messagesCol, orderBy("sent", "desc"), startAt(lastFetchedTimestamp), limit(10));
        getDocs(q).then((snapshot) => {
            const olderMessages = snapshot.docs.map(doc => doc.data());
            // Save the timestamp of the last message fetched
            console.log(olderMessages, "GOT OLDER");
            if (olderMessages.length < 10) {
                setLastMessageLoaded(true);
            }

            pushMessages(channel, olderMessages as any);
            infiniteRef.current?.complete();
        }).catch((e) => {
            setLastMessageLoaded(true);
            infiniteRef.current?.complete();
            console.log(e);
        });

    }, [messages])
    const infiniteRef = useRef<HTMLIonInfiniteScrollElement>(null)
    const boosters = useBoosters(wallet?.address, channel);
    return <IonPage>
        {useMemo(() => <TribeHeader title={(channelOwner?.twitterName) + ' tribe' || address} />, [channelOwner, address])}

        <IonContent fullscreen color='light' style={{ flexDirection: 'column-reverse' }} ref={contentRef} >
            {(lastMessageLoaded || messages.length < 20) ? <></> : <IonInfiniteScroll position='top' ref={infiniteRef} disabled={lastMessageLoaded} onIonInfinite={(ev) => {
                fetchMore(ev.target.complete);
            }}>
                <IonInfiniteScrollContent loadingSpinner={'crescent'} >
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>}

            <IonList color='light' style={{ display: 'flex!important', 'flexDirection': 'column-reverse' }}>

                {balance !== null && typeof balance !== 'undefined' && balance > 0n ? messageList : <></>}
            </IonList>
            {balance && balance > 0n ? <></> : <IonRouterLink routerLink={'/member/' + channel}><IonTitle>
                <IonButton color='danger'>
                    No Access <IonIcon icon={lockClosed} />
                </IonButton>
            </IonTitle></IonRouterLink>}

        </IonContent>
        {syncing !== null && balance && balance == 0n ? <IonLoading isOpen={syncing} /> : <></>}
        {balance && balance > 0n ? <IonFooter >
            < WriteMessage address={user?.wallet?.address || ""} sendMessage={sendMessage} />
        </IonFooter> : <>
        </>}
    </IonPage>
}

export default Room;
