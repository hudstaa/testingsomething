import { IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonHeader, IonImg, IonItem, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useChat } from '../hooks/useChat';
import { useMember } from '../hooks/useMember';
import { useWatchlist } from '../hooks/useWatchlist';
import { TradeItem } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';

const Watchlist: React.FC = () => {
  const activity = useWatchlist(x => x.activity())
  const watching = useWatchlist(x => x.watching())
  const { getFriend } = useMember();
  return (
    <TribeContent fullscreen>
      <IonListHeader>
        Watching:
      </IonListHeader>
      <IonList>
        {activity.map((trade, i) => <TradeItem trade={trade} key={trade.transactionHash} />)}
      </IonList>
    </TribeContent >
  );
};

export default Watchlist;
