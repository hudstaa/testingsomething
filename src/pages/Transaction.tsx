import { gql, useQuery } from '@apollo/client';
import { IonSpinner, IonText } from '@ionic/react';
import { useParams } from 'react-router';
import { TradeItem } from '../components/TradeItem';
import { TribeContent } from '../components/TribeContent';
import { TribeHeader } from '../components/TribeHeader';
import { Trade } from '../models/Trade';
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
