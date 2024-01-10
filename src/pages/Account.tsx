import { Capacitor } from '@capacitor/core';
import { PushNotificationSchema, PushNotifications } from '@capacitor/push-notifications';
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonHeader, IonIcon, IonItem, IonModal, IonRow, IonSpinner, IonText, IonToast, IonToolbar } from '@ionic/react';
import { usePrivy } from '@privy-io/react-auth';
import { signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getFirestore, query, serverTimestamp, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { alertOutline, closeOutline, copy, exit, key, logoDiscord, logoGoogle, notificationsOutline, settings, settingsOutline } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { getAddress } from 'viem';
import { useBalance } from 'wagmi';
import { app } from '../App';
import { MemberBadge } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { useNotifications } from '../hooks/useNotifications';
import { useWriteMessage } from '../hooks/useWriteMessage';
import { formatEth, nativeAuth } from '../lib/sugar';
import Member from './Member';
import { TribePage } from './TribePage';



const Account: React.FC = () => {
    const auth = nativeAuth()
    const { logout, ready } = usePrivy();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());
    const { setCurrentUser } = useMember();
    const { search } = useLocation();

    const searchParams = useMemo(() => new URLSearchParams(search), [search]);

    const { notifications } = useNotifications();
    const [pushNotifications, setPushNotifications] = useState<PushNotificationSchema[]>([]);
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        if (!me) {
            return;
        }
        const db = getFirestore(app);

        const coll = collection(db, "member");
        const q = query(coll, where("referrer", "==", me!.twitterUsername));
        getCountFromServer(q).then((snap) => {
            setCount(snap.data().count);
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
    const { exportWallet } = usePrivy();
    const { open } = useWriteMessage();
    const { push } = useHistory();

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
        addDoc(collection(db, 'post'), newPost).then((doc) => {
            push('/post/' + doc.id);
        });
    }
    const { linkGoogle, linkWallet, linkTiktok, login, linkDiscord, user } = usePrivy();
    useEffect(() => {
        const accountAddress = (user?.linkedAccounts.find((x: any) => x.connectorType == 'injected') as any)?.address;
        const privyUid = auth.currentUser?.uid as any;
        if (!ready || !accountAddress || !privyUid) {
            return;
        }
        if (accountAddress != me?.injectedWallet) {
            const database = getFirestore(app);

            const docRef = doc(database, 'member', privyUid);

            const joinTribe = httpsCallable(getFunctions(app), 'syncPrivy');
            const referrer = searchParams.get("ref") || "lil_esper"
            joinTribe({ referrer }).then((res) => {
                getDoc(docRef).then((snap) => {
                    setCurrentUser(snap.data() as any);
                })
            }).catch((e) => {
                console.log(e);
            })
        }
    }, [ready, user, me])
    const [show, setShow] = useState(false);
    const { pathname } = useLocation();
    const { show: showNotifications } = useNotifications()
    if (!me) {
        return <TribePage page='account'><></></TribePage>
    }
    return (
        <>
            {pathname.includes('account') && <IonButton fill='clear' style={{ zIndex: 100000000, position: 'absolute', right: 5, top: 5 }} onClick={() => { setShow(true) }}>
                <IonIcon size={'large'} icon={settingsOutline} />
            </IonButton>}
            {pathname.includes('account') && <IonButton fill='clear' style={{ zIndex: 100000000, position: 'absolute', right: 100, top: 5 }} onClick={showNotifications}>
                <IonIcon size={'large'} icon={alertOutline} />
                <IonBadge>{notifications.length}</IonBadge>
            </IonButton>}
            <Member profile={true} />
            <IonModal
                className="custom-modal2"
                isOpen={show}
                onDidDismiss={() => setShow(false)}
                initialBreakpoint={1} 
                breakpoints={[0, 1]}
                style={{zIndex: 999}}
            >
                <IonHeader>
                    <IonToolbar color={'transparent'}>
                        <IonButtons slot='end'>
                            <IonButton onClick={() => { setShow(false) }}>
                                <IonIcon icon={closeOutline} color='dark' />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <TribeContent >
                    <IonCard style={{padding: 0, margin: 0}}color='paper'>
                        <IonCardContent >
                            <IonItem lines='none' color='paper'>
                                <IonButtons slot='start'>
                                    <MemberBadge address={me!.address} />
                                </IonButtons>
                                <IonButtons slot='end'>
                                    <IonBadge color='light'>
                                        <IonText color='dark'>
                                            invites:
                                        </IonText>
                                        <IonCardTitle>
                                            <IonText color='tribe'>
                                                {count === null ? <IonSpinner name='dots' /> : count}
                                            </IonText>
                                        </IonCardTitle>
                                    </IonBadge>
                                </IonButtons>
                            </IonItem>

                            <IonItem color='paper' lines='none' detail={false} onClick={() => {
                                navigator.clipboard.writeText(me.address);
                                setShowToast(true);
                            }}>
                                <IonButtons slot='start'>
                                    <IonIcon icon={copy} />
                                </IonButtons>
                                <IonToast
                                    position='top'
                                    isOpen={showToast}
                                    message="Copied address to clipboard"
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
                            <IonItem color='paper' lines='none' detail={false} onClick={() => {
                                exportWallet();
                            }}>
                                <IonButtons slot='start' >
                                    <IonIcon icon={key} color='tribe' />
                                </IonButtons>
                                <IonText color='tribe'>
                                    Export Wallet
                                </IonText>
                            </IonItem>


                            <IonItem color='paper'>

                                <IonText>
                                    Connected accounts:
                                </IonText>
                            </IonItem>

                            {user ? <IonRow>
                                {user && typeof (user.linkedAccounts.find((x: any) => x.connectorType == 'injected') as any)?.address === 'undefined' ? <IonButton fill='clear' onClick={linkWallet}>
                                    Link Browser wallet
                                </IonButton> : <IonChip color='tribe'>{(user.linkedAccounts.find((x: any) => x.connectorType == 'injected') as any)?.address}</IonChip>}
                                {user && typeof user.discord?.username === 'undefined' ? <IonButton fill='clear' onClick={linkDiscord}>
                                    Link Discord
                                </IonButton> : <IonChip color='tertiary'>
                                    <IonIcon icon={logoDiscord} />
                                    <IonText>
                                        {user?.discord?.username}
                                    </IonText>
                                </IonChip>}
                                {user && typeof user.google?.name === 'undefined' ? <IonButton fill='clear' onClick={linkGoogle}>
                                    Link Google
                                </IonButton> : <IonChip color='primary'>
                                    <IonIcon icon={logoGoogle} />
                                    <IonText>
                                        {user?.google?.name}
                                    </IonText></IonChip>}
                            </IonRow> : <IonButton onClick={login}>
                                Login</IonButton>}
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
                </TribeContent>
            </IonModal>
        </ >

    );
};

export default Account;
