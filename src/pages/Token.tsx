import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';

const Token: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Discover</IonTitle>
                </IonToolbar>
            </IonHeader>
            <TribeContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Discover</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer name="Discover" />
            </TribeContent>
        </IonPage>
    );
};

export default Token;
