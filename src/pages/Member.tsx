import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonList, IonListHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useParams } from 'react-router';
import { useClient, useConversations, useStartConversation, useCanMessage } from '@xmtp/react-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { chatboxEllipsesOutline, logoTwitter, ticketOutline } from 'ionicons/icons';
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
import { useEffect } from 'react';
import { useTitle } from '../hooks/useTitle';
import { TribeHeader } from '../components/TribeHeader';
import { formatEth } from '../lib/sugar';

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
    const { setTitle } = useTitle();
    useEffect(() => {
        member ? setTitle(member.twitterName) : setTitle(address.slice(0, 5) + '...' + address.slice(38, 42))
    }, [member, address])

    return (
        <IonPage>
            <TribeHeader title={member?.twitterName || address} />
            <TribeContent fullscreen>
                <IonList>
                    <IonToolbar>
                        <IonListHeader>
                            {member?.twitterName || address}
                        </IonListHeader>
                        {user && <IonChip>
                            <IonIcon icon={ticketOutline} />
                            <IonText>
                                You Own (
                                {typeof balance != 'undefined' && formatUnits(balance, 0)}/{typeof supply != 'undefined' && formatUnits(supply, 0)}) Passes
                            </IonText>
                        </IonChip>}

                    </IonToolbar>
                    <MemberGraph address={address} />
                    <IonItem lines='none'>
                        <IonButtons slot='start'>

                            <IonButton fill='solid' disabled={typeof sellPass === 'undefined' || sellStatus === 'transacting'} color={'danger'} onClick={() => {
                                sellPass && sellPass();
                            }}>

                                <IonIcon icon={ticketOutline} />
                                <IonText>

                                    Sell                      {typeof sellPrice !== 'undefined' && formatEth(sellPrice as bigint)}
                                </IonText>
                            </IonButton>
                        </IonButtons>
                        <IonButtons slot='end'>

                            <IonButton fill='solid' disabled={typeof buyPass === 'undefined' || buyStatus === 'transacting'} onClick={() => {
                                // sendTransaction({ chainId: baseGoerli.id, value: 100n, to:})
                                buyPass && buyPass();
                                console.log(buyPass);
                            }} color='success'>
                                <IonIcon icon={ticketOutline} />                                Buy
                                {typeof buyPrice !== 'undefined' && formatEth(buyPrice as bigint)}
                            </IonButton>
                        </IonButtons>
                    </IonItem>

                    {balance && balance > 0n ? <IonButton color='light' expand='full' routerLink={'/room/' + address}>
                        <IonText>
                            Chat
                        </IonText>
                        <IonIcon icon={chatboxEllipsesOutline} />
                    </IonButton> : <></>}
                </IonList>

                {!user && loading === false && <IonText color='warning'>user not found</IonText>}
            </TribeContent >
            <IonFooter>
                {user?.wallet?.address === address && <IonButton onClick={() => {
                    logout()
                }}>
                    Logout
                </IonButton>}

            </IonFooter>
        </IonPage>

    );
};

export default Member;
