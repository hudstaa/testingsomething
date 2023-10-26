import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonIcon, IonItem, IonList, IonRow, IonTitle } from '@ionic/react';
import { usePrivy } from '@privy-io/react-auth';
import { signOut } from 'firebase/auth';
import { albumsOutline, chatboxOutline, exit, personOutline } from 'ionicons/icons';
import { MemberToolbar } from '../components/MemberBadge';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useMember } from '../hooks/useMember';
import { nativeAuth } from '../lib/sugar';
import { TribePage } from './TribePage';



const Account: React.FC = () => {
    const auth = nativeAuth()
    const { logout } = usePrivy();
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));
    return (
        <TribePage page='account'>
            <TribeHeader title='Account' color='tertiary' />
            <TribeContent >
                <IonGrid>
                    <IonRow>
                        <IonCol offsetMd='2' sizeMd='8' sizeXs='12'>
                            <IonCard color='light'>
                                <IonCardHeader color='light'>
                                    <IonTitle  > {me?.twitterName}</IonTitle>
                                </IonCardHeader>
                                <IonCardContent >
                                    <IonList>
                                        <MemberToolbar address={me?.address || ""} />

                                        <IonItem color='light' lines='none'>
                                            <IonButton fill='solid' routerLink={'/chat/' + me?.address} onClick={() => {
                                            }} color='primary'>Chat
                                                <IonIcon icon={chatboxOutline} />
                                            </IonButton>
                                            <IonButton routerLink={'/member/' + me?.address} onClick={() => {
                                            }} color='tertiary'>Profile
                                                <IonIcon icon={personOutline} />
                                            </IonButton>
                                            <IonButton fill='solid' routerLink={'/posts'} onClick={() => {
                                            }} color='success'>Post
                                                <IonIcon icon={albumsOutline} />

                                            </IonButton>
                                        </IonItem>

                                        <IonItem color='light' lines='none'>
                                            <IonButtons slot='end'>
                                                <IonButton fill='outline' onClick={() => {
                                                    signOut(auth); logout();
                                                }} color='danger'>Logout
                                                    <IonIcon icon={exit} />
                                                </IonButton>
                                            </IonButtons>
                                        </IonItem>
                                    </IonList>

                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </TribeContent>
            <TribeFooter page='account' />
        </TribePage>

    );
};

export default Account;
