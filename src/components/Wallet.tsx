import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonIcon, IonItem, IonText, IonToast } from '@ionic/react';
import type { WalletWithMetadata } from '@privy-io/react-auth';
import { copy } from 'ionicons/icons';
import { formatEth } from '../lib/sugar';
import { useState } from 'react';
import { useMember } from '../hooks/useMember';
import { useBalance } from 'wagmi';
import QRCode from 'qrcode.react';

// Define a TypeScript interface for props
interface ETHQrCodeProps {
    ethAddress: string;
    amount: string;
}

const ETHQrCode: React.FC<ETHQrCodeProps> = ({ ethAddress, amount }) => {
    // Construct the Ethereum URI scheme
    const ethUri = `ethereum:${ethAddress}?amount=${amount}`;

    return (
        <IonCard>
            <IonCardHeader>Send ETH</IonCardHeader>
            <IonCardContent>

                <QRCode value={ethUri} />
                <p>Scan to send {amount} ETH to Your Tribe Wallet</p>
            </IonCardContent>
        </IonCard>
    );
};

export default ETHQrCode;
export const Wallet: React.FC = () => {
    const [showToast, setShowToast] = useState<boolean>(false);
    const me = useMember(x => x.getCurrentUser());
    const { data: ethBalance } = useBalance({ address: me?.address as any, watch: true })
    const [showReceive, setShowReceive] = useState<boolean>(false);
    return <IonContent color='black' className='ion-text-center ion-justify-center'>    <IonCard>
        {me && <IonItem color='paper' lines='none' detail={false} onClick={() => {
            navigator.clipboard.writeText(me!.address);
            setShowToast(true);
        }}>
            <IonButtons slot='start'>
                <IonIcon icon={copy} />
            </IonButtons>
            <IonToast
                position='top'
                isOpen={showToast}
                message="Copied address to clipboard"
                onDidDismiss={() => setShowToast(false)}
                duration={5000}
            ></IonToast>
            <IonText className='regular'>
                {me.address}
            </IonText>

            <IonButtons slot='end'>
                <IonText color='primary'>
                    {ethBalance ? formatEth(ethBalance.value) : <></>}
                </IonText>
            </IonButtons>
        </IonItem>}
    </IonCard>
        {me && <ETHQrCode amount='1' ethAddress={me!.address} />}
    </IonContent>
}