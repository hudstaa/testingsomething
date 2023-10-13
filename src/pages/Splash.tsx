import { IonButton, IonCol, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';
import { chatboxEllipsesOutline, flagOutline, homeOutline, journalOutline, leafSharp, manOutline, pulseOutline } from 'ionicons/icons';
import { TribeHeader } from '../components/TribeHeader';

const Splash: React.FC = () => {
    return (
        <IonPage>

            <TribeHeader color='success' title={'TRIBE'} />
            <TribeContent fullscreen>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonButton style={{ height: 200 }} size='large' expand='full' color='light' routerLink='/activity'>
                                <IonText color='danger'>
                                    Activity <IonIcon icon={pulseOutline} />
                                </IonText>
                            </IonButton>
                        </IonCol>
                        <IonCol>

                            <IonButton style={{ height: 200 }} size='large' expand='full' color='light' routerLink='/discover'>
                                <IonText color='success'>
                                    Discover <IonIcon icon={leafSharp} />
                                </IonText>
                            </IonButton>
                        </IonCol>
                        <IonCol>

                            <IonButton style={{ height: 200 }} size='large' expand='full' color='light' routerLink='/chat'>
                                <IonText color='primary'>

                                    Chat <IonIcon icon={chatboxEllipsesOutline} />
                                </IonText>
                            </IonButton>
                        </IonCol>
                        {/* <IonCol>
                            <IonButton style={{ height: 200 }} size='large' expand='full' color='light' routerLink='/onboarding'>
                                <IonText color='primary'>

                                    Join <IonIcon icon={manOutline} />
                                </IonText>
                            </IonButton>
                        </IonCol> */}
                    </IonRow>
                    <IonRow>
                    </IonRow>

                </IonGrid>
            </TribeContent>
        </IonPage >
    );
};

export default Splash;
