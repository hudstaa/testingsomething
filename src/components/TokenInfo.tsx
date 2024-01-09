

import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { TokenGraph } from './TokenGraph'
import { usePriceContext } from '../hooks/PriceContext';
interface TokenInfoProps {
    id: string;
    contractId: string;
    chainName: string;
  }

interface TokenData {
    name: string;
    symbol: string;
    description: {
      en: string; // Assuming you're interested in the English description
      // Add other languages if needed
    };
    market_data: {
      current_price: {
        usd: number;
      };
      market_cap: {
        usd: number;
      };
    };
    image: {
      small: string;
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
        twitter_screen_name: string;
        telegram_channel_identifier: string;
        subreddit_url: string;
      };
  }
  
  export const TokenInfo: React.FC<TokenInfoProps> = ({ id, contractId, chainName }) => {
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const { price } = usePriceContext(); 

    useEffect(() => {
      const fetchTokenData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true`);
        const data = await response.json();
        setTokenData(data);
      };
  
      fetchTokenData();
    }, [id]);
  
    if (!tokenData) return <p>Loading...</p>;
  
    return (
      <IonCard style={{margin: 0}}>

        <IonCardHeader style={{padding: '12px'}} >  
            <IonCardTitle className='heavy'>{tokenData.name} </IonCardTitle> 
            {/* ({tokenData.symbol.toUpperCase()}) */}
            <IonCardSubtitle>${price || tokenData.market_data.current_price.usd}</IonCardSubtitle>
            <div><img style={{borderRadius: '100%'}} src={tokenData.image.small} alt={tokenData.name} /></div>
        </IonCardHeader>
        <IonCardContent>
            <div>
        <TokenGraph contractId={contractId} chainName={chainName} />
        </div>
        <div style={{marginTop: '-10vh'}}>
          <p>{tokenData.description.en}</p>
          <p>Market Cap: ${tokenData.market_data.market_cap.usd}</p>
          <p>Useful Links:</p>
        <ul>
          {tokenData.links.homepage.map(url => url && <li><a href={url} target="_blank" rel="noopener noreferrer">Website</a></li>)}
          {tokenData.links.blockchain_site.filter(url => url.includes('etherscan.io')).map(url => url && <li><a href={url} target="_blank" rel="noopener noreferrer">Etherscan</a></li>)}
          {tokenData.links.twitter_screen_name && <li><a href={`https://twitter.com/${tokenData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">Twitter</a></li>}
          {tokenData.links.subreddit_url && <li><a href={tokenData.links.subreddit_url} target="_blank" rel="noopener noreferrer">Reddit</a></li>}
        </ul>
        </div>
        </IonCardContent>
      </IonCard>
    );
  };
  
  export default TokenInfo;