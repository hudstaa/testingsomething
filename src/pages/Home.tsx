import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { TribeContent } from '../components/TribeContent';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <TribeContent fullscreen>
        <ExploreContainer name="Home" />
      </TribeContent>
    </IonPage>
  );
};

export default Home;
