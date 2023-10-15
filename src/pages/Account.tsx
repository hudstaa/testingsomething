import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonGrid, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useDiscover } from '../hooks/useDiscover';
import { Trade } from '../models/Trade';
import { useMember } from '../hooks/useMember';
import { TradeItem } from '../components/TradeItem'
import { StatItem } from '../components/StatItem';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { MemberBadge, MemberPfp } from '../components/MemberBadge';
import useBuyPass from '../hooks/useBuyPass';
import { Address, formatEther } from 'viem';
import { useEffect, useState } from 'react';
import { useTitle } from '../hooks/useTitle';
import { personOutline } from 'ionicons/icons';
import { getAuth, signOut } from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import { TribePage } from './TribePage';



const Account: React.FC = () => {
    const auth = getAuth()
    const { logout } = usePrivy();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid))
    const [messageType, setMessageType] = useState("friendTech");
    return (
        <TribePage>
            <TribeHeader title='Account' />
            <TribeContent >
                <IonGrid>
                    <IonRow>
                        <IonCol size='6' sizeXs='12'>
                            <IonCard>

                                <IonCardHeader color='tertiary'>
                                    <IonTitle > {me?.twitterName}</IonTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonItem >
                                    </IonItem>
                                    <IonItem>
                                        <IonButtons slot='start'>

                                            <IonText color='tertiary'>
                                                Message Style
                                            </IonText>
                                        </IonButtons>
                                        <IonSegment value={messageType}>
                                            <IonSegmentButton color='tertiary' value={'tribe'} onClick={() => { setMessageType('friendTech') }} >
                                                Twitter
                                            </IonSegmentButton>
                                            <IonSegmentButton value={'friendtech'} onClick={() => { setMessageType('twitter') }} >
                                                Friend Tech
                                            </IonSegmentButton>
                                        </IonSegment>
                                    </IonItem>

                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonButton onClick={() => {
                            signOut(auth); logout();
                        }} expand='full' color='danger'>Logout</IonButton>
                    </IonRow>

                </IonGrid>

            </TribeContent>
        </TribePage>

    );
};

export default Account;
