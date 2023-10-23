import { gql, useQuery } from '@apollo/client';
import { IonCol, IonGrid, IonProgressBar, IonRow } from '@ionic/react';
import { useEffect } from 'react';
import { TradeItem } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import { useTitle } from '../hooks/useTitle';
import { Trade } from '../models/Trade';
import { TribePage } from './TribePage';


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
    const { data, loading } = useQuery<{ trades: Trade[] }>(activityQuery, { pollInterval: 2000 })
    const { setTitle } = useTitle();
    useEffect(() => {
        setTitle('activity')
    }, [])

    return (
        <TribePage page='activity' >
            <TribeHeader title={'Activity'} color='danger' />
            <TribeContent>
                {!loading ? data?.trades?.map((trade, i) => <TradeItem trade={trade} key={trade.transactionHash} />) : <IonProgressBar type='indeterminate' />}
            </TribeContent >
            <TribeFooter page='activity' />
        </TribePage>
    );
};

export default Activity;
