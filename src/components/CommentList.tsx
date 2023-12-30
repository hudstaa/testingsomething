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
import Linkify from "linkify-react";
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
        <IonList style={{ marginRight: offset ? -35 : undefined }}>
            {comments.map((comment, i) => (
                < div key={i}>
                    <div style={{backgroundColor: "var(--ion-color-paper"}}>
                    <IonItem lines="none" color={'lightt'} style={{ marginTop: 0, marginLeft: 0, marginBottom: 0, paddingTop: 12, paddingBottom: 0, paddingRight: 24 }} >
                        <IonButtons slot='start' style={{ position: 'absolute', paddingLeft: 28, top: -2.5, fontSize: "1rem"}}>
                        <MemberAlias color='dark' address={comment.author} />
                        </IonButtons>
                        <div style={{position: 'absolute', top: 0, borderRadius: 100}}><MemberPfp color='dark' size="smol" style={{ top: 0}}address={comment.author} />
                        </div>
                        <div style={{display: "flex", flexDirection: "column"}}>
                        <IonText className='regular' color='dark' style={{ paddingLeft:0, whitespace: 'pre-wrap', marginTop: 32, marginLeft: 0, marginBottom: 0, fontSize: "1.05rem", letterSpacing: '-0.0135em', lineHeight: "1.135em"}} >
                            <Linkify>
                                {comment.content}
                            </Linkify>
                        </IonText>
                        
                        </div>
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
                        <IonItem lines="none" color='lightt' style={{ marginLeft: 0, marginRight: 85, paddingBottom: 4, paddingTop: 8}} >
                            {comment.media.type.includes("image") ?
                                <img style={{ border: '1px solid var(--ion-color-light-tint)', borderRadius: 12.5, width: '100%' }} src={comment.media.src} /> : <video preload="metadata" controls style={{ borderRadius: 20, color: 'white', width: '100%' }} src={comment.media.src + '#t=0.1'} />}
                        </IonItem>
                    }
                    <IonItem lines="none" color={'lightt'}>
                    <div style={{paddingTop: 0, marginTop: 0, display: "flex", flexDirection: "row"}}>
                        <IonButtons slot='start 'style={{ paddingBottom: 0, marginLeft: 0, bottom: 0, fontSize: ".9rem", opacity: '50%' }}>
                        <IonText>
                        <span className="medium" onMouseDown={() => {
                                setCommentPath(comment.id);
                            }}>Reply</span>
                        </IonText>
                        </IonButtons>
                        <IonText color={'dark'} className='light' style={{ paddingBottom: 0, marginLeft: 4, bottom: 0, fontSize: ".9rem", opacity: '50%' }}>
                            • {timestampAgo(comment.sent)}
                            
                        </IonText>
                        </div>
                        </IonItem>
                </div>
                </div>))
            }
        </IonList >
    );
};
