import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonItem, IonPage, IonToast, IonToolbar } from "@ionic/react"
import { getApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import TokenGraph from "../components/TokenGraph"

export const Coin: React.FC = () => {

    const { id } = useParams<{ id: string }>()
    const [tokenData, setInfo] = useState<any>()
    useEffect(() => {
        getDoc(doc(getFirestore(getApp()), 'coin/' + id)).then((doc) => {
            console.log()
            setInfo(doc.data());
        });
    }, [id])
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                {tokenData && tokenData.name}
            </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonCard style={{margin: 0, backgroundColor: 'var(--ion-color-light-shade)'}}>
        <IonCardHeader style={{padding: '16px'}} >  
            <IonCardTitle className='medium'  color={'dark'} style={{fontSize: '1.35rem', letterSpacing: '.0115em'}}>{tokenData.name} </IonCardTitle> 
            {/* ({tokenData.symbol.toUpperCase()}) */}
            <IonCardSubtitle color={'dark'} className='bold' style={{ fontSize: '1.5rem'}}>${tokenData.market_data.current_price.usd}</IonCardSubtitle>
            <div style={{paddingBottom: 8, paddingTop: 0}}><img style={{borderRadius: '100%', width: '40px', height: '40px', boxShadow: '0px 2px 15px rgba(0, 0, 0, .1)'}} src={tokenData.image.large} alt={tokenData.name} /></div>
        </IonCardHeader>
        <IonCardContent>
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
            <span className='heavy' style={{fontSize: '1rem', color: 'var(--ion-color-dark)', opacity: 0.75}}>About {id}</span> 
            <p className="regular" style={{marginTop: '2.5%', color: 'var(--ion-color-dark)', opacity: 0.5, fontSize: '1rem'}} >{tokenData.description.en}</p>
          </div>
        <div style={{display: 'flex', marginBottom: '5%'}}>
            <div style={{backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.homepage.map((url:any) => url && <a className='bold' href={url} target="_blank" rel="noopener noreferrer">Website</a>)}
            </div>
            <div style={{marginLeft: '.5rem', backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.blockchain_site.filter((url:any) => url.includes('etherscan.io')).map((url:any) => url && <a className='bold' href={url} target="_blank" rel="noopener noreferrer">Etherscan</a>)}
            </div>            
            <div style={{marginLeft: '.5rem', backgroundColor: 'var(--ion-color-tribe-tint)', paddingInline: '16px', paddingTop: 8, paddingBottom: 8, borderRadius: '30px'}}>
              {tokenData.links.twitter_screen_name && <a className='bold' href={`https://twitter.com/${tokenData.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
        </div>
        </div>
        </IonCardContent>
      </IonCard>

        </IonContent>
    </IonPage>
}