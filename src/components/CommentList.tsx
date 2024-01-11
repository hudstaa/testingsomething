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
import { TaggableContent } from "./TaggableContent";
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
                    {comment.reply && comment.reply}
                    <div style={{ backgroundColor: "var(--ion-color-paper" }}>
                        <IonItem lines="none" color={'lightt'} style={{ marginTop: 0, marginLeft: -8, marginBottom: 0, paddingTop: 12, paddingBottom: 0, paddingRight: 24 }} >
                            <IonButtons slot='start' style={{ position: 'absolute', paddingLeft: 38, top: -2.5, fontSize: "1rem" }}>
                                <MemberAlias color='dark' address={comment.author} />
                            </IonButtons>
                            <div style={{ position: 'absolute', top: 0, marginLeft: 0, borderRadius: 100 }}><MemberPfp color='dark' size="veru-smol" style={{ top: 0 }} address={comment.author} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <IonText className='regular' color='dark' style={{ paddingLeft: 0, whitespace: 'pre-wrap', marginTop: 16, marginLeft: 38, marginBottom: 0, fontSize: "0.975rem", letterSpacing: '.0135em' }} >
                                    <TaggableContent>
                                        {comment.content}
                                    </TaggableContent>
                                </IonText>

                            </div>


                        </IonItem>
                        {
                            comment.media &&
                            <IonItem lines="none" color='lightt' style={{ marginLeft: 30, marginRight: 32, paddingBottom: 4, paddingTop: 8 }} >
                                {comment.media.type.includes("image") ?
                                    <img style={{ border: '1px solid var(--ion-color-light-tint)', borderRadius: 12.5, width: '100%' }} src={comment.media.src} /> : <video preload="metadata" controls style={{ borderRadius: 20, color: 'white', width: '100%' }} src={comment.media.src + '#t=0.1'} />}
                            </IonItem>
                        }

                        <IonItem lines="none" color={'lightt'}>
                            <div style={{ paddingTop: 0, width: '100%', marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {/* Reply/Time Ago section on the left */}
                                <div style={{ display: "flex", alignItems: "center", fontSize: ".975rem", opacity: '50%' }}>
                                    <IonButtons style={{ paddingBottom: 0, marginLeft: 30 }}>
                                        <IonText>
                                            <span className="medium" onMouseDown={() => { setCommentPath(comment.id); }}>Reply</span>
                                        </IonText>
                                    </IonButtons>
                                    <IonText color={'dark'} className='medium' style={{ marginLeft: 4 }}>
                                        • {timestampAgo(comment.sent)}
                                    </IonText>
                                </div>

                                {/* Voter component on the right */}
                                <IonButtons style={{ paddingRight: 28 }}>
                                    <Voter score={comment.score || 0} commentId={comment.id} postId={postId} uid={uid} handleVote={function (upvote: boolean): void {
                                        const db = getFirestore(app);
                                        const uid = getAuth().currentUser!.uid;
                                        const postRef = doc(db, 'post', postId);
                                        const commentRef = doc(postRef, 'comments', comment.id);
                                        const voteRef = doc(commentRef, 'votes', uid);
                                        const vote = upvote ? 1 : -1;
                                        setDoc(voteRef, ({ vote }));
                                    }} />
                                </IonButtons>
                            </div>

                        </IonItem>

                    </div>
                </div>))
            }
        </IonList >
    );
};
