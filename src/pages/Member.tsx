import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonList, IonListHeader, IonLoading, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { useClient, useConversations, useStartConversation, useCanMessage } from '@xmtp/react-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { chatboxEllipsesOutline, logoTwitter, personOutline, ticketOutline } from 'ionicons/icons';
import { baseGoerli } from 'viem/chains';
import useBuyPass from '../hooks/useBuyPass';
import { Address, formatEther, formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import useSellPass from '../hooks/useSellPass';
import { TribeContent } from '../components/TribeContent';
import usePassBalance from '../hooks/usePassBalance';
import usePassSupply from '../hooks/usePassSupply';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { MemberGraph } from '../components/MemberGraph';
import { useEffect, useMemo, useState } from 'react';
import { useTitle } from '../hooks/useTitle';
import { TribeHeader } from '../components/TribeHeader';
import { formatEth, uniq } from '../lib/sugar';
import { MemberBadge, MemberChip } from '../components/MemberBadge';
import { FriendPortfolioChip, FriendTechPortfolioChip } from '../components/FriendPortfolioChip';
import useBoosters from '../hooks/useBoosters';
import { useFriendTechHolders } from '../hooks/useFriendTechHolders';

const Member: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const loading = useMember(x => x.isLoading(address));
    const { user, sendTransaction, logout } = usePrivy()
    const chainId = useChainId();
    const balance: bigint | undefined = usePassBalance((user?.wallet?.address || "0x0000000000000000000000000000000000000000") as Address, (address || "0x0000000000000000000000000000000000000000") as Address) as any;
    const supply: bigint | undefined = usePassSupply((address || "0x0000000000000000000000000000000000000000") as Address) as any;
    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(address as Address, 1n)
    const member = useMember(x => x.getFriend(address));
    const { ready, wallet } = usePrivyWagmi()
    const { balance: boosters } = useBoosters(wallet?.address, address)
    const [selectedHolderType, setSelectedHolderType] = useState('tribe')
    const holding = useFriendTechHolders(x => x.getHolding(member?.friendTechAddress, member?.friendTechAddress || ""))
    return (
        <IonPage>
            <TribeHeader color='tertiary' title={
                member !== null ? member.twitterName : ""} />
            <TribeContent fullscreen>
                <IonCard>
                    <IonCardHeader className='ion-image-center'>
                        <IonCardTitle>

                            <IonAvatar>
                                <IonImg src={member?.twitterPfp || personOutline} style={{ width: 50, height: 50 }} />
                            </IonAvatar>
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardHeader className='ion-image-center'>
                        <IonCardSubtitle>
                            <FriendPortfolioChip address={member?.address} />
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
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


                        <IonListHeader>{selectedHolderType === 'tribe' ? 'Boosters' : 'Holders'}</IonListHeader>

                        <IonSegment value={selectedHolderType}>
                            <IonSegmentButton value={'tribe'} onClick={() => { setSelectedHolderType('tribe') }} >
                                Tribe
                            </IonSegmentButton>
                            <IonSegmentButton value={'friendtech'} onClick={() => { setSelectedHolderType('friendtech') }} >
                                Friend Tech
                            </IonSegmentButton>
                        </IonSegment>
                        {selectedHolderType === 'tribe' && typeof boosters !== 'undefined' && boosters !== null && (boosters as any)[0]?.map((holder: any, i: number) => <IonItem lines='none'>
                            <MemberBadge address={holder} />
                            <IonButtons slot='end'>
                                {(boosters as any)[1] && formatUnits((boosters as any)[1][i], 0)}
                            </IonButtons>
                        </IonItem>)}
                        {selectedHolderType === 'friendtech' && <>
                            {uniq(holding?.users || []).map((holder) =>
                                <FriendTechPortfolioChip key={holder.address} address={holder.address} name={holder.twitterName} pfp={holder.twitterPfpUrl} />
                            )}
                        </>}

                    </IonCardContent>
                </IonCard>


                {!user && loading === false && <IonTitle color='warning'>NOT AUTHENTICATED</IonTitle>}
            </TribeContent >
            <IonFooter>
                {balance && balance > 0n ? <IonButton fill='solid' color='tertiary' expand='full' routerLink={'/room/' + address}>
                    <IonText>
                        Chat
                    </IonText>
                    <IonIcon icon={chatboxEllipsesOutline} />
                </IonButton> : <></>}

                {/* {user?.wallet?.address === address && <IonButton expand='full' onClick={() => {
                    logout()
                }}>
                    Logout
                </IonButton>} */}

            </IonFooter>
        </IonPage >

    );
};

export default Member;
