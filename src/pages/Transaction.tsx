import { IonHeader, IonPage, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useQuery } from '@apollo/client';
import { TradeItem } from '../components/TradeItem';
import { Trade } from '../models/Trade';
import { gql } from '@apollo/client';
import { useParams } from 'react-router';
import { TribeContent } from '../components/TribeContent';
import { MemberBadge } from '../components/MemberBadge';
import { TribeHeader } from '../components/TribeHeader';
import { TribePage } from './TribePage';


const transactionQuery = gql`
query MyQuery($hash:String!) {
    trade(id:$hash) {
      id
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
const Transaction: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const { data, loading, error } = useQuery<{ trade: Trade }>(transactionQuery, { variables: { hash: hash.toLowerCase() + "01000000" } });
  console.log(data, hash);
  return (
    <TribePage page='transaction'>
      <TribeHeader title='tx' />
      <TribeContent fullscreen>
        {loading && <IonSpinner />}
        {data?.trade && <TradeItem trade={data?.trade} />}
        {error && <IonText>{error.message}</IonText>}
      </TribeContent>
    </TribePage>

  );
};

export default Transaction;
