import { IonCol, IonContent, IonFooter, IonGrid, IonItem, IonPage, IonRow, IonTitle, IonHeader, IonToolbar, IonSkeletonText, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { app } from '../App';
import { PostCard } from '../components/PostCard';
import { TribeHeader } from '../components/TribeHeader';
import { WriteMessage, removeUndefinedProperties } from '../components/WriteMessage';
import { useMember } from '../hooks/useMember';
import { useNotifications } from '../hooks/useNotifications';
import { usePost } from '../hooks/usePosts';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { hideTabs, nativeAuth, showTabs } from '../lib/sugar';
import NewPost from './NewPost';
import { OnBoarding } from './OnBoarding';
import { chevronBack, chevronDown, push } from 'ionicons/icons';
import { MemberPfpImg } from '../components/MemberBadge';



const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const post = usePost(x => x.postCache[id])
    const auth = nativeAuth();
    const { setPostsData, updatePost } = usePost();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'white';

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

    const { setPresentingElement, commentPath, message } = useWriteMessage()
    const pageRef = useRef<any>(null)
    const textAreaRef = useRef<HTMLIonTextareaElement>(null);
    const [shouldFocusWriteMessage, setShouldFocusWriteMessage] = useState(false);

    const focusOnTextArea = () => {
      textAreaRef.current?.setFocus();
    };

    const triggerFocusOnWriteMessage = () => {
        setShouldFocusWriteMessage(true);
      };

    useEffect(() => {
        if (shouldFocusWriteMessage) {
          setShouldFocusWriteMessage(false);
        }
      }, [shouldFocusWriteMessage]);

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
            await addDoc(commentCol, removeUndefinedProperties(newMessage));
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me])
    const contentRef = useRef<HTMLIonContentElement>(null)
    const {push}=useHistory()
    const {notifications:notifs}=useNotifications()
    if (id === 'new') {
        return <NewPost />
    }
    if (me === null) {
        return <OnBoarding me={me} dismiss={() => { }} />
    }
    return <IonPage color={bgColor} ref={pageRef}>
        <TribeHeader showBackButton={true} title='Post'/>
        <IonContent color={bgColor} ref={contentRef}>
            <IonGrid style={{ padding: 0 }}>
                <IonRow>
                    <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>
                        {post !== null ? <PostCard onPostPage={true} id={id} {...post as any} handleVote={handleVote} makeComment={makeComment as any} voted={voted} uid={auth.currentUser?.uid} /> : <IonSkeletonText />}
                    </IonCol>
                </IonRow>


            </IonGrid>
        </IonContent>
        <IonFooter>
            {commentPath && <IonItem>
                {commentPath}
            </IonItem>}
            <WriteMessage shouldFocus={shouldFocusWriteMessage} sendMessage={(message) => {
                makeComment(id, message).then(() => {
                    contentRef.current?.scrollToBottom(500);
                })
            }} placeHolder={'Write a comment'} address={me.address} />
        </IonFooter>
    </IonPage>
};


export default Post;