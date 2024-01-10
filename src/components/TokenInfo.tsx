

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
      large: string;
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
      <IonCard style={{margin: 0, backgroundColor: 'var(--ion-color-tabblur)'}}>
        <IonCardHeader style={{padding: '16px'}} >  
            <IonCardTitle className='medium'  color={'dark'} style={{fontSize: '1.15rem', letterSpacing: '.0115em'}}>{tokenData.name} </IonCardTitle> 
            {/* ({tokenData.symbol.toUpperCase()}) */}
            <IonCardSubtitle color={'dark'} className='bold' style={{ fontSize: '1.25rem'}}>${tokenData.market_data.current_price.usd}</IonCardSubtitle>
            <div style={{paddingBottom: 12, paddingTop: 0}}><img style={{borderRadius: '100%', width: '36px', height: '36px', boxShadow: '0px 2px 15px rgba(0, 0, 0, .1)'}} src={tokenData.image.large} alt={tokenData.name} /></div>
        </IonCardHeader>
        <IonCardContent>
        <div style={{maxHeight: '500px', marginTop: '0%'}}>
           <TokenGraph contractId={contractId} chainName={chainName} />
        </div>
        {content && onGetToken && (
          <div style={{backgroundColor: '#FF6000', borderRadius: '100px', marginBottom: '7.5%', boxShadow: '0px 2px 15px rgba(0, 0, 0, .1)'}}>
            <IonButton style={{'--color': 'var(--ion-color-primary)'}} fill='clear' expand="full" size={'small'} onClick={onGetToken}>
              <span className='heavy' style={{fontSize: '1.15rem', padding: 8}}>Get {content}</span> 
            </IonButton>
          </div>
        )}
        <div style={{display: 'flex', marginBottom: '7.5%', color: 'var(--ion-color-dark)', opacity: 0.65}}>
          <div> 
            <p className='semi' style={{opacity: 0.75}}>24h volume:</p>
             <span className='bold'>${tokenData.market_data.total_volume.usd}</span></div>
          <div style={{marginLeft: '1rem', color: 'var(--ion-color-dark)'}}> 
            <p className='semi' style={{opacity: 0.75}}>Market Cap:</p>
            <span className='bold'>${tokenData.market_data.market_cap.usd}</span></div>
          </div>
        <div>
         <div style={{marginBottom: '6.5%'}}>
            <span className='heavy' style={{fontSize: '1rem', color: 'var(--ion-color-dark)', opacity: 0.75}}>About {content}</span> 
            <p className="regular" style={{marginTop: '2.5%', color: 'var(--ion-color-dark)', opacity: 0.5, fontSize: '1rem'}} >{tokenData.description.en}</p>
          </div>
        <div style={{display: 'flex', marginBottom: '5%'}}>
            <div style={{backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.homepage.map(url => url && <a className='bold' href={url} target="_blank" rel="noopener noreferrer">Website</a>)}
            </div>
            <div style={{marginLeft: '.5rem', backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.blockchain_site.filter(url => url.includes('etherscan.io')).map(url => url && <a className='bold' href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>)}
            </div>            
            <div style={{marginLeft: '.5rem', backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.twitter_screen_name && <a className='bold' href={`https://twitter.com/${tokenData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
        </div>
        </div>
        </IonCardContent>
      </IonCard>
    );
  };
  
  export default TokenInfo;