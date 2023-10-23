import { IonPage } from "@ionic/react"
import { ReactElement } from "react"

export const TribePage: React.FC<{ page: string, children: ReactElement | ReactElement[] }> = ({ children, page }) => {
    return <IonPage id={page}>
        {children}
    </IonPage>
}