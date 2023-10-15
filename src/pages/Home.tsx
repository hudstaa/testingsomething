import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';
import { TribePage } from './TribePage';

const Home: React.FC = () => {
  return (
    <TribePage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <TribeContent fullscreen>
        <ExploreContainer name="Home" />
      </TribeContent>
    </TribePage>
  );
};

export default Home;
