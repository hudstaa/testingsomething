import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';
import { TribePage } from './TribePage';

const Token: React.FC = () => {
    return (
        <TribePage page='token'>
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
        </TribePage>
    );
};

export default Token;
