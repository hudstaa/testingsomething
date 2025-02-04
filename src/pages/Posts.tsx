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
    IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave, IonList, IonRefresher, IonRefresherContent, useIonRouter
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
import Swap from './Swap';
import { Wallet } from '../components/Wallet';



const Posts: React.FC = () => {
    const auth = nativeAuth();
    const location = useLocation();
    // Function to get the post type from URL
    const getPostTypeFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('type') === 'recent' ? 'recent' : 'top';
    };
    const ionRouter = useIonRouter();

    const doRefresh = (event: { detail: { complete: () => void; }; }) => {
        // Refresh the page
        ionRouter.push(ionRouter.routeInfo.pathname, 'forward', 'replace');

        // Complete the refresh operation
        setTimeout(() => {
            event.detail.complete();
        }, 1000);
    };

    const [postType, setPostType] = useState<'top' | 'recent'>(getPostTypeFromURL());
    const history = useHistory();
    const [menuType, setMenuType] = useState('push');
    const [filterType, setFilterType] = useState('Feed');

    const handleSegmentChange = (newValue: 'top' | 'recent') => {
        setPostType(newValue);
        setFilterType('Feed');
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
    useEffect(() => {
        setFilterType('Feed'); // Set the filterType to 'Feed' when the component mounts
    }, []);
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
            <IonMenu type={menuType} contentId="pages-content" >
                <IonList>
                    <IonToolbar>
                        <img src={'/icon.svg'} />
                    </IonToolbar>
                    <IonMenuToggle>
                        <IonItem routerLink={'/member/' + me.address}>
                            {me.twitterName}
                        </IonItem>
                        <IonItem routerLink={'/channel/'}>
                            chat
                        </IonItem>
                        <IonItem routerLink={'/member/'}>
                            discover
                        </IonItem>
                    </IonMenuToggle>
                </IonList>
            </IonMenu>
            <IonPage id="pages-content" ref={pageRef}>
                {filterType === 'Feed' && <IonHeader>
                    {!hideToolbar ?
                        <IonToolbar color={bgColor} style={{ height: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div slot='start' style={{ width: 'auto', height: 'auto' }}>
                                <IonMenuToggle>
                                    <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0, paddingTop: 0 }} color='dark' fill='clear' size='small'>
                                        <IonIcon icon={'/icons/hamburger.svg'} style={{ marginLeft: -6, height: '1.5rem', width: '1.5rem' }} />
                                    </IonButton>
                                </IonMenuToggle>
                                <IonTitle className="bold" style={{ fontSize: '1.2rem', width: '50%', textAlign: 'left', padding: 8, paddingLeft: 44, paddingTop: 8 }}>Tribe</IonTitle>
                            </div>
                            <IonButtons slot='end' color='transparent' style={{ width: 'auto' }}>
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
                                    className='heavy my-custom-segment-class1'
                                    style={{ fontSize: 24, width: '100%' }} // Ensure full width
                                >
                                    <IonSegmentButton className="my-custom-segment-class1" value={'top'} color={postType === 'top' ? 'medium' : 'paper'}>
                                        <IonLabel className='heavy' style={{ fontSize: 16, paddingBottom: 0, paddingTop: 1 }}>Top</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton className="my-custom-segment-class1" value={'recent'} color={postType === 'recent' ? 'medium' : 'paper'}>
                                        <IonLabel className='heavy' style={{ fontSize: 16, paddingBottom: 0, paddingTop: 1 }}>New</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </IonButtons>
                        </IonToolbar>
                        : <IonToolbar style={{ maxHeight: 0 }} color='transparent' />}
                </IonHeader>}
                {filterType === 'Feed' && < IonContent color={bgColor} fullscreen onIonScroll={(e: any) => {
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
                    <IonRefresher slot='fixed' onIonRefresh={doRefresh}>
                <IonRefresherContent />
            </IonRefresher>
                    <Swiper ref={swiperRef} onSlideChange={handleSlideChange}>
                        <SwiperSlide>
                            <PostList type='top' max={10} />
                        </SwiperSlide>
                        <SwiperSlide>
                            <PostList type='recent' max={10} />
                        </SwiperSlide>
                    </Swiper>
                    <IonFab slot="fixed" vertical="bottom" horizontal="end">
                        {me && <div onClick={() => {
                            open((message) => addPost(me.address, message as any), me.address, 'Write a post');
                        }} className="bold" style={{ cursor: 'pointer', borderRadius: '1000px', color: 'white', background: '#FF6000', padding: '0px', paddingBottom: 7, height: '56px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', }}>
                            +
                        </div>}
                    </IonFab>
                </IonContent >}
                {filterType === 'Apps' && <IonContent fullscreen>
                    <Swap /></IonContent>}
                {filterType === 'Wallet' && <IonContent fullscreen>
                    <Wallet /></IonContent>}
                <IonFooter color='black'>
                    <div style={{ marginBottom: -2, paddingBottom: 2, backgroundColor: "black", display: 'flex', flexDirection: 'row', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', paddingLeft: 8, paddingRight: 8, paddingTop: 6 }}>
                        <IonSegment
                            value={filterType}
                            slot='start'
                            className="heavy my-custom-segment-class2"
                            style={{ fontSize: 24, display: 'flex', paddingLeft: 3, border: '1px solid #FFFFFF10', paddingRight: 3, justifyContent: 'space-between', alignItems: 'center', borderRadius: 24 }} >
                            <IonSegmentButton value="Feed" onClick={() => setFilterType('Feed')}>
                                <IonLabel className='heavy' style={{ color: filterType === 'Feed' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Feed</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="Apps" onClick={() => setFilterType('Apps')}>
                                <IonLabel className='heavy' style={{ color: filterType === 'Apps' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Swap</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="Wallet" onClick={() => setFilterType('Wallet')}>
                                <IonLabel className='heavy' style={{ color: filterType === 'Wallet' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Wallet</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>
                </IonFooter>
            </IonPage >
        </>
    );
};

export default Posts;