import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
import { IonButton, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonProgressBar } from "@ionic/react";
import { Timestamp, collection, documentId, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { app } from "../App";
import { NewChatBubble } from "../components/ChatBubble";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { UserDetails } from "../lib/friendTech";
import { Member } from "../hooks/useMember";

function isValidMessage(data: any): data is Message {
    // Basic checks for required fields
    const hasRequiredFields = typeof data.author === 'string' && data.sent instanceof Timestamp;

    // If there are replies, they should also be valid messages
    let repliesValid = true;
    if (data.replies && Array.isArray(data.replies)) {
        repliesValid = data.replies.every(isValidMessage);
    }

    return hasRequiredFields && repliesValid;
}

const VirtuosoRoom: React.FC<{ channel: string, me: Member, reply: (id: string) => void }> = ({ channel, me, reply }) => {
    const [lastMessageReached, setLastMessageReached] = useState(false)
    const [lastFetchedTimestamp, setLastTimestamp] = useState(new Timestamp(Date.now() / 1000, 0))
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [initialized, setInitialized] = useState<boolean>(false);
    const messages = useGroupMessages(x => x.groupMessages[channel] || [])
    const { pushMessages } = useGroupMessages()
    const [newMessage, setNewMessage] = useState<string | undefined>();
    const containerRef = useRef<HTMLIonContentElement>(null)
    const hasMessages = messages.length != 0;
    useEffect(() => {
        if (!channel) return;

        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");

        const unsubscribe = onSnapshot(
            query(messagesCol, orderBy("sent", "asc")),
            (snapshot) => {
                const newMessages: Message[] = []; // Explicitly typing as an array of Message
                let replies: Message[] = []; // Explicitly typing as an array of Message

                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added" || change.type === "modified") {
                        const messageData = change.doc.data();
                        if (isValidMessage(messageData)) {
                            newMessages.push({ ...messageData, id: change.doc.id } as Message);
                        }
                    }
                    // Handle 'removed' type if needed
                });

                // Update the state with new messages
                if (newMessages.length > 0) {
                    pushMessages(channel, newMessages, replies);
                    setNewMessage(newMessages[newMessages.length - 1].id);
                    setTimeout(() => {
                        containerRef.current?.scrollToBottom(500);
                    }, 1);
                }
            }
        );

        return () => unsubscribe();
    }, [channel]);
    const fetchMore = useCallback(async (event: any) => {
        if (loadingMore) {
            setTimeout(() => {
                event.complete();
            }, 500)
            return;
        }
        setLoadingMore(true);
        console.log("FETCHING MORE");
        const db = getFirestore(app);
        const messagesCol = collection(db, "channel", channel, "messages");
        const q = query(messagesCol, orderBy("sent", "desc"), startAfter(lastFetchedTimestamp), limit(14));
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
                event.complete();
                pushMessages(channel, inputMessages, replies);
                setLastTimestamp((olderMessages[olderMessages.length - 1] as any).sent);
            }
            setLoadingMore(false);

        })
    }, [messages, lastFetchedTimestamp, loadingMore, initialized])
    useEffect(() => {
        me && fetchMore({
            complete: () => {
                containerRef.current!.scrollToBottom(500); // 500ms for a smooth scroll
                setTimeout(() => {
                    setInitialized(true)

                }, 500)
            }
        });
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
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;


    useEffect(() => {
    }, [newMessage])
    const virtuosoRef = useRef<VirtuosoHandle>(null); // Create a reference
    return <IonContent ref={containerRef}>

        <IonInfiniteScroll position="top"
            onIonInfinite={(e) => {
                initialized ? fetchMore(e.target) : e.target.complete();
            }}
            threshold="100px"
            disabled={lastMessageReached}
        >
            <IonInfiniteScrollContent
                loadingSpinner="crescent"
                loadingText="Loading more messages..."
            />
        </IonInfiniteScroll>
        {messages.map(x => <NewChatBubble key={x.id} message={x} me={me.address} channel={channel} reply={reply} />)}
    </IonContent>


};

export default VirtuosoRoom;