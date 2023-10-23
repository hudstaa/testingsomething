import { IonList, IonListHeader } from '@ionic/react';
import { TradeItem } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { useMember } from '../hooks/useMember';
import { useWatchlist } from '../hooks/useWatchlist';

const Watchlist: React.FC = () => {
  const activity = useWatchlist(x => x.activity())
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
