import { IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonList, IonListHeader, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Member, useMember } from '../hooks/useMember';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { gql, useQuery } from '@apollo/client';
import { usePrivy } from '@privy-io/react-auth';
import usePassBalance from '../hooks/usePassBalance';
import usePassesBalance from '../hooks/useBoosters';
import { Address, formatUnits } from 'viem';
import { MemberCardHeader, MemberChip, MemberPfp, MemberToolbar } from '../components/MemberBadge';
import { TribeFooter } from '../components/TribeFooter';
import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../App';
import { TribePage } from './TribePage';


const myChatsQuery = gql`
query MyQuery($hash:String!) {
    transferSingles(to:$address) {
    from
    to
  }
}
`
const Chat: React.FC = () => {
    const { user } = usePrivy()
    const [members, setMembers] = useState<[{ address: string }]>()
    useEffect(() => {
        const address = user?.wallet?.address;

        if (typeof address === 'undefined') {
            return;
        }
        const channelsRef = collection(getFirestore(app), "channel");
        const q = query(channelsRef, where(`holders.${address}`, '>', 0));
        getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
                    setMembers(result as any);
                }
            })
            .catch(error => {
                setMembers([] as any)
            });
    }, [user])
    return (
        <TribePage page='chat'>
            <TribeHeader title='Chat' />
            <IonContent >
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd='6' offsetMd='3' sizeXs='12' >

                            {useMemo(() => members && members !== null ? members.map(({ address, }, i) =>
                                <IonItem color='light' lines='none' routerLink={'/room/' + address}>
                                    <MemberCardHeader address={address} />
                                </IonItem>) : <IonSpinner />, [members])}
                        </IonCol></IonRow>
                </IonGrid>
            </IonContent>
            <TribeFooter page='chat' />
        </TribePage >
    );
};

export default Chat;

