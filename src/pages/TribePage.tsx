import { IonPage } from "@ionic/react"
import { ReactElement } from "react"

export const TribePage: React.FC<{ children: ReactElement | ReactElement[] }> = ({ children }) => {
    return <IonPage id='main-content'>{children}</IonPage>
}