import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonFab,
    IonFabButton,
    IonFooter,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonSegment, IonSegmentButton, IonText, IonTitle, IonToggle
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
import { WriteMessage, removeUndefinedProperties } from '../components/WriteMessage';
import { useMember } from '../hooks/useMember';
import { nativeAuth } from '../lib/sugar';
import Post from './Post';
import { MemberAlias, MemberBadge, MemberCardHeader, MemberPfp } from '../components/MemberBadge';


const Posts: React.FC = () => {
    const { push } = useHistory();

    const me = useMember(x => x.getCurrentUser());

    const [postId, setPostId] = useState<string | undefined>();
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

    return (
        <IonPage id='main-content'>
            <TribeHeader color='success' title={'New Post'} />
            <TribeContent fullscreen>
                {me && <IonItem color='paper'>
                    <MemberPfp size='smol' address={me.address} /><MemberAlias clickable address={me.address} />
                </IonItem>}
                {me && <WriteMessage address={me!.address} placeHolder="What's on your mind?" sendMessage={(message) => addPost(me!.address, message)} />}
                <IonItem color='paper'>

                </IonItem>
                <IonItem color='paper'>
                    <IonButtons slot='start'>
                        <IonText>
                            Anon
                        </IonText>
                        <IonToggle disabled />
                        <IonText>
                            Comments
                        </IonText>
                        <IonToggle disabled />
                    </IonButtons>
                </IonItem>
            </TribeContent>
        </IonPage >
    );
};

export default Posts;