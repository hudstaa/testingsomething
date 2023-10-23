import { IonButton, IonContent, IonIcon, IonLoading, IonSpinner, IonText, IonTitle } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import axios from "axios"
import { getAuth, signInWithCustomToken } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { checkmark } from "ionicons/icons"
import { useEffect, useMemo, useState } from "react"
import { app } from "../App"
import { Browser } from '@capacitor/browser';
import { isPlatform } from '@ionic/react';

export const OnBoarding: React.FC<{ me: any, dismiss: () => void }> = ({ me, dismiss }) => {

    const auth = getAuth()
    const { user, linkTwitter, login, getAccessToken, ready } = usePrivy()
    const walletAddress = user?.wallet?.address;
    const [refresh, setRefresh] = useState<number>(0)
    const [tribeLoading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        auth.onAuthStateChanged(async () => {
            setRefresh(x => x + 1);
            const database = getFirestore(app);
            const privyUid = auth.currentUser?.uid as any;
            if (typeof privyUid === 'undefined') {
                return;
            }

            const docRef = doc(database, 'member', privyUid);
            getDoc(docRef).then((snap) => {
                if (!snap.exists()) {
                    const joinTribe = httpsCallable(getFunctions(app), 'syncPrivy');
                    joinTribe().then((res) => {
                        console.log(res, "PRIVVY SYNX SUCCESS")
                    }).catch((e) => {
                        console.log(e, "PRIVVY SYNC FAIL")
                    })
                }
            }).catch(() => {

            });
        })
    }, [])
    useEffect(() => {
        if (user === null) {
            return;
        }
        getAccessToken().then((privyToken) => {
            axios.post('https://us-central1-tribal-pass.cloudfunctions.net/privyAuth', { token: privyToken }, { headers: { Authorization: 'Bearer ' + privyToken } }).then((res) => {
                signInWithCustomToken(auth, res.data.authToken)
            });
        });
    }, [user, ready, auth])
    return <IonContent>
        {useMemo(() => <IonTitle className="ion-text-center">
            <br />
            {ready ? <>
                {(user === null) ? <IonButton onClick={() => {
                    linkTwitter();
                    if (isPlatform("capacitor")) {
                        Browser.open({ url: 'https://tribe.computer/#/auth', presentationStyle: 'popover', windowName: 'auth' })
                    }
                }}>
                    Connect to Privvy

                </IonButton> : <>
                    <IonButton onClick={dismiss} color={'tertiary'}>
                        {user.twitter?.name}
                        <IonIcon color="success" icon={checkmark} />
                    </IonButton>
                    <br />
                </>}
            </> : <IonSpinner name="crescent" />}
            <br />
            <IonText color='tertiary'>
                {!ready && <>connecting to privy</>}
                {me === null && ready && user !== null && <>loading member data <br /><IonSpinner name='dots' /></>}
            </IonText>

        </IonTitle>, [refresh, me, walletAddress, user, ready, refresh])}
        <IonLoading isOpen={tribeLoading} />

    </IonContent >
}