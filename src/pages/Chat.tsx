import { IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonItem, IonList, IonListHeader, IonPage, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Member, useMember } from '../hooks/useMember';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { gql, useQuery } from '@apollo/client';
import { usePrivy } from '@privy-io/react-auth';
import usePassBalance from '../hooks/usePassBalance';
import usePassesBalance from '../hooks/useBoosters';
import { Address, formatUnits } from 'viem';
import { MemberChip, MemberPfp, MemberToolbar } from '../components/MemberBadge';
import { TribeFooter } from '../components/TribeFooter';
import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import db from '../lib/db';
import { app } from '../App';


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
        if (typeof user?.wallet?.address === 'undefined') {
            return;
        }
        const address = user?.wallet?.address;
        const channelsRef = collection(getFirestore(app), "channel");
        const q = query(channelsRef, where(`holders.${address}`, '>', 0));
        getDocs(q)
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
                    console.log(result, "RESULT");
                    setMembers(result as any);
                }
            })
            .catch(error => {
                setMembers([] as any)
                console.log("HELLO")
                console.log("Error getting documents: ", error);
            });
    }, [user])
    return (
        <IonPage>
            <TribeHeader title='Chat' />
            <IonContent>
                <IonList>
                    {useMemo(() => members && members !== null ? members.map(({ address, }, i) =>
                        <IonItem lines='none' routerLink={'/room/' + address}>
                            <MemberToolbar address={address} />
                        </IonItem>) : <IonSpinner />, [members])}
                </IonList>
            </IonContent>
            <TribeFooter page='chat' />
        </IonPage >
    );
};

export default Chat;

