import { IonFooter, IonButton, IonIcon } from "@ionic/react";
import { person, albums, pulse, eye, chatbox } from "ionicons/icons";


export const TribeFooter: React.FC<{ page: string }> = ({ page }) => <IonFooter className={'ion-text-center'}>
    <IonButton fill='clear' routerLink="/">
        <IonIcon color={page == 'posts' ? 'tertiary' : 'medium'} icon={albums} />
    </IonButton>
    <IonButton color={page == 'activity' ? 'tertiary' : 'medium'} fill='clear' routerLink="/activity">
        <IonIcon icon={pulse} />
    </IonButton>
    <IonButton color={page == 'chat' ? 'tertiary' : 'medium'} fill='clear' routerLink="/chat">
        <IonIcon icon={chatbox} />
    </IonButton>
    {/* <IonButton color={page == 'discover' ? 'tertiary' : 'medium'} fill='clear' routerLink="/discover">
        <IonIcon icon={eye} />
    </IonButton> */}
    <IonButton fill='clear' routerLink="/account">
        <IonIcon color={page == 'account' ? 'tertiary' : 'medium'} icon={person} />
    </IonButton>
</IonFooter>