import { IonGrid, IonRow, IonChip, IonAvatar, IonImg, IonButtons, IonCol, IonText, IonItem, IonList, IonBadge } from "@ionic/react";
import { getFirestore, collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { useState, useEffect } from "react";
import { app } from "../App";
import { uniqId } from "../lib/sugar";
import { MemberPfp } from "./MemberBadge";
import { Message } from "../models/Message";
import { timeAgo } from "./TradeItem";
type CommentListProps = {
    postId: string;
};


export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
    const [comments, setComments] = useState<Message[]>([]);
    const [latestMessageSent, setLatestMessageSent] = useState<Date | null>(null);

    const modMessage = (channel: any, message: Message) => {
        // Function implementation for modifying the message
    };

    useEffect(() => {
        if (!postId) {
            return;
        }
        (async () => {
            const db = getFirestore(app);
            const messagesCol = collection(db, "post", postId, "comments");

            onSnapshot(
                query(
                    messagesCol,
                    orderBy("sent", "desc"),
                    limit(20)
                ),
                (channelDocs) => {
                    const changes = channelDocs.docChanges();
                    changes.forEach((change) => {
                        if (change.type === 'added') {
                            const newMessage = { ...change.doc.data() as Message, id: change.doc.id };
                            setComments(prevComments => uniqId([...prevComments, newMessage]) as any);
                        } else if (change.type === 'modified') {
                            const newMessageTimestamped = change.doc.data() as Message;
                            if (newMessageTimestamped.sent) {
                                setLatestMessageSent(newMessageTimestamped.sent as any);
                            }
                            modMessage(postId, newMessageTimestamped); // Assuming channel refers to postId
                            console.log("mod");
                        }
                    });
                }
            );
        })();

    }, [postId]);

    return (
        <IonList>
            {comments.map((comment, i) => (
                <IonItem key={i} color={'light'} lines="none">
                    <MemberPfp size='smol' address={comment.author} />
                    <IonText style={{ whitespace: 'pre-wrap' }} color={'medium'}>

                        {comment.content}

                    </IonText>
                    {comment.media &&
                        <IonImg style={{ height: 50 }} src={comment.media.src} />
                    }
                    <IonButtons slot='end'>
                        <IonBadge color={'light'}>
                            <IonText color='medium'>
                                {timeAgo(new Date((comment.sent?.seconds ? comment.sent.seconds * 1000 : Date.now())))}
                            </IonText>
                        </IonBadge>
                    </IonButtons>
                </IonItem>))
            }

        </IonList >

    );
};
