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
    IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave, IonList
} from '@ionic/react';
import 'firebase/firestore';
import { IonContentCustomEvent, ScrollDetail } from '@ionic/core';
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
import { nativeAuth, showTabs } from '../lib/sugar';
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
    const [filterType, setFilterType] = useState('Feed');

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
        showTabs();
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
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [toolbarY, setToolbarY] = useState(0);
    const toolbarHeight = 50; // Adjust this to the actual height of your toolbar
    const [hideToolbar, setHideToolbar] = useState<boolean>(false)

    const handleScroll = (e: IonContentCustomEvent<ScrollDetail>) => {
        const currentScroll = e.detail.scrollTop;
        const deltaY = currentScroll - lastScrollTop;
        const newToolbarY = Math.max(-toolbarHeight, Math.min(0, toolbarY - deltaY));
        const shouldHideToolbar = currentScroll === 0;
        setHideToolbar(shouldHideToolbar);
        setToolbarY(newToolbarY);
        setLastScrollTop(currentScroll);
      };

    if (!me) {
        return <OnBoarding me={me} dismiss={function (): void {

        }} />
    }
    return (

        <>
            <IonMenu type={menuType} contentId="main-content" >
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
            <IonPage id="main-content" ref={pageRef}>
            <IonHeader style={{ transform: `translateY(${toolbarY}px)`, transition: 'transform 0.5s ease',opacity: 1 + toolbarY / toolbarHeight }}>
                        <IonToolbar color={bgColor} style={{ height: 'auto', display: 'flex', flexDirection: 'column', position: 'absolute' }}>
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
                        : <IonToolbar style={{ maxHeight: 0 }} color='transparent' />
                </IonHeader>

                <IonContent onIonScroll={handleScroll} scrollEvents={true}style={{ paddingTop: hideToolbar ? '0' : 'var(--ion-safe-area-top)'}}>

                    <IonHeader style={{marginBottom: '2.5vh'}}>
                        <IonToolbar className='transparent' style={{ height: 0 }} />
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
                        {me && <div onClick={() => {
                            open((message) => addPost(me.address, message as any), me.address, 'Write a post');
                        }} className="bold" style={{ cursor: 'pointer', borderRadius: '1000px', color: 'white', background: '#FF6000', padding: '0px', paddingBottom: 7, height: '56px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', }}>
                            +
                        </div>}
                    </IonFab>
                </IonContent >
            <IonFooter color='black'>
            <div style={{ marginBottom: -2, paddingBottom: 2, backgroundColor: "black", display: 'flex', flexDirection: 'row', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', paddingLeft: 8, paddingRight: 8, paddingTop: 6}}> 
                <IonSegment
                    value={filterType}
                    slot='start'
                    className="heavy my-custom-segment-class2"
                    style={{ fontSize: 24,display: 'flex', paddingLeft: 0, border: '1px solid #FFFFFF10',paddingRight: 0, justifyContent: 'space-between', alignItems: 'center', borderRadius: 24}} >
                     <IonSegmentButton value="Feed" onClick={() => setFilterType('Feed')}>
                            <IonLabel className='heavy' style={{color: filterType === 'Feed' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24}}>Feed</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Apps" onClick={() => setFilterType('Apps')}>
                            <IonLabel className='heavy' style={{color: filterType === 'Apps' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24}}>Apps</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Wallet" onClick={() => setFilterType('Wallet')}>
                            <IonLabel className='heavy' style={{color: filterType === 'Wallet' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24}}>Wallet</IonLabel>
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