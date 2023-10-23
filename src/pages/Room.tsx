import { IonButton, IonButtons, IonContent, IonFooter, IonGrid, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonLoading, IonRouterLink, IonSpinner, IonTitle } from '@ionic/react';
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

import { getAuth } from 'firebase/auth';
import { Timestamp, addDoc, collection, doc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, serverTimestamp, startAt, where } from "firebase/firestore";
import { Address } from 'viem';
import { app } from '../App';
import { ChatBubble, ChatBubbleWithReply } from '../components/ChatBubble';
import { WriteMessage } from '../components/WriteMessage';
import useBoosters from '../hooks/useBoosters';
import useFriendTechBalance from '../hooks/useFriendTechBalance';
import usePassBalance from '../hooks/usePassBalance';
import { TribePage } from './TribePage';
import { TribeContent } from '../components/TribeContent';
import { VariableSizeList } from 'react-window';




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
    const sendMessage = useCallback(async (message: { content: string, media?: { src: string, type: string } }) => {
        const author = wallet!.address;
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
                    limit(6)
                ),
                async (channelDocs) => {

                    const changes = channelDocs.docChanges();
                    const replyIds = changes.map(change => change.doc.data().reply).filter(id => id);
                    let replies: any = [];
                    if (replyIds.length > 0) {
                        const repliesSnapshot = await getDocs(query(messagesCol, where("id", "in", replyIds)));
                        replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    }
                    console.log(replies)
                    changes.forEach((change) => {
                        if (change.type == 'added') {
                            const newMessage = { ...change.doc.data(), id: change.doc.id } as Message;
                            pushMessages(channel, [newMessage, ...replies]);
                        } else if (change.type == 'modified') {
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
    const messageList = useMemo(() => messages.map((msg: any) => msg.reply ? <ChatBubbleWithReply media={msg.media} id={msg.id} message={msg.content} address={msg.author} isMe={msg.author === me?.address} repliedTo={messages.find(x => x.id === msg.reply) as any} sent={msg.sent} reply={reply} /> :
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
                const repliesSnapshot = await getDocs(query(messagesCol, where("id", "in", replyIds)));
                replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            }
            console.log(replies);
            pushMessages(channel, [...olderMessages as any, ...replies]);
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
    const spacerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (contentRef.current && spacerRef.current) {
            const contentEl = contentRef.current;
            const spacerEl = spacerRef.current;

            const contentHeight = contentEl.scrollHeight;
            const containerHeight = contentEl.clientHeight;
            const spacerHeight = Math.max(0, containerHeight - contentHeight);

            spacerEl.style.height = `${spacerHeight}px`;
        }
    }, [spacerRef.current, contentRef.current]); // Note: this effect will only run once. If content dynamically changes, consider dependencies.
    // const VirtualMessage: React.FC<{ index: number, style: any }> = ({ index, style }) => {
    //     const msg = messages[index];
    //     return msg.reply ? <ChatBubbleWithReply media={msg.media} id={msg.id} message={msg.content} address={msg.author} isMe={msg.author === me?.address} repliedTo={messages.find(x => x.id === msg.reply) as any} sent={msg.sent} reply={reply} /> :
    //         <ChatBubble media={msg.media} id={msg.id} reply={reply} key={msg.id} sent={msg.sent!} isMe={msg.author === me?.address} address={msg.author} message={msg.content}></ChatBubble>
    // };

    return <TribePage page='room'>
        <TribeHeader title={(channelOwner?.twitterName) + ' tribe' || address} />

        <IonContent ref={contentRef}>
            <div ref={spacerRef}></div>
            {(lastMessageLoaded || messages.length < 5) ? <></> : <IonInfiniteScroll position='top' ref={infiniteRef} disabled={lastMessageLoaded} onIonInfinite={(ev) => {
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

            {!hasAccess ? <IonLoading isOpen={syncing || ftSyncing || false} /> : <></>}
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
