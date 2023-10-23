import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonGrid,
    IonIcon,
    IonLabel,
    IonPage,
    IonRow,
    IonSegment, IonSegmentButton,
    IonText
} from '@ionic/react';
import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
import { Timestamp, addDoc, collection, doc, getAggregateFromServer, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc, sum } from 'firebase/firestore';
import { chevronDown, chevronUp, timeOutline, trophyOutline } from 'ionicons/icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { app } from '../App';
import { CommentList } from '../components/CommentList';
import { MemberCardHeader } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { WriteMessage } from '../components/WriteMessage';
import { useMember } from '../hooks/useMember';
import { Post } from '../components/Post';
import { PostList } from '../components/PostList';



const Posts: React.FC = () => {

    const [postType, setPostType] = useState<'top' | 'recent'>('top')
    const auth = getAuth();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid));

    const addPost = async (message: { content: string, media?: { src: string, type: string } }) => {
        const db = getFirestore(app);

        await addDoc(collection(db, 'post'), {
            author: me!.address, // Replace with actual user's address or ID
            ...message,
            sent: serverTimestamp(),
        });
        setPostType('recent');
    };

    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'Posts'} content={<IonSegment value={postType} onIonChange={(e) => {
                setPostType(e.detail.value?.toString() || "top" as any)
            }}>
                <IonSegmentButton layout='icon-end' value={'top'}>
                    <IonLabel>
                        TOP
                    </IonLabel>
                    <IonIcon icon={trophyOutline} />
                </IonSegmentButton>
                <IonSegmentButton value={'recent'} layout='icon-end'>
                    <IonLabel>
                        RECENT
                    </IonLabel>
                    <IonIcon icon={timeOutline} />
                </IonSegmentButton>
            </IonSegment>
            } />
            <TribeContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <IonCard>
                                <WriteMessage
                                    placeHolder='Whats happnin'
                                    address={''}
                                    sendMessage={addPost}
                                />
                            </IonCard>
                            <PostList type={postType} limit={10} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </TribeContent>
            <TribeFooter page='posts' />
        </IonPage >
    );
};


type Message = {
    content: string;
    author: string;
    sent: Date;
    //... Add other necessary fields
};


export default Posts;