

import React, { useState, useEffect } from 'react';
import { IonCard, IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { TokenGraph } from './TokenGraph'

interface TokenInfoProps {
  id: string;
  contractId: string;
  chainName: string;
  content?: string; // Add this line
  onGetToken?: () => void; // Add this line
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
      total_volume: {
        usd: number;
      }
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
  
  export const TokenInfo: React.FC<TokenInfoProps> = ({ id, contractId, content, chainName, onGetToken }) => {
    const [tokenData, setTokenData] = useState<TokenData | null>(null);


    useEffect(() => {
      const fetchTokenData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?tickers=true&market_data=true&community_data=true&developer_data=true`);
        const data = await response.json();
        setTokenData(data);
      };
  
      fetchTokenData();
    }, [id]);
  
    if (!tokenData) return <p>Loading...</p>;
    
    const formattedPrice = tokenData.market_data.current_price.usd.toPrecision(6);

    return (
      <IonCard style={{margin: 0}}>

        <IonCardHeader style={{padding: '12px'}} >  
            <IonCardTitle className='heavy' style={{fontSize: '1.5rem'}}>{tokenData.name} </IonCardTitle> 
            {/* ({tokenData.symbol.toUpperCase()}) */}
            <IonCardSubtitle color={'dark'} className='black' style={{ fontSize: '2rem'}}>${tokenData.market_data.current_price.usd}</IonCardSubtitle>
            <div style={{paddingBottom: 8}}><img style={{borderRadius: '100%'}} src={tokenData.image.small} alt={tokenData.name} /></div>
        </IonCardHeader>
        <IonCardContent>
        <div style={{maxHeight: '500px', marginTop: '10%'}}>
           <TokenGraph contractId={contractId} chainName={chainName} />
        </div>
        {content && onGetToken && (
          <div style={{backgroundColor: '#FF6000', borderRadius: '100px', marginBottom: '5%'}}>
            <IonButton fill='clear' expand="full" size={'small'} onClick={onGetToken}>
              <span className='bold' style={{fontSize: '1.25rem', padding: 10}}>Get {content}</span> 
            </IonButton>
          </div>
        )}
        <div style={{display: 'flex', marginBottom: '4%', color: 'var(--ion-color-dark)', opacity: 0.7}}>
          <div> 
            <p>24h volume:</p>
             ${tokenData.market_data.total_volume.usd}</div>
          <div style={{marginLeft: '1rem', color: 'var(--ion-color-dark)'}}> 
            <p>Market Cap:</p>
            ${tokenData.market_data.market_cap.usd}</div>
          </div>
        <div>
         <div style={{marginBottom: '5%'}}>
            <span className='bold' style={{fontSize: '1rem', color: 'var(--ion-color-dark)'}}>About {content}</span> 
            <p style={{marginTop: '1.125%', color: 'var(--ion-color-dark)', opacity: 0.7}} >{tokenData.description.en}</p>
          </div>
        <div>
            {tokenData.links.homepage.map(url => url && <a className='bold' href={url} target="_blank" rel="noopener noreferrer">Website</a>)}
            {tokenData.links.blockchain_site.filter(url => url.includes('etherscan.io')).map(url => url && <a className='bold' style={{marginLeft: '1rem'}} href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>)}
            {tokenData.links.twitter_screen_name && <a className='bold' style={{marginLeft: '1rem'}} href={`https://twitter.com/${tokenData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">Twitter</a>}
            {tokenData.links.subreddit_url && <a className='bold' style={{marginLeft: '1rem'}} href={tokenData.links.subreddit_url} target="_blank" rel="noopener noreferrer">Reddit</a>}
        </div>
        </div>
        </IonCardContent>
      </IonCard>
    );
  };
  
  export default TokenInfo;