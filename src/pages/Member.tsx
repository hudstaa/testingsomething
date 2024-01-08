import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonListHeader, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRouterLink, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { close, personOutline, ticketOutline } from 'ionicons/icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router';
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
import { useWriteMessage } from '../hooks/useWriteMessage';


const Member: React.FC<{ profile: boolean }> = ({ profile }) => {
    let { address } = useParams<{ address: string }>();
    const { user } = usePrivy()
    const me = useMember(x => x.getCurrentUser());
    if (profile) {
        address = me?.address as string;
    }
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

    useIonViewDidLeave(() => {
        document.title = 'Tribe Beta';
    })
    useEffect(() => {
        if (member && member.twitterName) {
            document.title = member.twitterName;
        }
    }, [member]);
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? 'black' : 'white';
    const { setPresentingElement } = useWriteMessage()
    const pageRef = useRef<any>(null)

    useIonViewDidEnter(() => {
        setPresentingElement(pageRef.current)
    })
    if (address === 'undefined') {
        return <Redirect to={'/member'} />
    }
    return (
        <IonPage ref={pageRef}>
            <TribeHeader
                color={bgColor}
                title=""
                sticky
                showBackButton={!profile}
            />
            < TribeContent fullscreen color={bgColor} >
                <IonImg src={member?.twitterPfp} style={{ width: '100%', height: '5vh', filter: 'blur(5px)', transform: 'scale(10)', overflow: 'hidden' }} />
                <div style={{ paddingLeft: '12px', position: 'relative', zIndex: 555, width: '100px' }}>
                    <img style={{ width: 80, height: 80, borderRadius: '24px', marginTop: 0, border: '2.5px solid var(--ion-color-tabblur)' }} src={member?.twitterPfp || personOutline} />
                </div>
                <IonCard color={'black'} style={{ backgroundColor: 'var(--ion-color-tabblur)', marginLeft: 0, marginRight: 0, marginTop: '-50px', marginBottom: 0, padding: 0, borderRadius: 0, overflow: 'visible', zIndex: 444 }}>
  
                    <IonCardHeader className='ion-image-left' style={{ padding: 15, boderBottom: 0, zIndex: 777 }}>
                        <IonText style={{ marginTop: '-6px', paddingTop: 15, paddingBottom: 0, fontSize: '.95rem' }} color='dark' className='regular' >
                            {member?.bio}
                        </IonText>
                        <IonRouterLink href={'https://x.com/' + member?.twitterUsername} target='_new'>
                            <IonText color='dark' className='regular' style={{  marginTop: '0px', opacity: 0.75, fontSize: '.95rem' }}>
                                @{member?.twitterUsername}
                            </IonText>
                        </IonRouterLink>
                        <IonText className='bold' color='dark' style={{ marginTop: '16px', paddingTop: 2, paddingBottom: 3, fontSize: '1.15rem' }} >
                            {member?.twitterName}
                        </IonText>
                        <div style={{ marginRight: -12, marginTop: '-8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', zIndex: 777 }}>
                            {address === "0x0000000000000000000000000000000000000000" ? <IonButton color='tribe' style={{ marginTop: 0, marginLeft: 0, zIndex: 777 }} routerLink={'/channel/' + address}>
                                <IonIcon style={{ filter: 'invert(100%)' }} icon={'/icons/msg.svg'} />
                            </IonButton> : <IonButton disabled={!(((balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n))} size='small' style={{ border: "4px solid #FF6000", borderRadius: 20, margin: '0', marginLeft: 0, zIndex: 777 }} routerDirection='none' color='tribe' routerLink={'/channel/' + address}>
                                <IonIcon style={{ filter: 'invert(100%)' }} icon={'/icons/msg.svg'} />
                            </IonButton>}
                            {member && <IonButton disabled={address === '0x0000000000000000000000000000000000000000'} size='small' style={{ border: "4px solid #FF6000", borderRadius: 20, margin: '0', marginLeft: 5, zIndex: 777 }} color='tribe' onMouseDown={() => { highlight(member!.address) }}>
                                <span className="heavy" style={{ fontSize: 14.5 }}>Buy Friend</span>
                            </IonButton>}
                            {balance ? (
                                <div className="heavy" style={{ margin: 5, fontSize: 14.5 }}>
                                </div>
                            ) : null}
                        </div>
                       
                    </IonCardHeader>
                </IonCard>

                {ftSyncing && <IonProgressBar type='indeterminate' color='primary' />}
                {syncing && <IonProgressBar type='indeterminate' color='tribe' />}





                {<>
                    {member && <SubscribeButton topic={member.address} uid={nativeAuth().currentUser?.uid || ""} />}
                </>}
                {member && <>
                    <IonGrid style={{ padding: 0, borderBottom: '1px solid var(--ion-color-medium-shade', backgroundColor: 'var(--ion-color-tabblur)', zIndex: 999999}}>
                        <IonRow>
                            <IonCol sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='0' sizeSm='12' style={{ padding: '0px',backgroundColor: 'var(--ion-color-tabblur)' }}>
                                <IonSegment className='custom1' color='tabblur' mode='md' value={segment}>
                                    {member.address !== '0x0000000000000000000000000000000000000000' && <IonSegmentButton style={{ margin: 0 }} value={'posts'} onClick={() => { setSegment('posts') }} >
                                        <span className='bold' style={{ fontSize: '1rem' }}>Posts</span>
                                    </IonSegmentButton>}
                                    <IonSegmentButton value={'tribe'} onClick={() => { setSegment('tribe') }} >
                                        <span className='bold' style={{ fontSize: '1rem' }}>Tribe</span>
                                    </IonSegmentButton>
                                    {member.address !== '0x0000000000000000000000000000000000000000' && <IonSegmentButton color='tribe' value={'chart'} onClick={() => { setSegment('chart') }} >
                                        <span className='bold' style={{ fontSize: '1rem' }}>Chart</span>
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
                        segment === 'posts' && <IonGrid style={{ padding: 0 }}>
                            <IonRow>
                                <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12' style={{ backgroundColor: 'var(--ion-color-tabblur)',zIndex: 999999, padding: 0 }}>
                                    {member!==null&&member.address&&<PostList type={'top'} max={10} from={member!.address} />}
                                </IonCol></IonRow></IonGrid>
                    }
                    {
                        segment === 'tribe' && typeof boosters !== 'undefined' && boosters !== null && <>
                            <IonGrid style={{padding: 0}}>
                                <IonRow>
                                    <IonCol style={{padding: 0}} sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='3'>
                                        {(boosters as any)[0]?.map((holder: any, i: number) => <IonItem  style={{ '--padding-start': '2px', paddingTop: 0, paddingBottom: 0, '--inner-padding-end': '0','--border-color': 'var(--ion-color-light)' }} key={i} lines='full'>
                                            <MemberBadge  color='transparent' address={holder} />
                                            <IonButtons slot='end'>
                                                <IonChip color='transparent'>
                                                    <IonText className='heavy' color="tribe" style={{ fontSize: '1.25rem'}}>
                                                        {(boosters as any)[1] && formatUnits((boosters as any)[1][i], 0)}
                                                    </IonText>
                                                    <IonAvatar style={{ marginLeft: 5 }}>
                                                        <IonImg  src='/icons/bolt.svg' />
                                                    </IonAvatar>
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
                        <IonGrid style={{ padding: 0 }}>
                            <IonRow>
                                <IonCol style={{ padding: 0 }} sizeLg='6' sizeXs='12' sizeMd='6' offsetLg='3' offsetMd='3' offsetSm='3'>
                                    <IonCard className='transparent' style={{ margin: 0 }}>
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
