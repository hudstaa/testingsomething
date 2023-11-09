import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonFab, IonFabButton, IonGrid, IonIcon, IonImg, IonItem, IonListHeader, IonModal, IonProgressBar, IonRefresher, IonRefresherContent, IonRouterLink, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
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
import { createChart } from 'lightweight-charts';
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
                title={member !== null ? '〱  ' + member.twitterName : ""}
            />
            < TribeContent fullscreen >
                <IonRefresher slot='fixed' onIonRefresh={() => {

                }}>
                    <IonRefresherContent />
                </IonRefresher>
                {member && member.twitterBackground && !isDesktop && <IonCard style={{ aspectRatio: 3 / 1, margin: 0, borderRadius: 0 }}  >
                    {member?.twitterBackground && <IonImg style={{ position: 'absolute', left: 0, right: 0, top: 0 }} src={member.twitterBackground} />}
                    <IonCardHeader className='ion-image-center' style={{ boderBottom: 0 }}>
                    </IonCardHeader>
                    <IonCardContent>
                    </IonCardContent>
                </IonCard>}

                {member && <IonItem lines='none' style={{ marginTop: 10 }}>
                    <IonRouterLink routerLink={'/member/' + address} routerDirection='none'>
                        <img style={{ width: 40, height: 40, borderRadius: '10px', }} src={member?.twitterPfp || personOutline} />
                    </IonRouterLink>
                    <IonGrid fixed>
                        <IonRow>
                            <IonCol>

                                <IonRow>
                                    <IonRouterLink routerLink={'/member/' + address}>
                                        <IonText>
                                            {member?.twitterName}
                                        </IonText>
                                    </IonRouterLink>
                                </IonRow>
                                <IonRow>
                                    <IonRouterLink routerLink={'/member/' + address}>

                                        <IonText color='medium' className='regular'>
                                            {member?.twitterUsername}
                                        </IonText>
                                    </IonRouterLink>
                                </IonRow>
                            </IonCol>

                            {
                                ftBalance ? <IonChip>
                                    <IonAvatar>
                                        <IonImg src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAV1BMVEX///8AuvoAt/oAtfr8//8Uvfr3/f/d9P5ZyvvO8P7y+//G7P6y5v1mz/tJxvvn+P6V3P2H1/zV8f43w/un4v171Py86f1x0vyf3/0ewPp50fyu4v04wPvgoS+uAAADkUlEQVRoge1Z25bqIAyVYC/WDr2o1R7n/7/zQIvIJYmdkXlzv+mC3TQkOwnd7T744IPcaMZDt/8b6u5SAIjT0P0B90EzGwD0+bmFA9SZjd8XwmMXY1byG4gAx4zcgeELMtreQkwuqmzk14QcTrkifv+dGK5jJhN5k3pFs9/zkB8lQi4gj9vPmOUCVBbyASUX0OYgv+DkoshB/kWQw4CtbqZ+6NuxfJNciFTCygEWSKGGttrwBJIcLvHSbn6u1Y8o6nPzgjxNULc/Mr2co6X6AWpiJZo6UL33Gq6s0XQTV0bniFBMvX6kTh5qMuNiNfe33V4abumvhPPxDF3hx/qIysSDvsBzbmI2yem5jj74dSla2iuG3JPeMqlX8Vos6VDJdTvckR54w43tiExjxeJJ7lzZvyQXBXKqitugolWcczDH0OJiYP3S2J8n1vS09LIv/IiXR706cabLQ0JOZd4C+AotqNkTuiXkHesWm0e1/anmDZb4YP1og/Hxc665xXNKzkmXgKVz7NyL/GPfMw1GNj/Wjn0E95NdnKpvydmy+nFy5JzOYeSMmGp8771g0SnLWoJ034yki9WPlyc5G4tTSt4x64WsvEjUTSQnvRj5josvOPjRChfuNVFyvBm1G9qnsmiokSNHazWjGKab9jS/4HyIkzN5ZAK98pqhivEhoHW6YsiHIM1gYpxONK+0qJuubvLIr0wbQEw7dJk2KeoPfHM6Wrql1HBPSqMhv3vk0JEHhCXoArJkGHLfzXCmg5Fsqqk6nZDXO0IBmAGTssccaKCzsCdklxujCNNNKIbkZ6IwzsyoQdQMEwKhqQoPXP4iCNc7k/4huRzRnIsHkRB4mhpPhuT6iJHy8uoGCzXdBG+U8XJEspTzuEGD5Z5Runv0VJWaLjEpD4Dc6yyujMlhigMmHs4wYCLQYA8to2PYcg+BZJK5NZriv3Uy+o6B+dW0uyAVJWNTmgI6NpT7E9Qmbr9a2o1mSEcEWR73X/LxGlvvGeJavbTFSL4bRxyVBJDqB/eQUbAv3UI6lNlrqqptf3RfFQX7wpLMiWRZeIVo6jVnFU98b1xWBxGzFvRQjtObmO0ovdHEVpdAY9+70vR7oD55GThtjTwcZ+d2e3K+LG7LRgbODbYC+Pn/9qeBclUwEHbiroS09EWGy3XjdhC980Az1WC+mkA6JP8CE6hbeHDduc72yQFL6y7fJ4EPPviAxH9sByOUcm2KWAAAAABJRU5ErkJggg=='} />
                                    </IonAvatar>
                                    <IonText>
                                        {formatUnits(ftBalance, 0)}
                                    </IonText>
                                </IonChip> : <></>
                            }

                            {
                                balance ? <IonChip>
                                    <IonAvatar>
                                        <IonImg src='/favicon.png' />
                                    </IonAvatar>
                                    <IonText>
                                        {formatUnits(balance, 0)}
                                    </IonText>
                                </IonChip> : <></>
                            }

                            {
                                ((ercBalance && ercBalance !== null) || (balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n) ?
                                    <IonButton routerDirection='none' color='tribe' routerLink={'/channel/' + address}>
                                        <IonIcon style={{ filter: 'invert(100%)' }} icon={'/icons/chat-solid.svg'} />
                                    </IonButton>
                                    : <></>
                            }

                        </IonRow>

                    </IonGrid>


                </IonItem>}

                <IonCardHeader>
                    {member?.bio}
                </IonCardHeader>

                {ftSyncing && <IonProgressBar type='indeterminate' color='primary' />}
                {syncing && <IonProgressBar type='indeterminate' color='tribe' />}

                <IonFab slot='fixed' horizontal='end' vertical='bottom'>
                    {!member?.type && <IonFabButton color='tribe' onClick={() => { setTrade(!trade) }}>
                        {trade ? 'OK' : "Boost"}
                    </IonFabButton>}
                </IonFab>
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
                <IonModal ref={modalRef} isOpen={trade} onDidDismiss={() => setTrade(false)}>

                    <IonItem>
                        {member?.twitterName}
                        <IonButtons slot='end'>
                            <IonButton color='danger' onClick={() => {
                                modalRef.current?.dismiss();
                            }}><IonIcon icon={close} /></IonButton>
                        </IonButtons>
                    </IonItem>
                    <IonTitle>

                        <IonImg src={member?.twitterPfp} />
                    </IonTitle>
                    <IonCard>
                        {trade && <IonButton disabled={typeof sellPass === 'undefined' || sellStatus === 'transacting'} color={'danger'} onClick={() => {
                            sellPass && sellPass();
                            modalRef.current?.dismiss();
                        }}>

                            <IonIcon icon={ticketOutline} />
                            <IonText>

                                Sell                      {typeof sellPrice !== 'undefined' && formatEth(sellPrice as bigint)}
                            </IonText>
                        </IonButton>}
                        {trade && <IonButton style={{ position: 'absolute', right: 0 }} disabled={typeof buyPass === 'undefined' || buyStatus === 'transacting'} onClick={() => {
                            // sendTransaction({ chainId: baseGoerli.id, value: 100n, to:})
                            buyPass && buyPass();
                            modalRef.current?.dismiss();
                        }} color='success'>
                            <IonIcon icon={ticketOutline} />                                Buy
                            {typeof buyPrice !== 'undefined' && formatEth(buyPrice as bigint)}
                        </IonButton>}
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
