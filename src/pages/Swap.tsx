import { IonPage, IonContent } from '@ionic/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
const Swap:React.FC=()=>{
const {push,location}=useHistory()
useEffect(()=>{
    if(location.pathname==='/swap'){
    (window as any).location=("https://swap.tribe.computer")
}
},[location])
return <IonPage>
        </IonPage>
}
export default Swap;