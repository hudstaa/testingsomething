import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';
import { TribePage } from './TribePage';
import { TribeHeader } from '../components/TribeHeader';

const Splash: React.FC = () => {
    return (
        <TribePage page='splash'>
            <TribeHeader />
            <TribeContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tribe</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ExploreContainer name="Welcome to Tribe" />
            </TribeContent>
        </TribePage>
    );
};

export default Splash;
