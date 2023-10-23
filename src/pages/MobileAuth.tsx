import { IonLoading, IonPage } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import { useEffect } from "react";
import { OnBoarding } from "./OnBoarding";
import { getAuth } from "firebase/auth";
import { useMember } from "../hooks/useMember";
import { Browser } from "@capacitor/browser";

export const MobileAuth: React.FC = () => {
    const { getAccessToken, linkTwitter, user, ready } = usePrivy();
    const auth = getAuth()
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid))
    useEffect(() => {
        // if (!user && ready) {
        //     linkTwitter();
        // } else {
        getAccessToken().then((token) => {
            if (token && localStorage.getItem('privy:token')) {
                window.location.href = (('tribe.computer://auth?token=' + localStorage.getItem('privy:token')?.replaceAll('"', '') + '&refresh=' + localStorage.getItem('privy:refresh_token')?.replaceAll('"', '') + '&jwt=' + token))
            }
        })
        // }
    }, [ready, user])
    return <IonPage>
        <div style={{ zIndex: 1000000000, background: 'black', left: 0, right: 0, top: 0, bottom: 0 }}></div>
        <OnBoarding me={me} dismiss={() => {

        }} />
    </IonPage>
}