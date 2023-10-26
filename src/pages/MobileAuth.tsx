import { Browser } from "@capacitor/browser";
import { IonModal, IonPage } from "@ionic/react";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { useMember } from "../hooks/useMember";
import { nativeAuth } from "../lib/sugar";


import { OnBoarding } from "./OnBoarding";


export const MobileAuth: React.FC = () => {
    const { getAccessToken, linkTwitter, user, ready } = usePrivy();
    const auth = nativeAuth()
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));
    useEffect(() => {
        // if (!user && ready) {
        //     linkTwitter();
        // } else {
        uid && getAccessToken().then((token) => {
            if (token && localStorage.getItem('privy:token')) {
                const url = ('tribe.computer://auth?token=' + localStorage.getItem('privy:token') + '&refresh=' + localStorage.getItem('privy:refresh_token') + '&jwt=' + token);
                window.open(url, "_system", "location=yes");
            }
        })
        // }
    }, [ready, user, auth.currentUser, uid])
    return <IonPage>
        <IonModal isOpen={true} animated={false}>

            <OnBoarding me={me} dismiss={() => {
                getAccessToken().then((token) => {
                    const url = ('tribe.computer://auth?token=' + localStorage.getItem('privy:token') + '&refresh=' + localStorage.getItem('privy:refresh_token') + '&jwt=' + token);
                    window.open(url, "_system", "location=yes");
                });
            }} />
        </IonModal>
    </IonPage >
}