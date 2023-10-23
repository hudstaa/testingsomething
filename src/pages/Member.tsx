import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonFooter, IonIcon, IonImg, IonItem, IonListHeader, IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle } from '@ionic/react';
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
import { formatEth, uniq } from '../lib/sugar';
import { TribePage } from './TribePage';
import { PostList } from '../components/PostList';

const Member: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const loading = useMember(x => x.isLoading(address));
    const { user } = usePrivy()
    const balance: bigint | undefined = usePassBalance((user?.wallet?.address) as Address, (address) as Address) as any;
    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(address as Address, 1n)
    const member = useMember(x => x.getFriend(address));
    const me = useMember(x => x.getFriend(user?.wallet?.address));
    const holding = useFriendTechHolders(x => x.getHolding(member?.friendTechAddress, member?.friendTechAddress || ""))
    const [segment, setSegment] = useState<'posts' | 'boosters' | 'holders'>('posts')
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
                        <IonChip color={'medium'}>
                            FriendTech:
                            {ftBalance?.toString()}
                        </IonChip>
                        <IonChip>
                            Tribe:
                            {balance?.toString()}
                        </IonChip>
                    </IonCardContent>
                </IonCard>
                <IonCardHeader>
                    {member?.bio}

                </IonCardHeader>

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

                </IonSegment>
                {segment === 'posts' && <PostList type={'top'} limit={3} from={member?.address} />}
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


                {!user && loading === false && <IonTitle color='warning'>NOT AUTHENTICATED</IonTitle>}

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

                {ftSyncing && <IonProgressBar type='indeterminate' color='tertiary' />}
                {syncing && <IonProgressBar type='indeterminate' color='success' />}

                {useMemo(() =>
                    ((balance && balance > 0n) || ftBalance && (ftBalance as any) > 0n) && !ftSyncing && !syncing ? <IonButton size='large' fill='solid' color='tertiary' expand='full' routerLink={'/chat/' + address}>
                        <IonText>
                            Chat
                        </IonText>
                        <IonIcon icon={chatboxEllipsesOutline} />
                    </IonButton> : <></>
                    , [balance, ftBalance, address, ftSyncing, syncing])}
                { }

            </IonFooter>
        </ TribePage>

    );
};

export default Member;
