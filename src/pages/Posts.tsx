import {
    IonButtons,
    IonCardTitle,
    IonCol,
    IonFab,
    IonGrid,
    IonRow,
    IonSegment, IonSegmentButton
} from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { getAddress } from 'viem';
import { app } from '../App';
import { PostList } from '../components/PostList';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { useNotifications } from '../hooks/useNotifications';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { nativeAuth } from '../lib/sugar';
import { OnBoarding } from './OnBoarding';
import { TribePage } from './TribePage';



const Posts: React.FC = () => {

    const [postType, setPostType] = useState<'top' | 'recent'>('top')
    const auth = nativeAuth();
    const me = useMember(x => x.getCurrentUser());
    const { notifications } = useNotifications();
    const [isNewPosting, setIsNew] = useState(false)
    const { open } = useWriteMessage();
    const { push } = useHistory();
    if (!me) {
        return <OnBoarding me={me} dismiss={function (): void {

        }} />
    }
    const addPost = (from: string, message: { content: string, media?: { src: string, type: string } }) => {
        const db = getFirestore(app);
        const newPost: any = {
            author: getAddress(from), // Replace with actual user's address or ID
            content: message.content,
            sent: serverTimestamp(),
            score: 0
        }
        if (message.media) {
            newPost['media'] = message.media;
        }
        addDoc(collection(db, 'post'), newPost).then((doc) => {
            push('/post/' + doc.id);
        });
    }
    return (
        <TribePage page='posts'>
            <TribeHeader title={'posts'}
                hide
                content={!isNewPosting ? <>
                    <IonButtons slot='start' style={{ marginLeft: 12 }}>
                        <IonCardTitle style={{ paddingTop: 5, letterSpacing: '-2px', fontFamily: 'AvenirBold' }} >
                            tribe
                        </IonCardTitle>
                    </IonButtons>
                    <IonSegment value={postType} style={{ position: 'absolute', right: 15, top: 5 }}>
                        <IonSegmentButton value={'top'} color={postType === 'top' ? 'light' : 'paper'} onClick={() => {
                            setPostType('top')
                        }}>
                            Top
                        </IonSegmentButton>
                        <IonSegmentButton value={'recent'} color={postType === 'recent' ? 'light' : 'paper'} onClick={() => {
                            setPostType('recent')
                        }}>
                            New
                        </IonSegmentButton>
                    </IonSegment>
                </> : <></>
                }
            />

            < TribeContent fullscreen page='posts'>
                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>
                            <PostList type={postType} max={10} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab slot="fixed" vertical="bottom" horizontal="center">
                    {me && <div onClick={() => {
                        open((message) => addPost(me.address, message as any), me.address, 'Write a post');
                    }} style={{ cursor: 'pointer', borderRadius: 1000, color: 'white', background: '#FF6000', padding: 13 }} >
                        New Post
                    </div>}
                </IonFab>
            </TribeContent >
            <TribeFooter page='posts' />
        </TribePage >
    );
};

export default Posts;