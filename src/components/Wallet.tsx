import { IonButtons, IonCard, IonIcon, IonItem, IonText, IonToast } from '@ionic/react';
import type { WalletWithMetadata } from '@privy-io/react-auth';
import { copy } from 'ionicons/icons';
import { formatEth } from '../lib/sugar';
import { useState } from 'react';
import { useMember } from '../hooks/useMember';
import { useBalance } from 'wagmi';
export const Wallet: React.FC = () => {
    const [showToast, setShowToast] = useState<boolean>(false);
    const me = useMember(x => x.getCurrentUser());
    const { data: ethBalance } = useBalance({ address: me?.address as any, watch: true })

    return <IonCard>
        {me && <IonItem color='paper' lines='none' detail={false} href='javascript:void(0)' onClick={() => {
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
                {me.address.slice(0, 10) + '...'}
            </IonText>

            <IonButtons slot='end'>
                <IonText color='primary'>
                    {ethBalance ? formatEth(ethBalance.value) : <></>}
                </IonText>
            </IonButtons>
        </IonItem>}
    </IonCard>
}