import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonListHeader, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRouterLink, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { close, personOutline, ticketOutline } from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router';
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
import { BuyPriceBadge, BuyPriceText } from './Discover';
import useERCBalance from '../hooks/useERCBalance';
import { createChart } from 'lightweight-charts';
import { TradingViewWidget } from '../components/Erc20Chart';
import { useWriteMessage } from '../hooks/useWriteMessage';


const Member: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const { user } = usePrivy()
    const me = useMember(x => x.getCurrentUser());
    const highlight = useMember(x => x.setHighlight)
    const balance: bigint | undefined = usePassBalance((me?.address) as Address, (address) as Address) as any;
    const ercBalance: bigint | undefined = useERCBalance((address) as Address, 1) as any;
    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(address as Address, 1n)
    const member = useMember(x => x.getFriend(address));
    const holding = useFriendTechHolders(x => x.getHolding(member?.friendTechAddress, member?.friendTechAddress as any))
    const [segment, setSegment] = useState<'posts' | 'tribe' | 'holders' | 'chart'>(address !== '0x0000000000000000000000000000000000000000' ? 'posts' : 'tribe')
    const { balance: boosters, syncing } = useBoosters(user?.wallet?.address, address)
    const { balance: ftBalance, syncing: ftSyncing } = useFriendTechBalance(member?.friendTechAddress, me?.friendTechAddress, address);
    const {push}=useHistory();
    useIonViewDidLeave(() => {
        document.title = 'Tribe Beta';
    })
    useEffect(() => {
        if (member && member.twitterName) {
            document.title = member.twitterName;
        }
    }, [member]);
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'light';
    const { setPresentingElement } = useWriteMessage()
    const pageRef = useRef<any>(null)

    useIonViewDidEnter(() => {
        setPresentingElement(pageRef.current)
    })

    return (
        <IonPage ref={pageRef}>
            <TribeHeader
                color='tertiary'
                title={member !== null ? member.twitterName : ""}
                showBackButton={true}
            />
            < TribeContent fullscreen color={bgColor} >

                <IonCard color={bgColor}>
                    <IonCardHeader className='ion-image-center' style={{ boderBottom: 0 }}>
                        <IonRouterLink href={'https://x.com/' + member?.twitterUsername} target='_new'>
                            <IonText color='medium'>
                                𝕏 {member?.twitterUsername}
                            </IonText>
                        </IonRouterLink>
                        <IonText color='medium'>
                            {member?.bio}
                        </IonText>
                        <IonText >
                            {member?.twitterName}
                        </IonText>
                        <div style={{ marginTop: '-27.297px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            {member && <button  disabled={address === '0x0000000000000000000000000000000000000000'} size='small' style={{ height:42,padding:4,backgroundColor:'#F45000',borderRadius:100, margin: '0', marginRight: 5 }} color='tribe' onMouseDown={() => { highlight(member!.address) }}>
        <IonText color='white' style={{fontSize:19,margin:'auto',padding:10,fontWeight:'bold',paddingBottom:10}}>
            Boost                                <BuyPriceText address={member?.address} />

            </IonText>
                            </button>}
                            {balance ? (
                                <div style={{ margin: 5 }}>

                                </div>
                            ) : null}


                            {address === "0x0000000000000000000000000000000000000000" ? <button color='tribe' style={{  height:42, marginTop: 0, marginLeft: 0,padding:10,backgroundColor:'#F45000',borderRadius:50, margin: '0', }} onMouseDown={()=>push('/channel/' + address)}>
                                <img style={{ filter: 'invert(100%)' ,height:24}} src={'/icons/chat-solid.svg'} />
                            </button> : <button disabled={!(((balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n))}  style={{ height:42,margin: '0', marginLeft: 0,padding:10,backgroundColor:'#F45000',borderRadius:50 }} routerDirection='none' color='tribe'  onMouseDown={()=>push('/channel/' + address)}>
                                <img style={{ filter: 'invert(100%)',height:24,padding:0,margin:0 }} src={'/icons/chat-solid.svg'} />
                            </button>}
                        </div>

                    </IonCardContent>
                </IonCard>

                {ftSyncing && <IonProgressBar type='indeterminate' color='primary' />}
                {syncing && <IonProgressBar type='indeterminate' color='tribe' />}





                {<>
                    {member && <SubscribeButton topic={member.address} uid={nativeAuth().currentUser?.uid || ""} />}
                </>}
                {member && <>
                    <IonGrid>
                        <IonRow>
                            <IonCol sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='0' sizeSm='12'>
                                <IonSegment mode='md' value={segment}>
                                    {member.address !== '0x0000000000000000000000000000000000000000' && <IonSegmentButton style={{ margin: 0 }} value={'posts'} onClick={() => { setSegment('posts') }} >
                                        Posts
                                    </IonSegmentButton>}
                                    <IonSegmentButton value={'tribe'} onClick={() => { setSegment('tribe') }} >
                                        Tribe
                                    </IonSegmentButton>
                                    {member.address !== '0x0000000000000000000000000000000000000000' && <IonSegmentButton color='tribe' value={'chart'} onClick={() => { setSegment('chart') }} >
                                        Chart
                                    </IonSegmentButton>}
                                </IonSegment>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                </>
                }
                {member != null && member?.symbol &&

                    <TradingViewWidget symbol={member?.symbol} />
                }

                <div>

                    {
                        segment === 'posts' &&

                        <IonGrid>
                            <IonRow>
                                <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ padding: 0 }}>

                                    <PostList type={'top'} max={10} from={member?.address} />
                                </IonCol></IonRow></IonGrid>
                    }
                    {
                        segment === 'tribe' && typeof boosters !== 'undefined' && boosters !== null && <>
                            <IonGrid>
                                <IonRow>
                                    <IonCol sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='3'>
                                        {(boosters as any)[0]?.map((holder: any, i: number) => <IonItem key={i} lines='none'>
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
                                    </IonCol></IonRow></IonGrid>
                        </>}

                    {segment === 'chart' ? <>
                        <IonGrid>
                            <IonRow>
                                <IonCol sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='3'>
                                    <IonCard>
                                        {member && <MemberGraph address={member?.address} />}
                                    </IonCard>
                                </IonCol></IonRow></IonGrid>
                    </> : <></>
                    }
                </div>

            </TribeContent >
        </ IonPage >

    );
};

export default Member;
