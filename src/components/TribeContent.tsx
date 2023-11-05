import { IonContent, IonHeader, IonItem } from "@ionic/react"
import { TribeHeader } from "./TribeHeader"
import { ReactElement, ReactNode } from "react"

export const TribeContent: React.FC<{ page?: string, fullscreen?: boolean, children: ReactNode[] | ReactNode }> = ({ children, page }) => {
    return <IonContent color='light' >
        {children}
    </IonContent>
}