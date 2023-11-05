import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonList, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToast, useIonToast } from '@ionic/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { signOut } from 'firebase/auth';
import { albumsOutline, chatboxOutline, copy, exit, key, notificationsOutline, personOutline, wallet } from 'ionicons/icons';
import { MemberBadge, MemberToolbar } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { formatEth, nativeAuth } from '../lib/sugar';
import { TribePage } from './TribePage';
import { useEffect, useState } from 'react';
import { Timestamp, collection, deleteDoc, doc, getAggregateFromServer, getCountFromServer, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { app } from '../App';
import { get } from 'firebase/database';
import { OnBoarding } from './OnBoarding';
import { useNotifications } from '../hooks/useNotifications';
import { PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useBalance, useChainId } from 'wagmi';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';



const Account: React.FC = () => {
    const auth = nativeAuth()
    const { logout, ready, login } = usePrivy();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());
    const { setCurrentUser } = useMember();
    const { notifications } = useNotifications();
    const [pushNotifications, setPushNotifications] = useState<PushNotificationSchema[]>([]);
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        if (!me) {
            return;
        }
        const db = getFirestore(app);

        const coll = collection(db, "post");
        const q = query(coll, where("author", "==", me!.address));
        getCountFromServer(q).then((snap) => {
            const coll2 = collection(db, "channel", me!.address, 'messages');
            const q2 = query(coll2, where("author", "==", me!.address));
            getCountFromServer(q2).then((snap2) => {
                setCount(snap2.data().count + snap.data().count);
            })
        })
    }, [me]);
    useEffect(() => {
        if (!Capacitor.isPluginAvailable('PushNotifications')) {
            return;
        };
        PushNotifications.getDeliveredNotifications().then(({ notifications: notifs }) => {
            console.log(notifs);
            setPushNotifications(notifs);
        })
    }, [])
    const [showToast, setShowToast] = useState<boolean>(false);
    const { data: ethBalance } = useBalance({ address: me?.address as any, watch: true })
    const { user, exportWallet } = usePrivy();
    const chainId = useChainId();
    if (!me) {
        return <IonPage>
            <OnBoarding me={me} dismiss={() => { }} />
        </IonPage>
    }
    return (
        <TribePage page='account'>
            <TribeHeader title='Account' color='tertiary' />
            <TribeContent >
                <IonGrid>
                    <IonRow>
                        <IonCol offsetMd='2' sizeMd='8' sizeXs='12'>
                            <IonCard color='paper'>
                                <IonCardContent >
                                    <IonItem lines='none' color='paper'>
                                        <IonButtons slot='start'>
                                            <MemberBadge address={me!.address} />
                                        </IonButtons>
                                        <IonButtons slot='end'>
                                            <IonBadge color='light'>
                                                <IonText color='dark'>
                                                    earned:
                                                </IonText>
                                                <IonCardTitle>
                                                    <IonText color='tribe'>
                                                        {count === null ? <IonSpinner name='dots' /> : count * 10}
                                                    </IonText>
                                                </IonCardTitle>
                                                <IonText>tribe</IonText>
                                            </IonBadge>
                                        </IonButtons>
                                    </IonItem>
                                    <IonItem color='paper' lines='none' detail={false} href='javascript:void(0)' onClick={() => {
                                        navigator.clipboard.writeText(me.address);
                                        setShowToast(true);
                                    }}>
                                        <IonButtons slot='start'>
                                            <IonIcon icon={copy} />
                                        </IonButtons>
                                        <IonToast
                                            position='top'
                                            isOpen={showToast}
                                            message="Copied to clipboard"
                                            onDidDismiss={() => setShowToast(false)}
                                            duration={5000}
                                        ></IonToast>
                                        <IonText className='regular'>
                                            {me.address.slice(0, 10) + '...'}
                                        </IonText>

                                        <IonButtons slot='end'>
                                            <IonText color='primary'>
                                                {ethBalance ? formatEth(ethBalance.value) : <></>}
                                            </IonText>
                                        </IonButtons>
                                    </IonItem>
                                    <IonItem color='paper' lines='none' detail={false} href={'javascript:void(0)'} onClick={() => {
                                        exportWallet();
                                    }}>
                                        <IonButtons slot='start' >
                                            <IonIcon icon={key} color='tribe' />
                                        </IonButtons>
                                        <IonText color='tribe'>
                                            Export Wallet
                                        </IonText>
                                    </IonItem>


                                    <IonButton color='light' fill='solid' routerLink={'/channel/' + me?.address} routerDirection='none' onClick={() => {
                                    }} >Chat
                                    </IonButton>
                                    <IonButton color='light' routerLink={'/member/' + me?.address} routerDirection='none' onClick={() => {
                                    }} >Profile
                                    </IonButton>
                                    <IonButton color='light' fill='solid' routerLink={'/post/new'} routerDirection='none' onClick={() => {
                                    }} >Post
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                            <IonCard color='paper'>
                                <IonCardHeader>
                                    <IonItem lines='none' color='paper'>

                                        <IonText>
                                            Notifications
                                        </IonText>
                                        <IonButtons slot='end'>
                                            <IonBadge color='tribe'>
                                                {notifications.length}
                                                <IonIcon icon={notificationsOutline} />
                                            </IonBadge>
                                            {notifications.length > 0 && <IonButton color='tribe' fill='solid' onClick={() => {
                                                notifications.forEach(({ id }) => {
                                                    deleteDoc(doc(getFirestore(app), 'notifications', id)).then(() => {

                                                    })

                                                })
                                            }}>
                                                Clear
                                            </IonButton>}
                                        </IonButtons>
                                    </IonItem>

                                </IonCardHeader>
                                <IonCardContent>
                                    {pushNotifications.map(({ title, subtitle, body, id, data }) => <IonItem>
                                        <IonButtons slot='start'>
                                            {title}
                                        </IonButtons>
                                        {subtitle}

                                        {body}
                                    </IonItem>)}
                                    {notifications.map(({ from, ref, timestamp, to, id }: any) => <IonItem lines='none' color='paper' onClick={() => {
                                        deleteDoc(doc(getFirestore(app), 'notifications', id)).then(() => {

                                        })
                                    }} routerLink={ref.split('/')[0] + '/' + ref.split('/')[1]}>
                                        <MemberBadge address={from} /> {ref.includes('comments') && "Commented on your Post"} {ref.includes('channel') && "sent a message in your Chat"}
                                    </IonItem>)}
                                </IonCardContent>
                            </IonCard>
                            <IonButton expand='full' fill='outline' onClick={() => {
                                signOut(auth); logout(); setCurrentUser(null as any);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000)
                            }} color='danger'>Logout
                                <IonIcon icon={exit} />
                            </IonButton>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </TribeContent>
            <TribeFooter page='account' />
        </TribePage >

    );
};

export default Account;
