import { IonPage } from "@ionic/react"
import { ReactElement } from "react"
import { useMember } from "../hooks/useMember"
import { OnBoarding } from "./OnBoarding"

export const TribePage: React.FC<{ page: string, children: ReactElement | ReactElement[] }> = ({ children, page }) => {
    const me = useMember(x => x.getCurrentUser())

    return <IonPage id={page}>
        {!me ? <OnBoarding me={me} dismiss={() => {

        }} /> : children}
    </IonPage>
}