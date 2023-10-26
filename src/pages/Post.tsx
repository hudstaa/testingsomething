import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { app } from '../App';
import { PostCard } from '../components/PostCard';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { TribePage } from './TribePage';
import { nativeAuth } from '../lib/sugar';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import NewPost from './NewPost';



const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const auth = nativeAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));
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
        setDoc(voteRef, ({ vote })).then(() => {
            setVoteCache(vote)
        })
    }
    const [voted, setVoteCache] = useState<1 | -1 | null>(null);



    const makeComment = useCallback(async (postId: string, comment: { content: string, media?: { src: string, type: string } }) => {
        const author = me!.address;
        const newMessage = ({ ...comment, author, sent: serverTimestamp(), type: 'string', score: 0 });
        const db = getFirestore(app);
        const commentCol = collection(db, "post", postId, "comments");

        try {
            await addDoc(commentCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])
    if (id === 'new') {
        return <NewPost />
    }

    return <TribePage page='post'>
        <TribeHeader title={'Post'} />
        <TribeContent>
            <IonGrid>
                <IonRow>
                    <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>

                        <PostCard  {...post as any} handleVote={handleVote} makeComment={makeComment as any} voted={voted} uid={auth.currentUser?.uid || ""} />
                    </IonCol></IonRow></IonGrid>
        </TribeContent>
    </TribePage>
};


export default Post;