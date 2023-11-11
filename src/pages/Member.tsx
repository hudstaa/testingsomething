import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonListHeader, IonModal, IonProgressBar, IonRefresher, IonRefresherContent, IonRouterLink, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { close, personOutline, ticketOutline } from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Address, formatUnits } from 'viem';
import { FriendTechPortfolioChip } from '../components/FriendPortfolioChip';
import { MemberBadge, MemberCardHeader } from '../components/MemberBadge';
import { MemberGraph } from '../components/MemberGraph';
import { PostList } from '../components/PostList';
import SubscribeButton from '../components/SubscribeButton';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import useBoosters from '../hooks/useBoosters';
import useBuyPass from '../hooks/useBuyPass';
import useFriendTechBalance from '../hooks/useFriendTechBalance';
import { useFriendTechHolders } from '../hooks/useFriendTechHolders';
import { useMember } from '../hooks/useMember';
import usePassBalance from '../hooks/usePassBalance';
import useSellPass from '../hooks/useSellPass';
import useTabs from '../hooks/useTabVisibility';
import { formatEth, nativeAuth, uniq } from '../lib/sugar';
import { TribePage } from './TribePage';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { OnBoarding } from './OnBoarding';
import { BuyPriceBadge } from './Discover';
import useERCBalance from '../hooks/useERCBalance';
import { TradingViewWidget } from '../components/Erc20Chart';


