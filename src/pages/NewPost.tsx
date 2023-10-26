import {
    IonCard,
    IonCol,
    IonFab,
    IonFabButton,
    IonGrid,
    IonIcon,
    IonLabel,
    IonPage,
    IonRow,
    IonSegment, IonSegmentButton
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
import { MemberBadge, MemberCardHeader, MemberPfp } from '../components/MemberBadge';


const Posts: React.FC = () => {
    const { push } = useHistory();

    const auth = nativeAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));


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
        addDoc(collection(db, 'post'), newPost).then((doc) => {
            push('/posts/' + doc.id);
        }).catch(() => {
        });
    }
    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'Posts'} />
            <TribeContent fullscreen>

                <IonGrid>
                    <IonRow>
                        <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>
                            <IonCard>
                                {me && <MemberCardHeader address={me.address} />}
                                {uid && me && <WriteMessage address={me!.address} placeHolder='write a post' sendMessage={(message) => addPost(uid!, me!.address, message)} />}
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </TribeContent>
            <TribeFooter page='posts' />
        </IonPage >
    );
};

export default Posts;