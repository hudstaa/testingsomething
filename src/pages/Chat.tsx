import { IonBadge, IonList, IonButtons, IonAvatar, IonImg, IonSearchbar, IonCard, IonCol, IonGrid, IonInput, IonItem, IonRow, IonSpinner, IonTitle, useIonViewWillEnter } from '@ionic/react';
import { Timestamp, collection, doc, getDocs, getFirestore, limit, or, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { app } from '../App';
import { MemberPfp, MemberAlias } from '../components/MemberBadge';
import { timeAgo } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember, Member } from '../hooks/useMember';
import useTabs from '../hooks/useTabVisibility';
import { formatEth, nativeAuth, showTabs, uniqByProp } from '../lib/sugar';
import { TribePage } from './TribePage';
import useERCBalance from '../hooks/useERCBalance';
import { usePrivy } from '@privy-io/react-auth';
import algoliasearch from 'algoliasearch';
import { Message } from '../models/Message';


const searchClient = algoliasearch('LR3IQNACLB', 'd486674e7123556e91d7557fa704eb20');



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
        setTab('chat')
    })
    const { user } = usePrivy();
    const [channelAddress, setChannelAddress] = useState("0x6982508145454Ce325dDbE47a25d4ec3d2311933")
    const [chainId, setChainId] = useState(1)
    const { balance, syncing } = useERCBalance(channelAddress as any, chainId as any);
    const [hits, setHits] = useState<Member[]>([])

    return (
        <TribePage page='chat'>
            <TribeHeader title='Chats' color='primary' content={
                <>
                    <IonSearchbar onIonInput={(event) => {
                        event.detail.value && event.detail.value !== null && searchClient.search([{ query: event.detail.value, indexName: 'tribe-members' }]).then((res) => {
                            setHits((res.results[0] as any).hits || [])
                        })
                    }} />
                    <IonList>
                        {hits.map(x => <IonItem detail={false} lines='none' color='light' onClick={() => {
                            setHits([])
                        }} routerLink={'/member/' + x.address}>
                            <IonButtons slot='start'>
                                <IonAvatar>
                                    <IonImg src={x.twitterPfp} />
                                </IonAvatar>
                            </IonButtons>
                            {x.twitterName}
                            {x.type}
                        </IonItem>)}

                    </IonList>
                </>
            } />
            <TribeContent >
                <IonGrid style={{ padding: 0 }}>
                    <IonRow>
                        <IonCol sizeMd='6' offsetMd='3' sizeXs='12' style={{ padding: 0 }}>
                            <IonCard style={{ margin: 0, borderRadius: 0 }}>
                                {useMemo(() => members && members !== null ? members.map(({ address, }, i) =>
                                    <IonItem routerDirection='root' lines='none' routerLink={'/channel/' + address} key={address} >
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
    const [msg, setMsg] = useState<Message | null>(null);
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
                    <MemberAlias address={address} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 400, opacity: 0.5 }}>
                        <MemberAlias address={msg?.author as any} />
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 400, opacity: 0.5, marginLeft: '5px' }}>
                        : {msg?.content?.slice(0, 20)}
                    </span>
                </div>
            </div>
            <IonButtons slot='end'>
                <IonBadge color={'transparent'} style={{ opacity: 0.5 }}>
                    {msg && msg?.sent !== null ? timeAgo(new Date(msg.sent.seconds * 1000)) : <IonSpinner name='dots' />}
                </IonBadge>
            </IonButtons>
        </div>
    );

};

export default Chat;

