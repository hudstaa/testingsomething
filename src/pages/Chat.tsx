import { IonBadge, IonButtons, IonCard, IonCol, IonGrid, IonItem, IonRow, IonSpinner, IonTitle, useIonViewWillEnter } from '@ionic/react';
import { Timestamp, collection, doc, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { app } from '../App';
import { MemberPfp } from '../components/MemberBadge';
import { timeAgo } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import useTabs from '../hooks/useTabVisibility';
import { nativeAuth } from '../lib/sugar';
import { TribePage } from './TribePage';


const Chat: React.FC = () => {
    const auth = nativeAuth()
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());

    const [members, setMembers] = useState<[{ address: string }]>()
    useEffect(() => {
        const address = me?.address;

        if (typeof address === 'undefined') {
            return;
        }
        const channelsRef = collection(getFirestore(app), "channel");
        const q = query(channelsRef, where(`holders.${address}`, '>', 0));
        getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
                    setMembers(result as any);
                }
            })
            .catch(error => {
                setMembers([] as any)
            });
    }, [me])
    const { setTab } = useTabs()
    useIonViewWillEnter(() => {
        setTab('channel')
    })
    return (
        <TribePage page='chat'>
            <TribeHeader title='Chat' />
            <TribeContent >
                <IonGrid style={{padding: 0}}>
                    <IonRow>
                        <IonCol sizeMd='6' offsetMd='3' sizeXs='12' style={{padding: 0}}>
                            <IonCard style={{ margin: 0, borderRadius: 0 }}>
                                {useMemo(() => members && members !== null ? members.map(({ address, }, i) =>
                                    <IonItem lines='none' routerLink={'/channel/' + address} key={address}>
                                        <LastMessage address={address} />
                                    </IonItem>) : <><br /><br /><br /><IonTitle>
                                        <IonSpinner name='crescent' /></IonTitle></>, [members])}
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </TribeContent>
            <TribeFooter page='chat' />
        </TribePage >
    );
};
const LastMessage: React.FC<{ address: string }> = ({ address }) => {
    const [msg, setMsg] = useState<{ sent: Timestamp, content: string } | null>(null);
    useEffect(() => {
        const channelsRef = doc(getFirestore(app), "channel", address);
        const q = query(collection(channelsRef, 'messages'), where('author', '==', address), orderBy('sent', 'desc'), limit(1));
        getDocs(q)
            .then(querySnapshot => {
                const data = querySnapshot.docs[0].data()
                data && setMsg(data as any)
            })
    }, [address])
    return <>
        <IonButtons slot='start'>

            <MemberPfp address={address} size='smol' />
        </IonButtons>
        <div>
            {msg?.content.slice(0, 20)}
        </div>
        <IonButtons slot='end'>
            <IonBadge color={'light'}>
                {msg === null ? <IonSpinner name='dots' /> : timeAgo(new Date(msg.sent.seconds * 1000))}
            </IonBadge>

        </IonButtons>

    </>
}

export default Chat;

