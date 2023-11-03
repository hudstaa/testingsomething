import { Browser } from '@capacitor/browser'
import { IonBadge, IonButton, IonContent, IonIcon, IonLabel, IonLoading, IonSpinner, IonText, IonTitle, isPlatform } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import axios from "axios"
import { signInWithCustomToken } from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"
import { checkmark } from "ionicons/icons"
import { useEffect, useMemo, useState } from "react"
import { app } from "../App"
import { nativeAuth } from "../lib/sugar"
import { useMember } from '../hooks/useMember'
import { useHistory } from 'react-router'

export const OnBoarding: React.FC<{ me: any, dismiss: () => void }> = ({ me, dismiss }) => {

    const auth = nativeAuth()
    const [error, setError] = useState<string | undefined>();
    const { user, linkTwitter, login, getAccessToken, ready } = usePrivy()
    const walletAddress = user?.wallet?.address;
    const { setCurrentUser } = useMember();
    const [refresh, setRefresh] = useState<number>(0)
    const [tribeLoading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        auth.onAuthStateChanged(async (currentUser) => {
            setRefresh(x => x + 1);
            const database = getFirestore(app);
            const privyUid = currentUser?.uid as any;
            if (typeof privyUid === 'undefined' || privyUid === null) {
                return;
            }
            const docRef = doc(database, 'member', privyUid);
            getDoc(docRef).then((snap) => {
                if (!snap.exists()) {
                    const joinTribe = httpsCallable(getFunctions(app), 'syncPrivy');
                    joinTribe().then((res) => {
                        getDoc(docRef).then((snap) => {
                            setCurrentUser(snap.data() as any);
                        })
                    }).catch((e) => {
                        alert("Un expected error");
                    })
                } else {
                    setCurrentUser(snap.data() as any);
                }
            }).catch(() => {

            });
        }, (e) => {
            setError(e.message);
        })
    }, [])
    useEffect(() => {
        if (user === null) {
            return;
        }
        auth.authStateReady().then((state) => {
            getAccessToken().then((privyToken) => {
                axios.post('https://us-central1-tribal-pass.cloudfunctions.net/privyAuth', { token: privyToken }, { headers: { Authorization: 'Bearer ' + privyToken } }).then((res) => {
                    signInWithCustomToken(auth, res.data.authToken)
                });
            });
        })
    }, [user, ready, auth])

    const { location } = useHistory();
    const path = location.pathname
    return <IonContent>
        {useMemo(() => <IonTitle className="ion-text-center">
            {ready ? <>
                {(user === null) ? <IonButton color='tribe' onClick={() => {
                    if (isPlatform("capacitor")) {
                        Browser.open({ url: 'https://tribe.computer/#/auth', presentationStyle: 'fullscreen', windowName: 'auth' })
                    } else {
                        linkTwitter();
                    }
                }}>
                    Connect to {isPlatform("capacitor") ? "tribe" : "privy"}

                </IonButton> : <>
                    <IonButton onClick={dismiss} fill='clear'>
                        {path === '/auth' ? 'open in tribe' : user.twitter?.name}
                        {path !== '/auth' ? <IonIcon color="success" icon={checkmark} /> : <img style={{ borderRadius: 10 }} height={40} src={'/favicon.png'} />}

                    </IonButton>
                    <br />
                </>}
            </> : <IonSpinner name="crescent" />}
            <br />
            <IonLabel color='tribe'>
                {!ready && <>connecting to privy</>}
                {me === null && ready && user !== null && <>initializing <br />


                    <IonSpinner name='dots' />
                    <br />
                </>}

            </IonLabel>
            <br />
            {error && <IonBadge color='danger'>{error}</IonBadge>}

        </IonTitle>, [refresh, me, walletAddress, user, ready, refresh])}
        <IonLoading isOpen={tribeLoading} />

    </IonContent >
}