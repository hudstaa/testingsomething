import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFooter, IonHeader, IonInput, IonItem, IonPage } from "@ionic/react"

export const AddCoin: React.FC<{ tag: string }> = ({ tag }) => {
    return <IonCard>
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
                <IonInput placeholder="chain ID" value='1' />
            </IonItem>
            <IonItem>
                <IonInput placeholder="ticker" value={tag} />
            </IonItem>
            <IonButton expand="full" onClick={() => {

            }}>
                Submit
            </IonButton>
        </IonCardContent>
    </IonCard>
}