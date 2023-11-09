import { IonBadge, IonButtons, IonCard, IonCol, IonGrid, IonInput, IonItem, IonRow, IonSpinner, IonTitle, useIonViewWillEnter } from '@ionic/react';
import { Timestamp, collection, doc, getDocs, getFirestore, limit, or, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { app } from '../App';
import { MemberPfp, MemberAlias } from '../components/MemberBadge';
import { timeAgo } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import useTabs from '../hooks/useTabVisibility';
import { formatEth, nativeAuth, uniqByProp } from '../lib/sugar';
import { TribePage } from './TribePage';
import useERCBalance from '../hooks/useERCBalance';
import { usePrivy } from '@privy-io/react-auth';



const Chat: React.FC = () => {
    const auth = nativeAuth()
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser());

    const [members, setMembers] = useState<[{ address: string }]>()
    useEffect(() => {
        const address = me?.address;
        console.log(me, "ME");
        if (typeof address === 'undefined') {
            return;
        }
        const channelsRef = collection(getFirestore(app), "channel");
        const walletField = me?.injectedWallet;
        const conditions = [
            where(`holders.${address}`, '>', 0)
        ];
        // If walletField is defined, add an additional condition
        if (walletField) {
            const q2 = query(channelsRef, where(walletField, '!=', null));
            getDocs(q2)
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
                        setMembers(x => uniqByProp([...x ? x : [], ...result] as any, 'address') as any);
                    }
                })

        }

        const q = query(channelsRef, ...conditions);
        getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
                    setMembers(x => uniqByProp([...x ? x : [], ...result] as any, 'address') as any);
                }
            })
            .catch(error => {
            });

    }, [me])
    const { setTab } = useTabs()
    useIonViewWillEnter(() => {
        setTab('channel')
    })
    const { user } = usePrivy();
    const [channelAddress, setChannelAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933")
    const [chainId, setChainId] = useState(1)
    const { balance, syncing } = useERCBalance(channelAddress as any, chainId as any);
    return (
        <TribePage page='chat'>
            <TribeHeader title='Chats' />
            <TribeContent >
                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        <IonCol sizeMd='6' offsetMd='3' sizeXs='12' style={{ padding: 0}}>
                            <IonCard style={{ margin: 0, borderRadius: 0 }}>
                                {useMemo(() => members && members !== null ? members.map(({ address, }, i) =>
                                    <IonItem lines='none' routerLink={'/channel/' + address} key={address} >
                                        <LastMessage address={address} />
                                    </IonItem>) : <><br /><br /><br /><IonTitle>
                                        <IonSpinner name='crescent' /></IonTitle></>, [members])}
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    {/* <IonRow>
                        <IonInput value={'0x6982508145454Ce325dDbE47a25d4ec3d2311933'} onIonChange={(e) => {
                            setChannelAddress(e.detail?.value as any)
                        }} placeholder='address' />
                    </IonRow> */}
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
        const q = query(collection(channelsRef, 'messages'), orderBy('sent', 'desc'), limit(1));
        getDocs(q)
            .then(querySnapshot => {
                const data = querySnapshot.docs[0].data();
                data && setMsg(data as any);
            });
    }, [address]);

    return (
        <div style={{ paddingTop: '5px', paddingBottom: '5px', paddingLeft: '0px', paddingRight: '0px', display: 'flex', alignItems: 'center', width: '100%' }}>
            <IonButtons slot='start'>
                <MemberPfp address={address} size='double-smol' />
            </IonButtons>
            <div style={{ flex: 1, minWidth: 0, paddingLeft: '8px' }}>
                <div>
                    <MemberAlias address={address}/>
                </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.5 }}>
                            <MemberAlias address={address}/>
                        </span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 400, opacity: 0.5, marginLeft: '5px' }}>
                            : {msg?.content.slice(0, 20)}
                        </span>
                    </div>
                </div>
            <IonButtons slot='end'>
                <IonBadge color={'transparent'}>
                    {msg === null ? <IonSpinner name='dots' /> : timeAgo(new Date(msg.sent.seconds * 1000))}
                </IonBadge>
            </IonButtons>
        </div>
    );
    
};

export default Chat;

