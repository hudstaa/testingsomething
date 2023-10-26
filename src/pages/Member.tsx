import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonFooter, IonGrid, IonIcon, IonImg, IonItem, IonListHeader, IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle } from '@ionic/react';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { chatboxEllipsesOutline, personOutline, ticketOutline } from 'ionicons/icons';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Address, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { FriendTechPortfolioChip } from '../components/FriendPortfolioChip';
import { MemberBadge } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import useBoosters from '../hooks/useBoosters';
import useBuyPass from '../hooks/useBuyPass';
import useFriendTechBalance from '../hooks/useFriendTechBalance';
import { useFriendTechHolders } from '../hooks/useFriendTechHolders';
import { useMember } from '../hooks/useMember';
import usePassBalance from '../hooks/usePassBalance';
import usePassSupply from '../hooks/usePassSupply';
import useSellPass from '../hooks/useSellPass';
import { formatEth, nativeAuth, uniq } from '../lib/sugar';
import { TribePage } from './TribePage';
import { PostList } from '../components/PostList';
import { MemberGraph } from '../components/MemberGraph';

const Member: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const loading = useMember(x => x.isLoading(address));
    const { user } = usePrivy()
    const auth = nativeAuth()
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));
    const balance: bigint | undefined = usePassBalance((me?.address) as Address, (address) as Address) as any;
    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(address as Address, 1n)
    const member = useMember(x => x.getFriend(address));
    const holding = useFriendTechHolders(x => x.getHolding(member?.friendTechAddress, member?.friendTechAddress || ""))
    const [segment, setSegment] = useState<'posts' | 'boosters' | 'holders' | 'chart'>('posts')
    const { balance: boosters, syncing } = useBoosters(user?.wallet?.address, address)
    const { balance: ftBalance, syncing: ftSyncing } = useFriendTechBalance(member?.friendTechAddress, me?.friendTechAddress, address);
    return (
        <TribePage page='member'>
            <TribeHeader color='tertiary' title={
                member !== null ? member.twitterName : ""} />
            <TribeContent fullscreen>
                <IonCard style={{ aspectRatio: 5 / 1 }}  >
                    {member?.twitterBackground && <IonImg style={{ position: 'absolute', left: 0, right: 0, top: 0 }} src={member.twitterBackground} />}
                    <IonCardHeader className='ion-image-center'>
                        <IonCardTitle>
                            <IonImg style={{ width: '17vw', borderRadius: 200, borderCollapse: 'seperate', perspectice: 1, overflow: 'hidden' }} src={member?.twitterPfp || personOutline} />
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardHeader className='ion-image-center'>
                    </IonCardHeader>
                    <IonCardContent>
                    </IonCardContent>
                </IonCard>
                <IonCardHeader>
                    {member?.bio}
                </IonCardHeader>

                <IonItem color='light'>
                    {ftBalance ? <IonChip>
                        <IonAvatar>
                            <IonImg src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAV1BMVEX///8AuvoAt/oAtfr8//8Uvfr3/f/d9P5ZyvvO8P7y+//G7P6y5v1mz/tJxvvn+P6V3P2H1/zV8f43w/un4v171Py86f1x0vyf3/0ewPp50fyu4v04wPvgoS+uAAADkUlEQVRoge1Z25bqIAyVYC/WDr2o1R7n/7/zQIvIJYmdkXlzv+mC3TQkOwnd7T744IPcaMZDt/8b6u5SAIjT0P0B90EzGwD0+bmFA9SZjd8XwmMXY1byG4gAx4zcgeELMtreQkwuqmzk14QcTrkifv+dGK5jJhN5k3pFs9/zkB8lQi4gj9vPmOUCVBbyASUX0OYgv+DkoshB/kWQw4CtbqZ+6NuxfJNciFTCygEWSKGGttrwBJIcLvHSbn6u1Y8o6nPzgjxNULc/Mr2co6X6AWpiJZo6UL33Gq6s0XQTV0bniFBMvX6kTh5qMuNiNfe33V4abumvhPPxDF3hx/qIysSDvsBzbmI2yem5jj74dSla2iuG3JPeMqlX8Vos6VDJdTvckR54w43tiExjxeJJ7lzZvyQXBXKqitugolWcczDH0OJiYP3S2J8n1vS09LIv/IiXR706cabLQ0JOZd4C+AotqNkTuiXkHesWm0e1/anmDZb4YP1og/Hxc665xXNKzkmXgKVz7NyL/GPfMw1GNj/Wjn0E95NdnKpvydmy+nFy5JzOYeSMmGp8771g0SnLWoJ034yki9WPlyc5G4tTSt4x64WsvEjUTSQnvRj5josvOPjRChfuNVFyvBm1G9qnsmiokSNHazWjGKab9jS/4HyIkzN5ZAK98pqhivEhoHW6YsiHIM1gYpxONK+0qJuubvLIr0wbQEw7dJk2KeoPfHM6Wrql1HBPSqMhv3vk0JEHhCXoArJkGHLfzXCmg5Fsqqk6nZDXO0IBmAGTssccaKCzsCdklxujCNNNKIbkZ6IwzsyoQdQMEwKhqQoPXP4iCNc7k/4huRzRnIsHkRB4mhpPhuT6iJHy8uoGCzXdBG+U8XJEspTzuEGD5Z5Runv0VJWaLjEpD4Dc6yyujMlhigMmHs4wYCLQYA8to2PYcg+BZJK5NZriv3Uy+o6B+dW0uyAVJWNTmgI6NpT7E9Qmbr9a2o1mSEcEWR73X/LxGlvvGeJavbTFSL4bRxyVBJDqB/eQUbAv3UI6lNlrqqptf3RfFQX7wpLMiWRZeIVo6jVnFU98b1xWBxGzFvRQjtObmO0ovdHEVpdAY9+70vR7oD55GThtjTwcZ+d2e3K+LG7LRgbODbYC+Pn/9qeBclUwEHbiroS09EWGy3XjdhC980Az1WC+mkA6JP8CE6hbeHDduc72yQFL6y7fJ4EPPviAxH9sByOUcm2KWAAAAABJRU5ErkJggg=='} />
                        </IonAvatar>
                        <IonText>
                            {formatUnits(ftBalance, 0)}
                        </IonText>
                    </IonChip> : <></>}
                    {balance ? <IonChip>
                        <IonAvatar>
                            <IonImg src='/favicon.png' />
                        </IonAvatar>
                        <IonText>
                            {formatUnits(balance, 0)}
                        </IonText>
                    </IonChip> : <></>}
                </IonItem>
                <IonListHeader>{segment.slice(0, 1).toUpperCase() + segment.slice(1, segment.length)}</IonListHeader>

                <IonSegment value={segment}>
                    <IonSegmentButton value={'posts'} onClick={() => { setSegment('posts') }} >
                        Posts
                    </IonSegmentButton>
                    <IonSegmentButton value={'boosters'} onClick={() => { setSegment('boosters') }} >
                        Tribe
                    </IonSegmentButton>
                    {member?.friendTechAddress && <IonSegmentButton value={'holders'} onClick={() => { setSegment('holders') }} >
                        Friend Tech
                    </IonSegmentButton>}
                    {<IonSegmentButton value={'chart'} onClick={() => { setSegment('chart') }} >
                        Chart
                    </IonSegmentButton>}

                </IonSegment>
                {segment === 'posts' &&

                    <IonGrid>
                        <IonRow>
                            <IonCol sizeLg='6' offsetLg='3' sizeMd='8' offsetMd='2' offsetXs='0' sizeXs='12'>

                                <PostList type={'top'} max={3} from={member?.address} />
                            </IonCol></IonRow></IonGrid>}
                {segment === 'boosters' && typeof boosters !== 'undefined' && boosters !== null && (boosters as any)[0]?.map((holder: any, i: number) => <IonItem key={i} lines='none'>
                    <MemberBadge address={holder} />
                    <IonButtons slot='end'>
                        {(boosters as any)[1] && formatUnits((boosters as any)[1][i], 0)}
                    </IonButtons>
                </IonItem>)}
                {segment === 'holders' && <>
                    {uniq(holding?.users || []).map((holder) =>
                        <FriendTechPortfolioChip key={holder.address} address={holder.address} name={holder.twitterName} pfp={holder.twitterPfpUrl} />
                    )}
                </>}
                {segment == 'chart' && member?.address && <MemberGraph address={member.address} />}

            </TribeContent >
            <IonFooter>

                <IonRow>
                    <IonCol size='6'>

                        <IonButton fill='solid' expand='full' disabled={typeof sellPass === 'undefined' || sellStatus === 'transacting'} color={'danger'} onClick={() => {
                            sellPass && sellPass();
                        }}>

                            <IonIcon icon={ticketOutline} />
                            <IonText>

                                Sell                      {typeof sellPrice !== 'undefined' && formatEth(sellPrice as bigint)}
                            </IonText>
                        </IonButton>
                    </IonCol>
                    <IonCol size={'6'}>

                        <IonButton fill='solid' expand='full' disabled={typeof buyPass === 'undefined' || buyStatus === 'transacting'} onClick={() => {
                            // sendTransaction({ chainId: baseGoerli.id, value: 100n, to:})
                            buyPass && buyPass();
                            console.log(buyPass);
                        }} color='success'>
                            <IonIcon icon={ticketOutline} />                                Buy
                            {typeof buyPrice !== 'undefined' && formatEth(buyPrice as bigint)}
                        </IonButton>
                    </IonCol>

                </IonRow>

                {ftSyncing && <IonProgressBar type='indeterminate' color='primary' />}
                {syncing && <IonProgressBar type='indeterminate' color='tribe' />}

                {useMemo(() =>
                    ((balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n) ? <IonButton size='large' fill='solid' color='tertiary' expand='full' routerLink={'/chat/' + address}>
                        <IonText>
                            Chat
                        </IonText>
                        <IonIcon icon={chatboxEllipsesOutline} />
                    </IonButton> : <></>
                    , [balance, ftBalance, address])}
                { }

            </IonFooter>
        </ TribePage>

    );
};

export default Member;
