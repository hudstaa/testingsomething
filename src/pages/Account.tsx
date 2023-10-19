import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonChip, IonCol, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useDiscover } from '../hooks/useDiscover';
import { Trade } from '../models/Trade';
import { useMember } from '../hooks/useMember';
import { TradeItem } from '../components/TradeItem'
import { StatItem } from '../components/StatItem';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { MemberBadge, MemberPfp, MemberToolbar } from '../components/MemberBadge';
import useBuyPass from '../hooks/useBuyPass';
import { Address, formatEther } from 'viem';
import { useEffect, useState } from 'react';
import { useTitle } from '../hooks/useTitle';
import { albums, albumsOutline, chatbox, chatboxOutline, exit, personOutline } from 'ionicons/icons';
import { getAuth, signOut } from 'firebase/auth';
import { usePrivy } from '@privy-io/react-auth';
import { TribePage } from './TribePage';
import { TribeFooter } from '../components/TribeFooter';
import PfpUploader from '../components/UploadComponent';



const Account: React.FC = () => {
    const auth = getAuth()
    const { logout } = usePrivy();
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid))
    return (
        <TribePage>
            <TribeHeader title='Account' />
            <TribeContent >
                <IonGrid>
                    <IonRow>
                        <IonCol offsetMd='2' sizeMd='8' sizeXs='12'>
                            <IonCard color='light'>
                                <IonCardHeader color='tertiary'>
                                    <IonTitle > {me?.twitterName}</IonTitle>
                                </IonCardHeader>
                                <IonCardContent color='light'>
                                    <IonList>

                                        <MemberToolbar address={me?.address || ""} />

                                        <IonItem color='light'>

                                            <IonButton fill='solid' routerLink={'/'} onClick={() => {
                                            }} color='primary'>Post
                                                <IonIcon icon={albumsOutline} />

                                            </IonButton>
                                            <IonButton fill='solid' routerLink={'/room/' + me?.address} onClick={() => {
                                            }} color='tertiary'>Chat
                                                <IonIcon icon={chatboxOutline} />
                                            </IonButton>
                                            <IonButton fill='solid' routerLink={'/member/' + me?.address} onClick={() => {
                                            }} color='success'>Profile
                                                <IonIcon icon={personOutline} />
                                            </IonButton>

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
