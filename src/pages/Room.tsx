import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonItemDivider, IonList, IonListHeader, IonLoading, IonPage, IonProgressBar, IonRouterLink, IonRow, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar, useIonViewDidLeave, useIonViewWillLeave } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { usePrivy } from '@privy-io/react-auth';
import { useState, useCallback, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { getEnv, loadKeys, storeKeys } from '../lib/xmtp';
import { useQuery } from '@apollo/client';
import { TribeContent } from '../components/TribeContent';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { alertOutline, close, lockClosed, notificationsCircle, notificationsOff, notificationsOutline, paperPlane, pushOutline } from 'ionicons/icons';
import { ChatBubble, ChatBubbleWithReply, MemberBadge, MemberChip, MemberPfp } from '../components/MemberBadge';
import { useTitle } from '../hooks/useTitle';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { timeAgo } from '../components/TradeItem';
import { TribeHeader } from '../components/TribeHeader';
import { Message } from '../models/Message';

import { Firestore, Timestamp, addDoc, arrayUnion, collection, doc, getDocs, getFirestore, limit, limitToLast, onSnapshot, orderBy, query, serverTimestamp, setDoc, startAfter, startAt, updateDoc } from "firebase/firestore";
import { app, messaging } from '../App';
import { setCode } from 'viem/_types/actions/test/setCode';
import { getMessaging } from 'firebase/messaging';
import usePassBalance from '../hooks/usePassBalance';
import { Address } from 'viem';
import useBoosters from '../hooks/useBoosters';
import { TribePage } from './TribePage';
import { getAuth } from 'firebase/auth';
import { formatEth } from '../lib/sugar';
import useFriendTechBalance from '../hooks/useFriendTechBalance';
import { WriteMessage } from '../components/WriteMessage';
import useTabvisibility from '../hooks/useTabVisibility';




const Room: React.FC = () => {
    const { address } = useParams<{ address: string }>()
    const { wallet, ready } = usePrivyWagmi();
    const { user } = usePrivy();
    const channelOwner = useMember(x => x.getFriend(address, true))
    const me = useMember(x => x.getCurrentUser(getAuth().currentUser?.uid))

    const [replyingToMessage, setReplyingToMessage] = useState<Message | undefined>();
    const [lastMessageLoaded, setLastMessageLoaded] = useState<boolean>(false);
    const a = useGroupMessages(x => x.groupMessages);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const { pushMessages, modMessage } = useGroupMessages()
    const channel = address;
    const balance: bigint | undefined = usePassBalance(wallet?.address || "" as any, channel as Address);
    const [latestMessageSent, setLatestMessageSent] = useState<Timestamp | null>()
    const sendMessage = useCallback(async (content: string) => {
        const author = wallet!.address;
        const newMessage: any = ({ content, author, sent: serverTimestamp(), type: 'string' });
        const db = getFirestore(app);
        if (typeof replyingToMessage !== 'undefined') {
            newMessage.reply = replyingToMessage.id;
        }
        const messagesCol = collection(db, "channel", channel, "messages");
        setReplyingToMessage(undefined);
        try {
            await addDoc(messagesCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [wallet?.address, wallet, address, replyingToMessage])

    const reply = useCallback((id: string) => {
        setReplyingToMessage(messages.find(x => x.id === id))
    }, [messages]);
    useEffect(() => {
        if (!channel) {
            return;
        }
        (async () => {

            const db = getFirestore(app);
            const messagesCol = collection(db, "channel", channel, "messages");

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
                            const newMessage = { ...change.doc.data(), id: change.doc.id } as Message;
                            pushMessages(channel, [newMessage]);
                            console.log("new")
                        } else if (change.type == 'modified') {
                            const newMessageTimestamped = change.doc.data() as Message;
                            newMessageTimestamped.sent !== null && setLatestMessageSent(newMessageTimestamped.sent)
                            modMessage(channel, { ...change.doc.data(), id: change.doc.id } as Message);
                            console.log("mod")
                        }
                    });
                }
            );
        })();

    }, [channel])
    const messageList = useMemo(() => messages.map((msg: any) => msg.reply ? <ChatBubbleWithReply id={msg.id} message={msg.content} address={msg.author} isMe={msg.author === me?.address} repliedTo={messages.find(x => x.id === msg.reply) as any} sent={msg.sent} reply={reply} /> :
        <ChatBubble id={msg.id} reply={reply} key={msg.id} sent={msg.sent} isMe={msg.author === me?.address} address={msg.author} message={msg.content}></ChatBubble>
    ), [messages, me])
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
    const member = useMember(x => x.getFriend(channel))
    const infiniteRef = useRef<HTMLIonInfiniteScrollElement>(null)
    const { balance: boosters, syncing } = useBoosters(wallet?.address, address)
    const { balance: ftBalance, syncing: ftSyncing } = useFriendTechBalance(member?.friendTechAddress, me?.friendTechAddress, address);
    const hasAccess = (typeof ftBalance !== 'undefined' && ftBalance > 0n) || (typeof balance !== 'undefined' && balance > 0n) && !syncing && !ftSyncing;
    return <TribePage page='room'>
        <TribeHeader title={(channelOwner?.twitterName) + ' tribe' || address} />

        <IonContent ref={contentRef} >
            {(lastMessageLoaded || messages.length < 20) ? <></> : <IonInfiniteScroll position='top' ref={infiniteRef} disabled={lastMessageLoaded} onIonInfinite={(ev) => {
                fetchMore(ev.target.complete);
            }}>
                <IonInfiniteScrollContent loadingSpinner={'crescent'} >
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>}

            <IonList color='light' style={{ display: 'flex!important', 'flexDirection': 'column-reverse' }}>

                {hasAccess ? messageList : <></>}
                <div style={{ height: 10 }} />
            </IonList>
            {hasAccess ? <></> : <IonRouterLink routerLink={'/member/' + channel}><IonTitle>
                {(syncing || typeof balance === 'undefined' || ftSyncing || typeof ftBalance === 'undefined') && <IonSpinner />}
                {!hasAccess && me != null && typeof balance !== 'undefined' && typeof ftBalance !== 'undefined' && !syncing && !ftSyncing ? <IonButton color='danger'>
                    No Access <IonIcon icon={lockClosed} />
                </IonButton> : <></>}
            </IonTitle></IonRouterLink>}

            {hasAccess ? <IonLoading isOpen={syncing || ftSyncing || false} /> : <></>}
        </IonContent>
        {hasAccess ? <IonFooter slot='fixed' >
            <IonGrid fixed>
                {replyingToMessage && <IonItem>
                    <MemberPfp size='smol' address={replyingToMessage.author} />
                    {replyingToMessage.content}
                    <IonButtons slot='end'>
                        <IonButton fill='clear' onClick={() => { setReplyingToMessage(undefined) }}>
                            <IonIcon color='danger' icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonItem>}
                < WriteMessage placeHolder='send a message' address={user?.wallet?.address || ""} sendMessage={sendMessage} />
            </IonGrid>
        </IonFooter> : <>
        </>}
    </TribePage>
}

export default Room;
