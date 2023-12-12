import { IonButton, IonButtons, IonGrid, IonImg, IonItem, IonList, IonRow, IonText } from "@ionic/react";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, limit, limitToLast, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../App";
import { uniqId } from "../lib/sugar";
import { Message } from "../models/Message";
import { MemberAlias, MemberPfp, MemberUsername } from "./MemberBadge";
import Voter from "./Voter";
import { timestampAgo } from "./TradeItem";
import { useWriteMessage } from "../hooks/useWriteMessage";
type CommentListProps = {
    postId: string;
    uid: string
    amount: number | undefined
    total: number
    offset?: boolean
};


export const CommentList: React.FC<CommentListProps> = ({ postId, amount, uid, offset = false }) => {
    const [comments, setComments] = useState<Message[]>([]);
    const { setCommentPath } = useWriteMessage();
    useEffect(() => {
        if (!postId) {
            return;
        }

        const db = getFirestore(app);
        const messagesCol = query(collection(db, "post", postId, "comments"));

        const listener = onSnapshot(
            query(
                messagesCol,
                orderBy("score", "desc"),
                orderBy("sent", "asc")

            ),
            (channelDocs) => {
                const changes = channelDocs.docChanges();
                changes.forEach((change) => {
                    if (change.type === 'added') {
                        const newMessage = { ...change.doc.data() as Message, id: change.doc.id };
                        setComments(prevComments => uniqId([...prevComments, newMessage]) as any);
                    } else if (change.type === 'modified') {
                        const newMessageTimestamped = change.doc.data() as Message;
                    }
                });
            }
        );
        return listener
    }, [postId]);

    return (
        <IonList style={{ backgroundColor: 'var(--ion-color-paper)', marginRight: offset ? -35 : undefined }} color='paper'>
            <div style={{ height: 5 }}>

            </div>
            {comments.map((comment, i) => (
                < div key={i}>

                    <IonItem color={'paper'} style={{ marginTop: 5, marginLeft: -3, marginBottom: 10, paddingBottom: 10 }} >
                        <IonText color={'dark'} style={{ position: 'absolute', bottom: 0, fontSize: 11, opacity: '75%' }}>
                            {timestampAgo(comment.sent)}
                            {/* <span onMouseDown={() => {
                                setCommentPath(comment.id);
                            }} style={{ margin: 0, padding: 0, paddingLeft: 4, fontSize: 9 }}>Reply</span> */}
                        </IonText>
                        <IonButtons slot='start' style={{ position: 'absolute', top: -3, fontSize: 11, opacity: '75%' }}>
                            <MemberUsername color='dark' address={comment.author} />
                        </IonButtons>
                        <IonText className='dark' style={{ whitespace: 'pre-wrap', marginTop: 18, marginBottom: 20 }} >
                            {comment.content}
                        </IonText>
                        <IonButtons slot='end'>
                            <Voter score={comment.score || 0} commentId={comment.id} postId={postId} uid={uid} handleVote={function (upvote: boolean): void {
                                const db = getFirestore(app);
                                const uid = getAuth().currentUser!.uid;
                                const postRef = doc(db, 'post', postId);
                                const commentRef = doc(postRef, 'comments', comment.id);
                                const voteRef = doc(commentRef, 'votes', uid);
                                const vote = upvote ? 1 : -1;
                                setDoc(voteRef, ({ vote }))
                            }} />

                        </IonButtons>
                    </IonItem>
                    {
                        comment.media &&
                        <IonItem lines="none" color='paper'>
                            {comment.media.type.includes("image") ?
                                <img style={{ borderRadius: 20, color: 'white', width: '100%' }} src={comment.media.src} /> : <video preload="metadata" controls style={{ borderRadius: 20, color: 'white', width: '100%' }} src={comment.media.src + '#t=0.1'} />}
                        </IonItem>
                    }
                </div>))
            }
        </IonList >
    );
};
