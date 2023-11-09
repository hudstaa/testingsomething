import { IonAvatar, IonButton, IonButtons, IonFooter, IonIcon, IonImg, IonItem, IonSpinner, useIonViewDidEnter, useIonViewDidLeave } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { MemberPfp } from '../components/MemberBadge';
import { TribeHeader } from '../components/TribeHeader';
import { useGroupMessages } from '../hooks/useGroupMessages';
import { useMember } from '../hooks/useMember';

import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { app } from '../App';
import { WriteMessage } from '../components/WriteMessage';
import { Message } from '../models/Message';
import { TribePage } from './TribePage';
import VirtuosoRoom from './VirtuosoRoom';




const Room: React.FC = () => {

    const { pathname } = useLocation()
    const address = pathname.split('/')[2]
    console.log(address, pathname)
    const channelOwner = useMember(x => x.getFriend(address, true))
    const me = useMember(x => x.getCurrentUser());

    const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
    const messages = useGroupMessages(x => x.groupMessages[address] || [])
    const channel = address;

    //useIonViewDidEnter(() => {
    //     hideTabs();
    // })
    // useIonViewDidLeave(() => {
    //     showTabs();
    // })

    const sendMessage = useCallback(async (message: Message) => {
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
    }, []);

    const replyingToMessage = messages.find(x => x.id === replyingToMessageId);
    return <TribePage page='room'>
        <TribeHeader showBackButton={false} sticky title={(channelOwner?.twitterName) || address} />
        {me !== null ? <VirtuosoRoom reply={reply} channel={channel} me={me} /> : <IonSpinner />}
        <IonFooter style={{ paddingBottom: 20, borderTop: '1px solid' }}> {/* Add your border style here */}
            {useMemo(() => replyingToMessageId !== null && replyingToMessage ? <IonItem>
                <MemberPfp size='smol' address={replyingToMessage.author} />
                {replyingToMessage.content}
                {replyingToMessage.media && <IonAvatar> <IonImg src={replyingToMessage.media.src} /></IonAvatar>}
                <IonButtons slot='end'>
                    <IonButton fill='clear' onClick={() => { setReplyingToMessageId(null) }}>
                        <IonIcon color='danger' icon={close} />
                    </IonButton>
                </IonButtons>
            </IonItem> : <>
            </>, [replyingToMessageId, messages, me])}
            < WriteMessage placeHolder='Start a message' address={me?.address || ""} sendMessage={sendMessage as any} />
        </IonFooter>
    </TribePage>
}

export default Room;
