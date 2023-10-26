import {
    IonCard,
    IonCol,
    IonFab,
    IonFabButton,
    IonGrid,
    IonIcon,
    IonLabel,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonRow,
    IonSegment, IonSegmentButton
} from '@ionic/react';
import 'firebase/firestore';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { addOutline, timeOutline, trophyOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';
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
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'Posts'} content={<IonSegment value={postType} onIonChange={(e) => {
                setPostType(e.detail.value?.toString() || "top" as any)
            }}>
                <IonSegmentButton layout='icon-end' value={'top'}>
                    <IonLabel color={'medium'}>
                        TOP
                    </IonLabel>
                    <IonIcon color='warning' icon={trophyOutline} />
                </IonSegmentButton>
                <IonSegmentButton value={'recent'} layout='icon-end'>
                    <IonLabel color='medium'>
                        RECENT
                    </IonLabel>
                    <IonIcon color='success' icon={timeOutline} />
                </IonSegmentButton>
            </IonSegment>
            } />
            <TribeContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={(event) => {
                    setTimeout(() => {
                        // Any calls to load data go here
                        event.detail.complete();
                    }, 2000);
                }}>
                    <IonRefresherContent refreshingSpinner={'circular'}></IonRefresherContent>
                </IonRefresher>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <PostList type={postType} max={10} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonFab slot="fixed" vertical="bottom" horizontal="end"><IonFabButton routerLink='/posts/new' size='small'><IonIcon icon={addOutline} /></IonFabButton></IonFab>
            </TribeContent>
            <TribeFooter page='posts' />
        </IonPage >
    );
};

export default Posts;