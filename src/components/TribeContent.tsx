import { IonContent, IonHeader, IonItem } from "@ionic/react"
import { TribeHeader } from "./TribeHeader"
import { ReactElement, ReactNode } from "react"

export const TribeContent: React.FC<{ color?: string, page?: string, fullscreen?: boolean, children: ReactNode[] | ReactNode }> = (props) => {
    return <IonContent {...props} />
}