import { IonContent, IonHeader, IonItem } from "@ionic/react"
import { TribeHeader } from "./TribeHeader"
import { ReactElement, ReactNode } from "react"

export const TribeContent: React.FC<{ fullscreen?: boolean, children: ReactNode[] | ReactNode }> = ({ children }) => {
    return <IonContent fullscreen>
        {children}
    </IonContent>
}