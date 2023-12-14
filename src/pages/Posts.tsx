import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFab,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonPage,
    IonRow,
    IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave
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
import { chevronDown, chevronUp, listCircle, notifications } from 'ionicons/icons';
import { MemberPfp, MemberPfpImg } from '../components/MemberBadge';
import { useNotifications } from '../hooks/useNotifications';
import { removeUndefinedProperties } from '../components/WriteMessage';



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
        addDoc(collection(db, 'post'), removeUndefinedProperties(newPost)).then((doc) => {
            push('/post/' + doc.id);
        });
    }
    const { show: showNotifications } = useNotifications();
    const notifs = useNotifications(x => x.notifications.length);
    const [hideToolbar, setHideToolbar] = useState<boolean>(false)
    if (!me) {
        return <OnBoarding me={me} dismiss={function (): void {

        }} />
    }
    return (
        <IonPage ref={pageRef}>
            <IonHeader style={{ position: 'absolute' }}>
                {!hideToolbar ? <IonToolbar color="paper" style={{ paddingLeft: 10}}>
                    <IonButtons slot='start'>
                        <IonSelect interface='popover' className='heavy' style={{fontSize:20}} toggleIcon={chevronDown} color='paper'
                            onIonChange={(e) => {
                                const newValue = e.detail.value;
                                if (newValue === 'top' || newValue === 'recent') {
                                    handleSegmentChange(newValue);
                                }
                            }}
                            value={postType}                    >
                            <IonSelectOption value={'top'} color={postType === 'top' ? 'medium' : 'paper'} >
                                Top
                            </IonSelectOption>
                            <IonSelectOption value={'recent'} color={postType === 'recent' ? 'medium' : 'paper'}>
                                New
                            </IonSelectOption>
                        </IonSelect>
                    </IonButtons>

                    <IonButtons slot='end'>
                        <IonButton onClick={() => {
                            showNotifications()
                        }}>
                            <IonBadge color='transparent' style={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <IonText className='medium' style={{ fontSize: '16px', paddingTop: 0, paddingRight: 4 }} color='dark'>
                                    {notifs}
                                </IonText>
                                <IonIcon color='dark' size="small" icon={notifications} />
                            </IonBadge>
                        </IonButton>
                        <IonButton onMouseDown={() => {
                            push('/account')
                        }}>
                            <MemberPfpImg size='smol' address={me.address} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar> : <IonToolbar style={{ height: 0 }} color='paper' />}
            </IonHeader>
            < IonContent color={bgColor} fullscreen onIonScroll={(e: any) => {
                const isCloseToTop = e.detail.scrollTop < 100;
                const isCloseToBottom =
                    e.detail.scrollTop + e.target.clientHeight >=
                    e.target.scrollEl.height - 500;
                if (isCloseToTop) {
                    !hideToolbar && setHideToolbar(false)
                    return;
                }
                if (isCloseToBottom) {
                    return;
                }
                console.log(e.detail.velocityY)
                if (e.detail.velocityY < -0.5) {
                    hideToolbar && setHideToolbar(false);
                }
                if (e.detail.velocityY > 0.5) {
                    !hideToolbar && setHideToolbar(true)
                }
            }} scrollEvents>
                <IonHeader>
                    <IonToolbar className='transparent'/>
                </IonHeader>
                <IonGrid style={{ paddingLeft: 0, paddingRight: 0, paddingTop:10 }}>
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

            </IonContent >
            <TribeFooter page='posts' />
        </IonPage >
    );
};

export default Posts;