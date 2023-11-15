import {
    IonButtons,
    IonCardTitle,
    IonCol,
    IonFab,
    IonGrid,
    IonPage,
    IonRow,
    IonSegment, IonSegmentButton, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave
} from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getAddress } from 'viem';
import { app } from '../App';
import { PostList } from '../components/PostList';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { usePost } from '../hooks/usePosts';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { nativeAuth } from '../lib/sugar';
import { OnBoarding } from './OnBoarding';
import { TribePage } from './TribePage';



const Posts: React.FC = () => {
    const auth = nativeAuth();
    const location = useLocation();
    // Function to get the post type from URL
    const getPostTypeFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('type') === 'recent' ? 'recent' : 'top';
    };
    const [postType, setPostType] = useState<'top' | 'recent'>(getPostTypeFromURL());
    const history = useHistory();

    const handleSegmentChange = (newValue: 'top' | 'recent') => {
        setPostType(newValue);
        const params = new URLSearchParams(location.search);
        params.set('type', newValue);
        history.push({ search: params.toString() });
    };

    // Sync state with URL changes
    useEffect(() => {
        setPostType(getPostTypeFromURL());
    }, [location.search]);

    const me = useMember(x => x.getCurrentUser());
    const [isNewPosting, setIsNew] = useState(false)
    const { open } = useWriteMessage();
    const { highlightPost } = usePost();
    const { push } = useHistory();
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'light';
    const { setPresentingElement } = useWriteMessage()
    const pageRef = useRef<any>(null)
    useIonViewDidEnter(() => {
        setPresentingElement(pageRef.current)
    })

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
        <IonPage ref={pageRef}>
            <TribeHeader title={'posts'}
                hide
                content={!isNewPosting ? <>
                    <IonButtons slot='start' style={{ marginLeft: 12 }}>
                        <IonCardTitle class='heavy' style={{ color: 'white', paddingTop: 5, letterSpacing: '-1.5px', fontWeight: 700, fontFamily: 'AvenirBold' }} >
                            tribe
                        </IonCardTitle>
                    </IonButtons>
                    <IonSegment
                        onIonChange={(e) => {
                            const newValue = e.detail.value;
                            if (newValue === 'top' || newValue === 'recent') {
                                handleSegmentChange(newValue);
                            }
                        }}
                        value={postType}
                        style={{ position: 'absolute', right: 15, top: 5 }}
                        swipeGesture={true}
                    >
                        <IonSegmentButton value={'top'} color={postType === 'top' ? 'medium' : 'paper'}>
                            Top
                        </IonSegmentButton>
                        <IonSegmentButton value={'recent'} color={postType === 'recent' ? 'medium' : 'paper'}>
                            New
                        </IonSegmentButton>
                    </IonSegment>
                </> : <></>
                }
            />

            < TribeContent color={bgColor} fullscreen page='posts'>
                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>
                            <PostList type={postType} max={10} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab slot="fixed" vertical="bottom" horizontal="end">
                    {me && <div onClick={() => {
                        open((message) => addPost(me.address, message as any), me.address, 'Write a post');
                    }} style={{ cursor: 'pointer', borderRadius: '1000px', color: 'white', background: '#FF6000', padding: '0px', paddingBottom: 3, height: '50px', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', }}>
                        +
                    </div>}
                </IonFab>

            </TribeContent >
            <TribeFooter page='posts' />
        </IonPage >
    );
};

export default Posts;