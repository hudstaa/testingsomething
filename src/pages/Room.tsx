import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCardHeader, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLoading, IonPage, IonRoute, IonRow, IonSpinner, IonText, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { MemberPfp } from '../components/MemberBadge';
import { TribeHeader } from '../components/TribeHeader';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { useMember } from '../hooks/useMember';

import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from '../App';
import { WriteMessage } from '../components/WriteMessage';
import { Message } from '../models/Message';
import { TribePage } from './TribePage';
import VirtuosoRoom from './VirtuosoRoom';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { hideTabs, showTabs } from '../lib/sugar';
import Chat from './Chat';




const Room: React.FC = () => {
    const { address } = useParams<{ address: string }>()
    const { setHighlight } = useMember();
    const channelOwner = useMember(x => x.getFriend(address, true))
    const me = useMember(x => x.getCurrentUser());

    const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const [focused, setFocus] = useState<boolean>(false);
    const channel = address;
    const [info, setInfo] = useState<any | undefined>()
    useIonViewDidEnter(() => {
        hideTabs();
    })
    useIonViewDidLeave(() => {
        showTabs();
    })
    useEffect(() => {
        const db = getFirestore(app);
        getDoc(doc(db, "channel", channel)).then((channelSnap) => {
            setInfo(channelSnap.data())
        })
    }, [])

    const sendMessage = useCallback(async (message: Message) => {
        setFocus(false);
        const author = me!.address;
        const newMessage: any = ({ ...message, author, sent: serverTimestamp(), type: typeof message?.media === 'undefined' ? 'string' : 'media' });
        const db = getFirestore(app);
        if (typeof replyingToMessageId !== null) {
            newMessage.reply = replyingToMessageId;
        }
        const messagesCol = collection(db, "channel", channel, "messages");
        setReplyingToMessageId(null);
        try {
            await addDoc(messagesCol, newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }, [me, channel, replyingToMessageId])

    const reply = useCallback((id: string) => {
        setReplyingToMessageId(id)
        setFocus(true);

    }, []);
    console.log(info)
    const replyingToMessage = messages.find(x => x.id === replyingToMessageId);
    const footerMemo = useMemo(() => replyingToMessageId !== null && replyingToMessage ? <IonItem>
        <MemberPfp size='smol' address={replyingToMessage.author} />
        {replyingToMessage.content}
        {replyingToMessage.media && <IonAvatar>
            <IonImg src={replyingToMessage.media.src} />
        </IonAvatar>}
        <IonButtons slot='end'>
            <IonButton fill='clear' onClick={() => { setReplyingToMessageId(null) }}>
                <IonIcon color='danger' icon={close} />
            </IonButton>
        </IonButtons>
    </IonItem> : <>
    </>, [replyingToMessageId, messages, me]);
    const { goBack } = useHistory();
    return <TribePage page='room'>
        <IonHeader>
            <IonToolbar >
                <IonButtons slot='start'>
                    <IonButton onMouseDown={() => {

                        goBack()
                    }}>
                        〱
                        <IonAvatar>
                            <IonImg src={channelOwner?.twitterPfp} />
                        </IonAvatar>
                        <IonGrid>
                            <IonRow>
                                {(channelOwner?.twitterName) || address}
                            </IonRow>
                            <IonRow>
                                <IonText color='medium'>
                                    {Object.keys(info?.holders || {}).length} members
                                </IonText>
                            </IonRow>
                        </IonGrid>
                    </IonButton>
                </IonButtons>
                <IonButtons slot='end'>
                    <IonButton color='tribe' onClick={() => { setHighlight(address) }}>
                        Boost
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        {me !== null ? <VirtuosoRoom reply={reply} channel={channel} me={me} /> : <IonSpinner />}
        <IonFooter style={{ borderTop: '1px solid' }}> {/* Add your border style here */}
            {footerMemo}
            < WriteMessage focused={focused} placeHolder='Start a message' address={me?.address || ""} sendMessage={sendMessage as any} />
        </IonFooter>
    </TribePage>
}

export default Room;
