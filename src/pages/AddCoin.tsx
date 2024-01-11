import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonPage } from "@ionic/react"
import { httpsCallable, getFunctions } from "firebase/functions";
import { app } from "../App";
import { useState } from "react";

export const AddCoin: React.FC<{ tag: string }> = ({ tag }) => {
    const [info, setInfo] = useState<any>();
    const [contractAddress, setContract] = useState<any>();
    return <IonCard>
        <IonCardHeader>
            <IonCardTitle>
                new symbol
            </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <IonItem>
                <IonInput onIonChange={(contract) => {
                    setContract(contract);
                }}
                    placeholder="contract address" />
            </IonItem>
            <IonItem>
                <IonInput placeholder="chain ID" value='1' />
            </IonItem>
            <IonItem>
                <IonInput placeholder="ticker" value={tag} />
            </IonItem>
            <IonButton expand="full" onClick={() => {
                const coinInfo = httpsCallable(getFunctions(app), 'coinInfo');
                coinInfo({ contractAddress }).then((result) => {
                    setInfo(result.data);
                });
            }}>
                Submit
            </IonButton>
        </IonCardContent>
    </IonCard>
}