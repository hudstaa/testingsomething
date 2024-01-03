import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonTitle,
    IonFooter,
    IonCol,
    IonContent,
    IonFab,
    IonGrid,
    IonHeader,
    IonIcon,
    IonMenu,
    IonMenuToggle,
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
import type { RadioGroupCustomEvent } from '@ionic/react';



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
    const [menuType, setMenuType] = useState('push');
    const [filterType, setFilterType] = useState<'Feed' | 'Apps' | 'Wallet'>();

    const handleSegmentChange = (newValue: 'top' | 'recent') => {
        setPostType(newValue);
        const params = new URLSearchParams(location.search);
        params.set('type', newValue);
        history.replace({ search: params.toString() }); // Use replace instead of push
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
    const bgColor = darkmode ? undefined : 'white';
    const { setPresentingElement } = useWriteMessage()
    const pageRef = useRef<any>(null)
    useIonViewDidEnter(() => {
        setPresentingElement(pageRef.current)
    })

    const [shouldFocusWriteMessage, setShouldFocusWriteMessage] = useState(false);

    const triggerFocusOnWriteMessage = () => {
        setShouldFocusWriteMessage(true);
    };

    useEffect(() => {
        if (shouldFocusWriteMessage) {
            setShouldFocusWriteMessage(false);
        }
    }, [shouldFocusWriteMessage]);
    
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

        <>
        <IonMenu type={menuType} contentId="main-content" >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Menu Content</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Menu items here */}
            </IonContent>
        </IonMenu>
        <IonPage id="main-content" ref={pageRef}>
            <IonHeader style={{ padding: 0, marginBottom: '4.5vh'}}>
                {!hideToolbar ? 
                    <IonToolbar  color={bgColor} style={{height: 'auto', display: 'flex', flexDirection: 'column', position: 'absolute'}}>
                        <div slot='start' style={{ width:'auto', height: 'auto' }}>
                            <IonMenuToggle>
                                <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0, paddingTop: 0}} color='dark' fill='clear' size='small'>
                                    <IonIcon icon={'/icons/hamburger.svg'} style={{ marginLeft: -6, height: '1.5rem', width:  '1.5rem' }}/>
                                </IonButton>
                                </IonMenuToggle>
                            <IonTitle className="bold" style={{ fontSize: '1.2rem', width:'50%', textAlign: 'left', padding: 8, paddingLeft:44, paddingTop: 8}}>Tribe</IonTitle>
                        </div>
                        <IonButtons slot='end' color='transparent' style={{ width: 'auto'}}>
                            <IonSegment
                                onIonChange={(e) => {
                                    const newValue = e.detail.value;
                                    if (newValue === 'top' || newValue === 'recent') {
                                        handleSegmentChange(newValue);
                                    }
                                }}
                                value={postType}
                                color='paper'
                                slot='end'
                                className='heavy'
                                style={{ fontSize: 24, width: '100%' }} // Ensure full width
                            >
                                <IonSegmentButton value={'top'} color={postType === 'top' ? 'medium' : 'paper'}>
                                    <IonLabel className='heavy' style={{fontSize: 16, paddingBottom: 0, paddingTop: 1}}>Top</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value={'recent'} color={postType === 'recent' ? 'medium' : 'paper'}>
                                    <IonLabel className='heavy' style={{fontSize: 16, paddingBottom: 0, paddingTop: 1}}>New</IonLabel>
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
                    }} className="bold" style={{ cursor: 'pointer', borderRadius: '1000px', color: 'white', background: '#FF6000', padding: '0px', paddingBottom: 7, height: '56px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px',  }}>
                        +
                    </div>}
                </IonFab>
            </IonContent >
            <IonFooter >
            <div style={{height: '6vh', backgroundColor: "black", display: 'flex', flexDirection: 'row', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', paddingLeft: 4, paddingRight: 4, paddingTop: 4 }}> 
                <IonSegment
                    value={filterType}
                    color='paper'
                    slot='start'
                    className='heavy my-custom-segment' 
                    style={{ fontSize: 24,display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 24}} >
                    <IonSegmentButton value="Feed" color={filterType === 'Feed' ? '#FF6000' : '#FF6000'}>
                        <IonLabel className='heavy' style={{fontSize: 16, paddingBottom: 0, paddingTop: 1}}>Feed</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Apps" color={filterType === 'Apps' ? '#FF6000' : undefined}>
                        <IonLabel className='heavy' style={{fontSize: 16, paddingBottom: 0, paddingTop: 1}}>Apps</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Wallet" color={filterType === 'Wallet' ? '#FF6000' : undefined}>
                        <IonLabel className='heavy' style={{fontSize: 16, paddingBottom: 0, paddingTop: 1}}>Wallet</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div> 
        </IonFooter>
            <TribeFooter page='posts' />
        </IonPage >
        </>
    );
};

export default Posts;