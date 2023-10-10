import { IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { gql, useQuery } from '@apollo/client';
import { usePrivy } from '@privy-io/react-auth';
import usePassBalance from '../hooks/usePassBalance';
import usePassesBalance from '../hooks/usePassesBalance';
import { Address, formatUnits } from 'viem';
import { MemberBadge, MemberChip } from '../components/MemberBadge';
import { ticketOutline } from 'ionicons/icons';
import { useTitle } from '../hooks/useTitle';
import { useEffect } from 'react';
import { WriteMessage } from './Room';


const myPassesQuery = gql`
query MyQuery($hash:String!) {
    transferSingles(to:$address) {
    from
    to
  }
}
`
const Chat: React.FC = () => {
    const get = useMember(x => x.getFriend);
    const cache = useMember(x => x.friendCache);
    const { user } = usePrivy()
    const address = user?.wallet?.address;
    const { data } = useQuery(myPassesQuery, { variables: { address } });
    const accounts = Object.keys(cache);
    const balances: bigint[] = usePassesBalance(address as Address, accounts as Address[]) as bigint[]
    const { setTitle } = useTitle();
    return (
        <IonPage>
            <TribeHeader title='Tribes' />
            <IonContent>
                <IonList>
                    {accounts.map((account, i) => balances && balances[i] > 0n ? <IonItem lines='none' routerLink={'/room/' + account}>
                        <MemberChip address={account} />
                        <IonButtons slot='end'>
                            <IonChip>
                                {balances && formatUnits(balances[i], 0)} <IonIcon icon={ticketOutline} />
                            </IonChip>
                        </IonButtons>
                    </IonItem> : <></>)}
                </IonList>
            </IonContent>
        </IonPage >
    );
};

export default Chat;

