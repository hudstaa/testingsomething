import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonTitle,
    IonCol,
    IonContent,
    IonFab,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonPage,
    IonLabel,
    IonRow,
    IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave
} from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { getAddress } from 'viem';
import { app } from '../App';
import 'swiper/css';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
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

    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const newIndex = postType === 'top' ? 0 : 1;
            swiperRef.current.swiper.slideTo(newIndex, 0);
        }
    }, [postType]);
    
    const handleSlideChange = () => {
        const swiperInstance = swiperRef.current?.swiper;
        if (swiperInstance) {
            const newIndex = swiperInstance.activeIndex;
            const newPostType = newIndex === 0 ? 'top' : 'recent';
            handleSegmentChange(newPostType);
        }
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
            <IonHeader style={{ padding: 0, marginBottom: '10vh'}}>
                {!hideToolbar ? 
                    <IonToolbar style={{height: 'auto', display: 'flex', flexDirection: 'column', position: 'absolute'}}>
                <IonTitle className='heavyhead' style={{padding: 0, paddingTop: 24,  height: 24, fontSize: 24}}>TRIBE</IonTitle>
                        <IonButtons slot='start' color='transparent' style={{ width: '100%' }}>
                            <IonSegment
                                onIonChange={(e) => {
                                    const newValue = e.detail.value;
                                    if (newValue === 'top' || newValue === 'recent') {
                                        handleSegmentChange(newValue);
                                    }
                                }}
                                value={postType}
                                color='paper'
                                className='heavy'
                                style={{ marginTop: '5vh', fontSize: 24, width: '100%' }} // Ensure full width
                            >
                                <IonSegmentButton value={'top'} color={postType === 'top' ? 'medium' : 'paper'}>
                                    <IonLabel className='bold' style={{fontSize: 16, paddingBottom: 6}}>Friends</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value={'recent'} color={postType === 'recent' ? 'medium' : 'paper'}>
                                    <IonLabel className='bold' style={{fontSize: 16, paddingBottom: 6}}>Everyone</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>
                        </IonButtons>
                    </IonToolbar> 
                : <IonToolbar style={{ maxHeight: 0 }} color='transparent' />}
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
                    <IonToolbar className='transparent' style={{height: 0}}/>
                </IonHeader>
                <Swiper ref={swiperRef} onSlideChange={handleSlideChange}>
                    <SwiperSlide>
                        <PostList type='top' max={10} />
                    </SwiperSlide>
                    <SwiperSlide>
                        <PostList type='recent' max={10} />
                    </SwiperSlide>
                </Swiper>
                <IonFab slot="fixed" vertical="bottom" horizontal="end">
                    {me && <div onClick={() =>  {
                        open((message) => addPost(me.address, message as any), me.address, 'Write a post');
                    }} style={{ cursor: 'pointer', borderRadius: '1000px', color: 'white', background: '#FF6000', padding: '0px', paddingBottom: 5, height: '50px', width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontFamily: 'SF Pro Medium', }}>
                        +
                    </div>}
                </IonFab>

            </IonContent >
            <TribeFooter page='posts' />
        </IonPage >
    );
};

export default Posts;