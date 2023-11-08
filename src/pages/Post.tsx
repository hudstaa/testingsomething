import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { app } from '../App';
import { PostCard } from '../components/PostCard';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { TribePage } from './TribePage';
import { nativeAuth } from '../lib/sugar';
import { IonCol, IonContent, IonFooter, IonGrid, IonRow } from '@ionic/react';
import NewPost from './NewPost';
import { OnBoarding } from './OnBoarding';
import { WriteMessage } from '../components/WriteMessage';
import { useNotifications } from '../hooks/useNotifications';



const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const auth = nativeAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());
    const [post, setPost] = useState<null | { id: string, commentCount: number | undefined, content: string, media?: { src: string, type: string } }>()
    useEffect(() => {
        id && getDoc(doc(getFirestore(app), 'post', id)).then((postDoc) => {
            setPost({ ...postDoc.data(), id: postDoc.id } as any);

        })
    }, [id])
    useEffect(() => {
        id && uid && getDoc(doc(getFirestore(app), 'post', id, 'votes', uid!)).then((postDoc) => {
            setVoteCache(postDoc.data()?.vote || null);
        })
    }, [id, uid])

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
        setPost(newPost)
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
    return <TribePage page='post'>
        <TribeHeader title={'〱'} />
        <IonContent ref={contentRef}>
            <IonGrid style={{ padding: 0 }}>
                <IonRow>
                    <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>
                        <PostCard  {...post as any} handleVote={handleVote} makeComment={makeComment as any} voted={voted} uid={auth.currentUser?.uid} />
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
    </TribePage>
};


export default Post;