const Member: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const { user } = usePrivy()
    const me = useMember(x => x.getCurrentUser());
    const balance: bigint | undefined = usePassBalance((me?.address) as Address, (address) as Address) as any;
    const ercBalance: bigint | undefined = useERCBalance((address) as Address, 1) as any;
    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(address as Address, 1n)
    const member = useMember(x => x.getFriend(address));
    const holding = useFriendTechHolders(x => x.getHolding(member?.friendTechAddress, member?.friendTechAddress as any))
    const [segment, setSegment] = useState<'posts' | 'tribe' | 'holders' | 'chart'>('posts')
    const { balance: boosters, syncing } = useBoosters(user?.wallet?.address, address)
    const { balance: ftBalance, syncing: ftSyncing } = useFriendTechBalance(member?.friendTechAddress, me?.friendTechAddress, address);
    const [trade, setTrade] = useState<boolean>(false);
    const uid = nativeAuth().currentUser?.uid;
    const { setTab } = useTabs()
    const { wallet: activeWallet, setActiveWallet, ready: wagmiReady } = usePrivyWagmi();
    const { wallets } = useWallets();
    const modalRef = useRef<HTMLIonModalElement>(null)
    useIonViewWillEnter(() => {
        setTrade(false);
        setTab('member')
    })
    useIonViewDidEnter(() => {
        setTab('member');
    })

    useIonViewDidLeave(() => {
        document.title = 'Tribe Alpha';
    })
    const isDesktop = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
    useEffect(() => {
        if (member && member.twitterName) {

            document.title = member.twitterName;
        }
    }, [member]);
    return (
        <TribePage page='member'>
            <TribeHeader
                color='tertiary'
                title={""}
                showBackButton={true}
            />
            < TribeContent fullscreen >
                <IonRefresher slot='fixed' onIonRefresh={() => {

                }}>
                    <IonRefresherContent />
                </IonRefresher>
                <IonCard color='black' style={{marginTop: 0, marginBottom: 5 }}>
                    <IonCardHeader className='ion-image-center' style={{ boderBottom: 0, paddingTop: 0 }}>
                        <IonText color='medium' style={{ paddingTop: 5, fontSize: 16, fontWeight: 450 }}>
                            {member?.bio}
                        </IonText>
                        <IonCardContent style={{padding: 5}}><IonItem lines='none' color='black' className='ion-text-center'>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <IonButton style={{ margin: 0, marginRight: 5 }} color='tribe' onMouseDown={() => { setTrade(true); }}>
                                Boost
                            </IonButton>
                            {((balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n) ? (
                                <IonButton style={{ margin: 'auto', marginLeft: 0 }} routerDirection='none' color='tribe' routerLink={'/channel/' + address}>
                                    <IonIcon style={{ filter: 'invert(100%)' }} icon={'/icons/chat-solid.svg'} />
                                </IonButton>
                            ) : null}
                        </div>
                    </IonItem>
                    </IonCardContent>
                        <IonText style={{ paddingTop: 10, fontSize: 24, fontWeight: 600, letterSpacing: -1}}>
                            {member?.twitterName}
                        </IonText>
                        <img style={{ width: 64, height: 64, borderRadius: '15px', }} src={member?.twitterPfp || personOutline} />
                    </IonCardHeader>
                    
                </IonCard>

                {ftSyncing && <IonProgressBar type='indeterminate' color='primary' />}
                {syncing && <IonProgressBar type='indeterminate' color='tribe' />}

                <IonFab slot='fixed' horizontal='start' vertical='bottom'>
                    <IonRouterLink href={'javascript:void(0)'}>
                        {member && !trade && !member.type && <BuyPriceBadge onClick={() => {
                            setTrade(true);
                        }} address={member.address} />}
                    </IonRouterLink>
                </IonFab>




                {<>
                    {member && <SubscribeButton topic={member.address} uid={nativeAuth().currentUser?.uid || ""} />}
                </>}
                {member && !member.type && <IonItem>
                    <IonSegment mode='md' value={segment}>
                        <IonSegmentButton style={{ margin: 0 }} value={'posts'} onClick={() => { setSegment('posts') }} >
                            Posts
                        </IonSegmentButton>
                        <IonSegmentButton value={'tribe'} onClick={() => { setSegment('tribe') }} >
                            Tribe
                        </IonSegmentButton>
                        {<IonSegmentButton color='tribe' value={'chart'} onClick={() => { setSegment('chart') }} >
                            Chart
                        </IonSegmentButton>}
                    </IonSegment>
                </IonItem>}
                <IonModal initialBreakpoint={0.25} breakpoints={[0, 0.25, 0.5, 0.75]} ref={modalRef} isOpen={trade} onDidDismiss={() => setTrade(false)}>

                    <IonCard>
                        <IonItem lines='none'>
                            <IonAvatar>
                                <IonImg src={member?.twitterPfp} />
                            </IonAvatar>

                            {member?.twitterName}
                            <IonButtons slot='end'>
                                <IonButton color='danger' onClick={() => {
                                    modalRef.current?.dismiss();
                                }}><IonIcon icon={close} /></IonButton>
                            </IonButtons>
                        </IonItem>
                        <IonRow>
                            <IonCol size='6'>
                                {trade && <IonButton disabled={typeof sellPass === 'undefined' || sellStatus === 'transacting'} color={'danger'} onClick={() => {
                                    sellPass && sellPass();
                                    modalRef.current?.dismiss();
                                }}>

                                    <IonText>

                                        Sell                      {typeof sellPrice !== 'undefined' && formatEth(sellPrice as bigint)}
                                    </IonText>
                                </IonButton>}
                            </IonCol>
                            <IonCol size='6'>

                                {trade && <IonButton style={{ position: 'absolute', right: 0 }} disabled={typeof buyPass === 'undefined' || buyStatus === 'transacting'} onClick={() => {
                                    // sendTransaction({ chainId: baseGoerli.id, value: 100n, to:})
                                    buyPass && buyPass();
                                    modalRef.current?.dismiss();
                                }} color='success'>
                                    Buy
                                    {typeof buyPrice !== 'undefined' && formatEth(buyPrice as bigint)}
                                </IonButton>}
                            </IonCol>

                        </IonRow>

                    </IonCard>
                </IonModal>
                {member != null && member.type && member?.symbol &&

                    <TradingViewWidget symbol={member?.symbol} />
                }

                <div>

                    {
                        segment === 'posts' &&

                        <IonGrid>
                            <IonRow>
                                <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>

                                    <PostList type={'top'} max={3} from={member?.address} />
                                </IonCol></IonRow></IonGrid>
                    }
                    {
                        segment === 'tribe' && typeof boosters !== 'undefined' && boosters !== null && <> {(boosters as any)[0]?.map((holder: any, i: number) => <IonItem key={i} lines='none'>
                            <MemberBadge address={holder} />
                            <IonButtons slot='end'>
                                <IonChip>
                                    <IonAvatar>
                                        <IonImg src='/favicon.png' />
                                    </IonAvatar>
                                    <IonText>
                                        {(boosters as any)[1] && formatUnits((boosters as any)[1][i], 0)}
                                    </IonText>

                                </IonChip>

                            </IonButtons>
                        </IonItem>)
                        }
                            {uniq(holding?.users || []).map((holder) =>
                                <FriendTechPortfolioChip held={holder.balance} key={holder.address} address={holder.address} name={holder.twitterName} pfp={holder.twitterPfpUrl} />
                            )}

                        </>}

                    {segment === 'chart' ? <><IonRow>
                        {member && <MemberGraph address={member?.address} />}
                    </IonRow>
                    </> : <></>
                    }
                </div>

            </TribeContent >
        </ TribePage >

    );
};

export default Member;
