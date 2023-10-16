import React, { useState, useEffect, useCallback, useMemo } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import {
    IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent,
    IonText, IonToolbar, IonButton, IonBadge, IonIcon, IonItem, IonButtons, IonChip, IonRouterLink, IonTabBar, IonTabButton, IonTabs, IonFooter, IonSegment, IonSegmentButton, IonLabel, IonItemDivider
} from '@ionic/react';
import { albums, albumsOutline, call, chevronDown, chevronUp, heartSharp, person, pulse, pulseOutline, settings, wallet } from 'ionicons/icons';
import { MemberChip, MemberPfp, MemberToolbar } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { WriteMessage } from './Room';
import { collection, onSnapshot, doc, updateDoc, addDoc, getFirestore, serverTimestamp, limit, orderBy, query, Timestamp, setDoc, runTransaction, getDoc, increment } from 'firebase/firestore';
import { app } from '../App';
import { useMember } from '../hooks/useMember';
import { getAuth } from 'firebase/auth';
import { uuid } from 'uuidv4';
import { uniq, uniqId } from '../lib/sugar';
import { TribeFooter } from '../components/TribeFooter';
import { timeAgo } from '../components/TradeItem';


const voteScore = (votes: any) => {
    return Object.values(votes).reduce((acc: number, value) => value ? acc + 1 : acc - 1, 0)
}

const Splash: React.FC = () => {
    const [posts, setPosts] = useState<any>([]);
    const auth = getAuth();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid));
    useEffect(() => {
        const db = getFirestore(app);

        const postsRef = collection(db, 'post');
        const unsubscribe = onSnapshot(postsRef, snapshot => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, sent: doc.data().sent == null ? new Timestamp(new Date().getSeconds(), 0) : doc.data().sent })));
        });
        return unsubscribe;
    }, []);
    function handleVote(postId: string, uid: string, upvote: boolean) {
        const db = getFirestore(app);
        const postRef = doc(db, 'posts', postId);
        const voteRef = doc(postRef, 'votes', uid);

        return runTransaction(db, async (transaction) => {
            const voteSnapshot = await getDoc(voteRef,);

            if (voteSnapshot.exists()) {
                const currentVote = voteSnapshot.data().vote;

                if (currentVote === upvote) {
                    return;
                }

                const adjustment = upvote ? 2 : -2;
                transaction.update(postRef, {
                    voteScore: increment(adjustment)
                });
            } else {
                const adjustment = upvote ? 1 : -1;
                transaction.update(postRef, {
                    voteScore: increment(adjustment)
                });
            }

            transaction.set(voteRef, { vote: upvote });
        });
    }


    const addPost = async (content: string) => {
        const db = getFirestore(app);

        await addDoc(collection(db, 'post'), {
            author: me!.address, // Replace with actual user's address or ID
            content,
            sent: serverTimestamp(),
        });
        setPostType('recent');
    };

    const makeComment = useCallback(async (postId: string, content: string) => {
        const author = me!.address;
        const newMessage = ({ id: uuid(), postId, content, author, sent: serverTimestamp(), type: 'string' });
        const db = getFirestore(app);
        const commentCol = collection(db, "post", postId, "comments");

        try {
            await addDoc(commentCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])
    const [postType, setPostType] = useState('top')

    const getSort = useCallback((a: any, b: any) => {
        // if (postType === 'top') {
        //     return voteScore(b.votes) - voteScore(a.votes);
        // } else if (postType == 'recent') {

        return b.sent.seconds - a.sent.seconds;
        // }
    }, [postType])
    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'TRIBE'} />
            <TribeContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <IonSegment value={postType} onIonChange={(e) => {
                                setPostType(e.detail.value?.toString() || "top")
                            }}>
                                <IonSegmentButton value={'top'}>
                                    TOP
                                </IonSegmentButton>
                                <IonSegmentButton value={'recent'}>
                                    RECENT
                                </IonSegmentButton>
                            </IonSegment>
                            <IonCard>
                                <WriteMessage
                                    placeHolder='Whats happnin'
                                    address={''}
                                    sendMessage={addPost}
                                />
                            </IonCard>
                            {useMemo(() => posts.sort(getSort).map(({ id, author, content, sent, voteScore }: any) => (
                                <IonCard key={id}>
                                    <IonCardHeader >
                                        <IonGrid fixed>
                                            <IonRow>
                                                <IonCol size='10'>
                                                    <MemberToolbar address={author} />
                                                </IonCol>
                                                <IonCol size='2'>
                                                    <IonButton fill='clear' onClick={() => handleVote(id, auth.currentUser!.uid, true)} style={{ position: 'absolute', bottom: 25, right: 0 }}>
                                                        <IonBadge color={true ? 'success' : 'medium'}>
                                                            <IonIcon icon={chevronUp} />
                                                        </IonBadge>
                                                    </IonButton>
                                                    <IonLabel style={{ position: 'absolute', bottom: 22, right: 31 }}>
                                                        <IonText>{voteScore}</IonText>
                                                    </IonLabel>
                                                    <IonButton fill='clear' onClick={() => handleVote(id, auth.currentUser!.uid, false)} style={{ position: 'absolute', bottom: -25, right: 0 }}>
                                                        <IonBadge color={true ? 'danger' : 'medium'}>
                                                            <IonIcon icon={chevronDown} />
                                                        </IonBadge>
                                                    </IonButton>
                                                </IonCol>

                                            </IonRow>

                                        </IonGrid>

                                    </IonCardHeader>
                                    <IonCardContent >
                                        <IonText>
                                            {content}
                                        </IonText>
                                    </IonCardContent>

                                    <CommentList postId={id} />
                                    <WriteMessage
                                        placeHolder='write a comment'
                                        address={''}
                                        sendMessage={(content) => { makeComment(id, content) }} // Modify this if you want to handle comments
                                    />
                                </IonCard>
                            )), [postType, posts])}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </TribeContent>
            <TribeFooter page='posts' />
        </IonPage >
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
        <IonGrid>
            {comments.map((comment, i) => (
                <IonRow key={i}>
                    <MemberPfp size='smol' address={comment.author} />
                    <IonChip style={{ whiteSpace: 'pre-wrap' }}>
                        {comment.content}
                    </IonChip>
                </IonRow>))}

        </IonGrid>

    );
};

export default Splash;