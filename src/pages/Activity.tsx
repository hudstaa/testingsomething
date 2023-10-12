import { IonAvatar, IonBadge, IonCard, IonCardContent, IonCardHeader, IonHeader, IonImg, IonItem, IonPage, IonProgressBar, IonSegment, IonSegmentButton, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useMember } from '../hooks/useMember';
import { useWatchlist } from '../hooks/useWatchlist';
import { TradeItem } from '../components/TradeItem';
import { useActivity } from '../hooks/useActivity';
import { gql, useQuery } from '@apollo/client';
import { Trade } from '../models/Trade';
import { TribeContent } from '../components/TribeContent';
import { useEffect } from 'react';
import { useTitle } from '../hooks/useTitle';
import { TribeHeader } from '../components/TribeHeader';


const activityQuery = gql`
query MyQuery {
    trades(first: 1000,orderBy: blockTimestamp, orderDirection: desc) {
      ethAmount
      isBuy
      protocolEthAmount
      referralEthAmount
      referrer
      subject
      supply
      subjectEthAmount
      tokenAmount
      trader
      transactionHash
      blockTimestamp
    }
  }
`




const Activity: React.FC = () => {
    const activity = useActivity(x => x.activity())
    const { data, loading } = useQuery<{ trades: Trade[] }>(activityQuery, { pollInterval: 1000 })
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle('activity')
    }, [])

    return (
        <IonPage>
            <TribeHeader title={'Activity'} />
            <TribeContent fullscreen>
                {!loading ? data?.trades?.map((trade, i) => <TradeItem trade={trade} key={trade.transactionHash} />) : <IonProgressBar type='indeterminate' />}
            </TribeContent >
        </IonPage>
    );
};

export default Activity;
