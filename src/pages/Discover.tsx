import { IonAvatar, IonBadge, IonButtons, IonCard, IonCol, IonGrid, IonHeader, IonImg, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useDiscover } from '../hooks/useDiscover';
import { Trade } from '../models/Trade';
import { useMember } from '../hooks/useMember';
import { TradeItem } from '../components/TradeItem'
import { StatItem } from '../components/StatItem';
import { TribeHeader } from '../components/TribeHeader';
import { TribeContent } from '../components/TribeContent';
import { MemberBadge } from '../components/MemberBadge';
import useBuyPass from '../hooks/useBuyPass';
import { Address, formatEther } from 'viem';
import { useEffect } from 'react';
import { useTitle } from '../hooks/useTitle';
import { personOutline } from 'ionicons/icons';


const BuyPriceBadge: React.FC<{ address: string | undefined }> = ({ address }) => {
  const { buyPrice } = useBuyPass(address as Address, 1n);
  return <IonBadge>
    {formatEther(buyPrice)}
  </IonBadge>
}

const Discover: React.FC = () => {
  const discoverStats = useDiscover(x => x.stats());
  const members = useMember(x => x.friendCache)
  const { loadCache } = useMember()
  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle('discover')
    loadCache();
  }, [])
  return (
    <IonPage>
      <TribeHeader title='Discover' />
      <TribeContent >
        <IonList>
          {Object.values(members).map((member) => <IonItem routerLink={'/member/' + member?.address}>
            <IonAvatar>
              <IonImg src={member?.twitterPfp || personOutline} />
            </IonAvatar>
            <IonTitle>

              <IonText>
                {member?.twitterName}
              </IonText>
            </IonTitle>
            <IonButtons slot='end'><BuyPriceBadge address={member?.address} /></IonButtons>
          </IonItem>)}
        </IonList>
      </TribeContent>
    </IonPage>

  );
};

export default Discover;
