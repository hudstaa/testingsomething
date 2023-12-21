import { IonPage } from '@ionic/react';
import { useNotifications } from '../hooks/useNotifications';
import { IframeHTMLAttributes, useEffect, useRef } from 'react';
const Swap:React.FC=()=>{
    const {tradeUri}=useNotifications();    
    const iframe=useRef<HTMLIFrameElement>(null)
    useEffect(()=>{
        if(iframe.current&&iframe.current.contentWindow){
            iframe.current.contentWindow.location=tradeUri as any
        }
    },[tradeUri])
return <IonPage>        
            <iframe ref={iframe} style={{border:'none',height:'100%',width:'100%',overflow:'hidden'}} src={tradeUri}/>
        </IonPage>
}
export default Swap;