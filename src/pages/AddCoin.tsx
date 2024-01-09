import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonPage } from "@ionic/react"

export const AddCoin: React.FC = () => {
    return <IonPage>
        <IonHeader></IonHeader>
        <IonContent>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>
                        new symbol
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonItem>
                        <IonInput placeholder="contract address" />
                    </IonItem>
                    <IonItem>
                        <IonInput placeholder="chain ID" />
                    </IonItem>
                    <IonItem>
                        <IonInput placeholder="ticker" />
                    </IonItem>
                    <IonButton expand="full" onClick={() => {

                    }}>
                        Submit
                    </IonButton>
                </IonCardContent>
            </IonCard>
        </IonContent>
        <IonFooter> </IonFooter>
    </IonPage>
}