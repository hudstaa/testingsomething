import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import { Timestamp, addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { app } from '../App';
import { PostCard } from '../components/PostCard';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { TribePage } from './TribePage';
import { hideTabs, nativeAuth, showTabs, slideTabIn, slideTabOut } from '../lib/sugar';
import { IonCol, IonContent, IonFooter, IonGrid, IonPage, IonRow, IonSkeletonText, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import NewPost from './NewPost';
import { OnBoarding } from './OnBoarding';
import { WriteMessage } from '../components/WriteMessage';
import { useNotifications } from '../hooks/useNotifications';
import { MemberAlias } from '../components/MemberBadge';
import { timeAgo } from '../components/TradeItem';
import { usePost } from '../hooks/usePosts';
import { useWriteMessage } from '../hooks/useWriteMessage';



const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const post = usePost(x => x.postCache[id])
    const auth = nativeAuth();
    const { setPostsData, updatePost } = usePost();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'light';

    useEffect(() => {
        id && !post && getDoc(doc(getFirestore(app), 'post', id)).then((postDoc) => {
            setPostsData([{ ...postDoc.data(), id: postDoc.id }] as any[]);
        })
    }, [id, post])
    useEffect(() => {
        id && uid && getDoc(doc(getFirestore(app), 'post', id, 'votes', uid!)).then((postDoc) => {
            setVoteCache(postDoc.data()?.vote || null);
        })
    }, [id, uid])

    const { setPresentingElement } = useWriteMessage()
    const pageRef = useRef<any>(null)

    useIonViewDidEnter(() => {
        hideTabs();
        setPresentingElement(pageRef.current)
    })
    useIonViewDidLeave(() => {
        showTabs();
    })

    function handleVote(postId: string, uid: string, upvote: boolean) {
        const db = getFirestore(app);
        const postRef = doc(db, 'post', postId);
        const voteRef = doc(postRef, 'votes', uid);
        const vote = upvote ? 1 : -1;
        let diff = 0;
        if (upvote && voted == -1) {
            diff = 2;
        }
        if (!upvote && voted == 1) {
            diff = -2;
        }
        if (voted === null || typeof voted === 'undefined') {
            diff = vote;
        }
        let newPost = { ...post } as any;
        newPost.score = newPost.score + diff;
        updatePost(newPost)
        setDoc(voteRef, ({ vote })).then(() => {
            setVoteCache(vote)
        })
    }
    const [voted, setVoteCache] = useState<1 | -1 | null>(null);


    const { commentAdded } = useNotifications();
    const makeComment = useCallback(async (postId: string, comment: { content: string, media?: { src: string, type: string } }) => {
        const author = me!.address;
        const newMessage = ({ ...comment, author, sent: serverTimestamp(), type: 'string', score: 0 });
        const db = getFirestore(app);
        const commentCol = collection(db, "post", postId, "comments");
        commentAdded(postId)

        try {
            await addDoc(commentCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])
    const contentRef = useRef<HTMLIonContentElement>(null)
    if (id === 'new') {
        return <NewPost />
    }
    if (me === null) {
        return <OnBoarding me={me} dismiss={() => { }} />
    }
    return <IonPage ref={pageRef}>
        <TribeHeader showBackButton={true} title={'Post from ' + post?.sent?.toDate().toDateString()} />
        <IonContent color={bgColor} ref={contentRef}>
            <IonGrid style={{ padding: 0 }}>
                <IonRow>
                    <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>
                        {post !== null ? <PostCard id={id} {...post as any} handleVote={handleVote} makeComment={makeComment as any} voted={voted} uid={auth.currentUser?.uid} /> : <IonSkeletonText />}
                    </IonCol></IonRow>


            </IonGrid>
        </IonContent>
        <IonFooter>
            <WriteMessage sendMessage={(message) => {
                makeComment(id, message).then(() => {
                    contentRef.current?.scrollToBottom(500);
                })
            }} placeHolder={'Write a comment'} address={me.address} />
        </IonFooter>
    </IonPage>
};


export default Post;