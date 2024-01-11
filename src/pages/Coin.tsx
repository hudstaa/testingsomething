import { IonChip, IonContent, IonHeader, IonItem, IonPage, IonToast, IonToolbar } from "@ionic/react"
import { getApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router"

export const Coin: React.FC = () => {

    const { id } = useParams<{ id: string }>()
    const [info, setInfo] = useState<any>()
    useEffect(() => {
        getDoc(doc(getFirestore(getApp()), 'coin/' + id)).then((doc) => {
            console.log()
            setInfo(doc.data());
        });
    }, [id])
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                {info && info.name}
            </IonToolbar>
        </IonHeader>
        <IonContent>{Object.entries(info || {}).map(([key, value]) => <IonItem>
            <IonChip>{key}</IonChip>
            {JSON.stringify(value)}
        </IonItem>)}
        </IonContent>
    </IonPage>
}