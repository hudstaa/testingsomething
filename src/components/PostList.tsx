import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, Timestamp, doc, setDoc, addDoc, serverTimestamp, getDoc, getAggregateFromServer, sum, query, limitToLast, orderBy, where } from "firebase/firestore";
import { useState, useEffect, useCallback, useMemo } from "react";
import { app } from "../App";
import { useMember } from "../hooks/useMember";
import { Post } from "./Post";

export const PostList: React.FC<{ type: 'top' | 'recent', limit: number, from?: string }> = ({ type, limit, from }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const auth = getAuth();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid));
    useEffect(() => {
        if (auth.currentUser === null) {
            return;
        }
        const db = getFirestore(app);
        const postsRef = query(collection(db, 'post'), orderBy(type == 'top' ? 'score' : 'sent', 'desc'), limitToLast(limit));
        const authorPostsRef = query(collection(db, 'post'), orderBy('author'), where('author', from ? '==' : '!=', from ? from : null), orderBy(type == 'top' ? 'score' : 'sent', 'desc'), limitToLast(limit));
        const unsubscribe = onSnapshot(from ? authorPostsRef : postsRef, snapshot => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, sent: doc.data().sent == null ? new Timestamp(new Date().getSeconds(), 0) : doc.data().sent })));
        });
        return unsubscribe;
    }, [type, from, auth.currentUser]);

    function handleVote(postId: string, uid: string, upvote: boolean) {
        const db = getFirestore(app);
        const postRef = doc(db, 'post', postId);
        const voteRef = doc(postRef, 'votes', uid);
        const vote = upvote ? 1 : -1;
        if (voted[postId] != vote) {
            setVoteScore(x => ({ ...x, [postId]: (x[postId] || 0) + vote }))
        }
        setVoteCache((x) => ({ ...x, [postId]: vote }))
        setDoc(voteRef, ({ vote }))
    }


    const makeComment = useCallback(async (postId: string, comment: { content: string, media?: { src: string, type: string } }) => {
        const author = me!.address;
        const newMessage = ({ ...comment, author, sent: serverTimestamp(), type: 'string' });
        const db = getFirestore(app);
        const commentCol = collection(db, "post", postId, "comments");

        try {
            await addDoc(commentCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])


    const [voted, setVoteCache] = useState<Record<string, 1 | -1 | null>>({});
    const [voteScore, setVoteScore] = useState<Record<string, number>>({});


    useEffect(() => {
        if (typeof auth.currentUser?.uid === 'undefined') {
            return;
        }
        posts.forEach(({ id }) => {
            if (typeof voted[id] === 'undefined') {
                setVoteCache(x => ({ ...x, [id]: null }))
                const db = getFirestore(app);
                const postRef = doc(db, 'post', id);
                const voteRef = doc(postRef, 'votes', auth.currentUser!.uid);
                getDoc(voteRef).then((doc) => {
                    const data = doc.data() || { vote: null }
                    setVoteCache(x => ({ ...x, [id]: data.vote }))
                })
            }
        })
    }, [posts])

    return <>
        {useMemo(() => posts.map((post) => (
            <Post key={post.id} {...post} handleVote={handleVote} makeComment={makeComment} voted={voted[post.id]} uid={auth.currentUser?.uid} />
        )), [type, posts, voted, voteScore])}

    </>
}