import { IonAvatar, IonButton, IonButtons, IonContent, IonFooter, IonGrid, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonLoading, IonRouterLink, IonSpinner, IonTitle } from '@ionic/react';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { close, lockClosed } from 'ionicons/icons';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { MemberPfp } from '../components/MemberBadge';
import { TribeHeader } from '../components/TribeHeader';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { useMember } from '../hooks/useMember';
import { Message } from '../models/Message';

import { Timestamp, addDoc, collection, documentId, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, startAt, where } from "firebase/firestore";
import { Address } from 'viem';
import { app } from '../App';
import { ChatBubble, ChatBubbleWithReply } from '../components/ChatBubble';
import { WriteMessage } from '../components/WriteMessage';
import useBoosters from '../hooks/useBoosters';
import useFriendTechBalance from '../hooks/useFriendTechBalance';
import usePassBalance from '../hooks/usePassBalance';
import { nativeAuth } from '../lib/sugar';
import { TribePage } from './TribePage';




const Room: React.FC = () => {
    const initialFetch = 10;

    const { address } = useParams<{ address: string }>()
    const channelOwner = useMember(x => x.getFriend(address, true))
    const auth = nativeAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));

    const [replyingToMessage, setReplyingToMessage] = useState<Message | undefined>();
    const [lastMessageLoaded, setLastMessageLoaded] = useState<boolean>(false);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const { pushMessages, modMessage } = useGroupMessages()
    const channel = address;
    const balance: bigint | undefined = usePassBalance(me?.address || "" as any, channel as Address);
    const [latestMessageSent, setLatestMessageSent] = useState<Timestamp | null>()
    const sendMessage = useCallback(async (message: { content: string, media?: { src: string, type: string } }) => {
        const author = me!.address;
        const newMessage: any = ({ ...message, author, sent: serverTimestamp(), type: typeof message.media === 'undefined' ? 'string' : 'media' });
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
    }, [me, address, replyingToMessage])

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
                    limit(initialFetch)
                ),
                async (channelDocs) => {

                    const changes = channelDocs.docChanges();
                    const replyIds = changes.map(change => change.doc.data().reply).filter(id => id);
                    let replies: any = [];
                    if (replyIds.length > 0) {
                        console.log("has replies")
                        const repliesSnapshot = await getDocs(query(messagesCol, where(documentId(), "in", replyIds)));
                        replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                        console.log(replies, replyIds);
                    }
                    const newMessages = changes.filter(x => x.type === 'added').map(x => (({ ...x.doc.data(), id: x.doc.id } as any)))
                    pushMessages(channel, [...replies, ...newMessages]);
                    setLatestMessageSent(newMessages[newMessages.length - 1].sent)
                    changes.forEach((change) => {
                        if (change.type == 'modified') {
                            console.log("modified");
                            const newMessageTimestamped = change.doc.data() as Message;
                            newMessageTimestamped.sent !== null && setLatestMessageSent(newMessageTimestamped.sent)
                            modMessage(channel, { ...change.doc.data(), id: change.doc.id } as Message);
                        }
                    });
                }
            );
        })();

    }, [channel])
    const messageList = useMemo(() => messages.map((msg: any) => msg.reply ? <ChatBubbleWithReply key={msg.id} media={msg.media} id={msg.id} message={msg.content} address={msg.author} isMe={msg.author === me?.address} repliedTo={messages.find(x => x.id === msg.reply) || msg.reply} sent={msg.sent} reply={reply} /> :
        <ChatBubble media={msg.media} id={msg.id} reply={reply} key={msg.id} sent={msg.sent} isMe={msg.author === me?.address} address={msg.author} message={msg.content}></ChatBubble>
    ), [messages, me])
    const contentRef = useRef<HTMLIonContentElement>(null);



    const fetchMore = useCallback(async (complete: () => void) => {
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");
        const lastFetchedTimestamp = messages[0].sent;
        const q = query(messagesCol, orderBy("sent", "desc"), startAt(lastFetchedTimestamp), limit(10));
        getDocs(q).then(async (snapshot) => {
            const olderMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            // Save the timestamp of the last message fetched
            // console.log(olderMessages, "GOT OLDER");
            // if (olderMessages.length < 10) {
            //     setLastMessageLoaded(true);
            // }
            const replyIds = olderMessages.map((message: any) => message.reply).filter(id => id);
            let replies: any = [];
            if (replyIds.length > 0) {
                const repliesSnapshot = await getDocs(query(messagesCol, where(documentId(), "in", replyIds)));
                replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                console.log(replies);
            }
            pushMessages(channel, [...replies, ...olderMessages as any]);
            infiniteRef.current?.complete();
        }).catch((e) => {
            setLastMessageLoaded(true);
            infiniteRef.current?.complete();
            console.log(e);
        });

    }, [messages])
    const member = useMember(x => x.getFriend(channel))
    const infiniteRef = useRef<HTMLIonInfiniteScrollElement>(null)
    const { balance: boosters, syncing } = useBoosters(me?.address, address)
    const { balance: ftBalance, syncing: ftSyncing } = useFriendTechBalance(member?.friendTechAddress, me?.friendTechAddress, address);
    const hasAccess = (typeof ftBalance !== 'undefined' && ftBalance > 0n) || (typeof balance !== 'undefined' && balance > 0n);
    // const VirtualMessage: React.FC<{ index: number, style: any }> = ({ index, style }) => {
    //     const msg = messages[index];
    //     return msg.reply ? <ChatBubbleWithReply media={msg.media} id={msg.id} message={msg.content} address={msg.author} isMe={msg.author === me?.address} repliedTo={messages.find(x => x.id === msg.reply) as any} sent={msg.sent} reply={reply} /> :
    //         <ChatBubble media={msg.media} id={msg.id} reply={reply} key={msg.id} sent={msg.sent!} isMe={msg.author === me?.address} address={msg.author} message={msg.content}></ChatBubble>
    // };


    useLayoutEffect(() => {
        if (messages.length < initialFetch) {
            contentRef.current && contentRef.current.scrollToBottom(420);
        }
    }, [latestMessageSent]); // this will trigger every time the messages array changes

    useLayoutEffect(() => {
        if (messages.length > initialFetch) {
            setTimeout(() => {
                contentRef.current && contentRef.current.scrollToBottom(420);
            }, 100)
        }
    }, [latestMessageSent]); // this will trigger every time the messages array changes


    return <TribePage page='room'>
        <TribeHeader title={(channelOwner?.twitterName) + ' tribe' || address} />
        <IonContent ref={contentRef}>
            {(lastMessageLoaded || messages.length < initialFetch) ? <></> : <IonInfiniteScroll position='top' ref={infiniteRef} disabled={lastMessageLoaded} onIonInfinite={(ev) => {
                fetchMore(ev.target.complete);
            }}>
                <IonInfiniteScrollContent loadingSpinner={'crescent'} >
                </IonInfiniteScrollContent>
            </IonInfiniteScroll>}

            <IonList color={'paper'} style={{ display: 'flex!important', 'flexDirection': 'column-reverse' }}>
                {hasAccess ? messageList : <></>}
                <div style={{ height: 10 }} />
            </IonList>
            {hasAccess ? <></> : <IonRouterLink routerLink={'/member/' + channel}><IonTitle>
                {(syncing || ftSyncing) && <IonSpinner color='tribe' />}
                {!hasAccess && me != null && typeof balance !== 'undefined' && typeof ftBalance !== 'undefined' && !syncing && !ftSyncing ? <IonButton color='danger'>
                    No Access <IonIcon icon={lockClosed} />
                </IonButton> : <></>}
            </IonTitle></IonRouterLink>}

            {!hasAccess ? <IonLoading isOpen={syncing || ftSyncing || false} /> : <></>}
        </IonContent>
        {hasAccess ? <IonFooter slot='fixed' >
            <IonGrid fixed>
                {replyingToMessage && <IonItem>
                    <MemberPfp size='smol' address={replyingToMessage.author} />
                    {replyingToMessage.content}
                    {replyingToMessage.media && <IonAvatar> <IonImg src={replyingToMessage.media.src} /></IonAvatar>}
                    <IonButtons slot='end'>
                        <IonButton fill='clear' onClick={() => { setReplyingToMessage(undefined) }}>
                            <IonIcon color='danger' icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonItem>}
                < WriteMessage placeHolder='send a message' address={me?.address || ""} sendMessage={sendMessage} />
            </IonGrid>
        </IonFooter> : <>
        </>}
    </TribePage>
}

export default Room;
