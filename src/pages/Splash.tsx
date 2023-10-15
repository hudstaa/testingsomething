import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
    IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent,
    IonText, IonToolbar, IonButton, IonBadge, IonIcon, IonItem, IonButtons, IonChip
} from '@ionic/react';
import { chevronDown, chevronUp, heartSharp, wallet } from 'ionicons/icons';
import { MemberChip, MemberPfp, MemberToolbar } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { WriteMessage } from './Room';
import { collection, onSnapshot, doc, updateDoc, addDoc, getFirestore, serverTimestamp, limit, orderBy, query } from 'firebase/firestore';
import { app } from '../App';
import { useMember } from '../hooks/useMember';
import { getAuth } from 'firebase/auth';
import { uuid } from 'uuidv4';
import { uniq, uniqId } from '../lib/sugar';

const Splash: React.FC = () => {
    const [posts, setPosts] = useState<any>([]);
    const auth = getAuth();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid));
    useEffect(() => {
        const db = getFirestore(app);

        const postsRef = collection(db, 'post');
        const unsubscribe = onSnapshot(postsRef, snapshot => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });
        return unsubscribe;
    }, []);

    const handleVote = async (postId: string, change: number) => {
        const db = getFirestore(app);
        const postRef = doc(db, 'post', postId);
        await updateDoc(postRef, {
            votes: change

        });
    };

    const addPost = async (content: string) => {
        const db = getFirestore(app);

        await addDoc(collection(db, 'post'), {
            author: me?.address, // Replace with actual user's address or ID
            content,
            votes: 0
        });
    };

    const makeComment = useCallback(async (postId: string, content: string) => {
        const author = me?.address;
        const newMessage = ({ id: uuid(), postId, content, author, sent: serverTimestamp(), type: 'string' });
        const db = getFirestore(app);
        const commentCol = collection(db, "post", postId, "comments");

        try {
            await addDoc(commentCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])

    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'TRIBE'} />
            <TribeContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <IonCard>
                                <WriteMessage
                                    placeHolder='Whats happnin'
                                    address={''}
                                    sendMessage={addPost}
                                />
                                <IonToolbar></IonToolbar>
                            </IonCard>
                            {posts.map(({ id, author, content, votes }: any) => (
                                <IonCard key={id}>
                                    <IonCardHeader color='light'>
                                        <MemberToolbar address={author} />
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonText>
                                            {content}
                                        </IonText>
                                    </IonCardContent>
                                    <IonToolbar>
                                        <IonButton fill='clear' onClick={() => handleVote(id, -1)}>
                                            <IonBadge color={'danger'}>
                                                <IonIcon icon={chevronDown} />
                                            </IonBadge>
                                        </IonButton>
                                        <IonText>{votes}</IonText>
                                        <IonButton fill='clear' onClick={() => handleVote(id, 1)}>
                                            <IonBadge color={'success'}>
                                                <IonIcon icon={chevronUp} />
                                            </IonBadge>
                                        </IonButton>
                                    </IonToolbar>
                                    <CommentList postId={id} />
                                    <WriteMessage
                                        placeHolder='write a comment'
                                        address={''}
                                        sendMessage={(content) => { makeComment(id, content) }} // Modify this if you want to handle comments
                                    />
                                </IonCard>
                            ))}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </TribeContent>
        </IonPage>
    );
};


type Message = {
    content: string;
    author: string;
    sent: Date;
    //... Add other necessary fields
};

type CommentListProps = {
    postId: string;
};

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
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
                            const newMessage = change.doc.data() as Message;
                            setComments(prevComments => uniqId([...prevComments, newMessage]) as any);
                            console.log("new");
                        } else if (change.type === 'modified') {
                            const newMessageTimestamped = change.doc.data() as Message;
                            if (newMessageTimestamped.sent) {
                                setLatestMessageSent(newMessageTimestamped.sent);
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
        <div>
            {comments.map((comment, idx) => (
                <IonItem color='light' key={idx} lines='none'>
                    <IonChip>
                        <MemberPfp address={comment.author} />
                        <IonText>
                            {comment.content}
                        </IonText>
                    </IonChip>
                </IonItem>
            ))}
        </div>
    );
};

export default Splash;