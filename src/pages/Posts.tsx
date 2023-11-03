import {
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardTitle,
    IonCol,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonRouterLink,
    IonRow,
    IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar, useIonViewWillLeave
} from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { addOutline, timeOutline, trophyOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { getAddress } from 'viem';
import { app } from '../App';
import { PostList } from '../components/PostList';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { WriteMessage } from '../components/WriteMessage';
import { useMember } from '../hooks/useMember';
import { nativeAuth } from '../lib/sugar';
import Post from './Post';
import { TribePage } from './TribePage';
import { useNotifications } from '../hooks/useNotifications';
import { MemberPfp } from '../components/MemberBadge';
import NewPost from './NewPost';



const addPost = (uid: string, from: string, message: { content: string, media?: { src: string, type: string } }) => {
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
    addDoc(collection(db, 'post'), newPost).then(() => {
    }).catch(() => {
    });
}
const Posts: React.FC = () => {

    const [postType, setPostType] = useState<'top' | 'recent'>('top')
    const auth = nativeAuth();
    const me = useMember(x => x.getCurrentUser());
    const { notifications } = useNotifications();
    const [isNewPosting, setIsNew] = useState(false)
    return (
        <TribePage page='posts'>
            <TribeHeader title={'posts'}
                hide
                content={!isNewPosting ? <>
                    <IonButtons slot='start' style={{ marginLeft: 12 }}>
                        <IonCardTitle style={{ letterSpacing: '-2px', color: 'white' }} >
                            tribe
                        </IonCardTitle>
                    </IonButtons>
                    <IonSegment value={postType} style={{ position: 'absolute', right: 15, top: 5 }}>
                        <IonSegmentButton value={'top'} color={postType === 'top' ? 'light' : 'paper'} onClick={() => {
                            setPostType('top')
                        }}>
                            TOP
                        </IonSegmentButton>
                        <IonSegmentButton value={'recent'} color={postType === 'recent' ? 'light' : 'paper'} onClick={() => {
                            setPostType('recent')
                        }}>
                            NEW
                        </IonSegmentButton>
                    </IonSegment>
                </> : <></>
                }
            />

            < TribeContent fullscreen page='posts'>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <PostList type={postType} max={10} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab slot="fixed" vertical="bottom" horizontal="center">
                    <IonRouterLink routerLink='/post/new' ><div style={{ cursor: 'pointer', borderRadius: 1000, color: 'white', background: '#FF813B', padding: 13 }} >
                        New Post
                    </div></IonRouterLink>
                </IonFab>
            </TribeContent >
            <TribeFooter page='posts' />
        </TribePage >
    );
};

export default Posts;