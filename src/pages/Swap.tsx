import { IonContent, IonPage } from '@ionic/react';
import { useNotifications } from '../hooks/useNotifications';
import { IframeHTMLAttributes, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
const Swap:React.FC=()=>{
    const {search}=useLocation();    
    const iframe=useRef<HTMLIFrameElement>(null)
    useEffect(()=>{

        if(search.includes('solana')){
            (window as any).Jupiter.init({
                displayMode: "integrated",
                formProps:{
                    initialOutputMint: new URLSearchParams(search).get('outputCurrency'),
                    fixedOutputMint: true,
                },
                integratedTargetId: "integrated-terminal",
                endpoint: "https://holy-icy-tent.solana-mainnet.quiknode.pro/",
            })
        }
        if(iframe.current&&iframe.current.contentWindow){            
            const base = new URLSearchParams(search).get('chain')==='solana'?'jupiter':'swap/#'
            let origin = 'https://tribe.computer/swap'
            if(!window.location.origin.includes('localhost')){
                origin=window.location.origin
            }
            const uri=origin+'/'+base+search;
            iframe.current.contentWindow.location=uri;
        }
    },[search])
    useEffect(()=>{
        <div style={{height:'100%'}} id="integrated-terminal"></div>

    })
return <IonPage>    
    {search.includes('solana')? 
<div style={{height:'1000px'}}>
<div id="integrated-terminal"></div>
</div>
:<iframe src={'https://tribe.computer/swap'} ref={iframe} style={{border:'none',height:'100%',width:'100%',overflow:'hidden'}}/>}
        </IonPage>
}
export default Swap;