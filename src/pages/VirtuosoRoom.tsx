import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { IonButton, IonContent, IonItem, IonProgressBar } from "@ionic/react";
import { Timestamp, collection, documentId, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { app } from "../App";
import { NewChatBubble } from "../components/ChatBubble";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { UserDetails } from "../lib/friendTech";
import { Member } from "../hooks/useMember";


const VirtuosoRoom: React.FC<{ channel: string, me: Member, reply: (id: string) => void }> = ({ channel, me, reply }) => {
    const [lastMessageReached, setLastMessageReached] = useState(false)
    const [lastFetchedTimestamp, setLastTimestamp] = useState(new Timestamp(Date.now() / 1000, 0))

    const messages = useGroupMessages(x => x.groupMessages[channel] || [])
    const { pushMessages } = useGroupMessages()
    const [newMessage, setNewMessage] = useState<string | undefined>();
    const containerRef = useRef<HTMLIonContentElement>(null)
    const hasMessages = messages.length != 0;
    useEffect(() => {
        if (containerRef.current) {
            // Ionic's IonContent has a method scrollToBottom
            if (typeof newMessage !== 'undefined') {
                containerRef.current.scrollToBottom(500); // 500ms for a smooth scroll
            }
        }
    }, [newMessage, containerRef]);
    useEffect(() => {
        if (containerRef.current) {
            // Ionic's IonContent has a method scrollToBottom
            if (messages.length === 10) {
                containerRef.current.scrollToBottom(500); // 500ms for a smooth scroll
            }
        }
    }, [messages, containerRef]);
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
                    limit(1)
                ),
                async (channelDocs) => {
                    const changes = channelDocs.docChanges();
                    const replyIds = changes.map(change => change.doc.data().reply).filter(id => id);
                    let replies: any = [];
                    if (replyIds.length > 0) {
                        const repliesSnapshot = await getDocs(query(messagesCol, where(documentId(), "in", replyIds)));
                        replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                    }
                    const newMessages = changes.filter(x => x.type === 'added').map(x => (({ ...x.doc.data(), id: x.doc.id } as any)))
                    const latestMessages = [...newMessages];
                    if (latestMessages.length === 0) {
                        return;
                    } else {
                    }
                    changes.forEach((change) => {
                        if (change.type == 'added') {
                            if (change.doc.data().sent !== null) {
                                return;
                            }
                            const latestMessages: Message[] = [{ ...change.doc.data() as any, id: change.doc.id, sent: change.doc.data().sent ? change.doc.data().sent : new Timestamp(Date.now() / 1000, 0) }];
                            pushMessages(channel, latestMessages, replies);
                            setNewMessage(latestMessages[0].id)
                        }
                    });
                }
            );
        })();
    }, [hasMessages])
    const fetchMore = useCallback(async () => {
        console.log("FETCHING MORE");
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");
        const q = query(messagesCol, orderBy("sent", "desc"), startAfter(lastFetchedTimestamp), limit(20));
        return getDocs(q).then(async (snapshot) => {
            const olderMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const inputMessages = [...olderMessages as any];
            const replyIds = olderMessages.map((message: any) => message.reply).filter(id => id);
            let replies: any = [];

            if (replyIds.length > 0) {
                const repliesSnapshot = await getDocs(query(messagesCol, where(documentId(), "in", replyIds)));
                replies = repliesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            }
            if (messages.length === 0) {
                setTimeout(() => {
                    setNewMessage(olderMessages[0].id)
                }, 100)
            }
            if (inputMessages.length === 0) {
                setLastMessageReached(true);
            } else {
                pushMessages(channel, inputMessages, replies);
                setLastTimestamp((olderMessages[olderMessages.length - 1] as any).sent);
            }
        })
    }, [messages, lastFetchedTimestamp])
    useEffect(() => {
        me && fetchMore();
    }, [me, channel])
    // useEffect(() => {
    //     if (Capacitor.isPluginAvailable('Keyboard')) {
    //         Keyboard.addListener('keyboardDidHide', () => {
    //             console.log("KEYBOARD!")
    //             setTimeout(() => {
    //                 virtuosoRef.current!.scrollToIndex(INITIAL_ITEM_COUNT - messages.length)
    //             }, 500)
    //         })
    //     }
    // }, [channel])
    useEffect(() => {
    }, [newMessage])
    const virtuosoRef = useRef<VirtuosoHandle>(null); // Create a reference
    return <IonContent ref={containerRef}>
        {/* <Virtuoso ref={virtuosoRef}
            components={{
                Header: () => <IonItem lines="none" style={{ height: 100 }}>
                    {!lastMessageReached && <IonProgressBar style={{}} type="indeterminate" color='tertiary' />}
                </IonItem>, Footer: () => <div style={{ height: 10 }}>
                </div>
            }}
            style={{ height: '100%', overflowX: 'hidden' }}
            firstItemIndex={INITIAL_ITEM_COUNT - messages.length}
            initialTopMostItemIndex={INITIAL_ITEM_COUNT}
            alignToBottom
            followOutput
            startReached={fetchMore}
            data={messages}
            computeItemKey={(i, msg) => msg.id}
            itemContent={(index, msg) => {
                if (typeof msg === 'undefined') {
                    return <div key={index}>
                        undefined</div>
                }

                return <NewChatBubble reply={reply} channel={channel} me={me.address} message={msg} />
            }}
        /> */}
        {lastMessageReached || messages.length === 0 || messages.length < 20 ? <></> : <IonButton onClick={fetchMore} fill="clear" expand="full">
            Load More
        </IonButton>}
        {messages.map(x => <NewChatBubble key={x.id} message={x} me={me.address} channel={channel} reply={reply} />)}
    </IonContent>


};

export default VirtuosoRoom;