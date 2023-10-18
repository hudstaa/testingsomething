import { IonAvatar, IonButton, IonChip, IonContent, IonIcon, IonImg, IonItem, IonLoading, IonModal, IonPage, IonSpinner, IonTitle } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import { TwitterAuthProvider, getAuth, signInWithCustomToken, signInWithPopup } from "firebase/auth"
import { useMember } from "../hooks/useMember"
import { useEffect, useMemo, useState } from "react"
import { TribeHeader } from "../components/TribeHeader"
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore"
import { app } from "../App"
import axios from "axios"
import { getDatabase } from "firebase/database"
import { MemberBadge } from "../components/MemberBadge"
import { checkmark } from "ionicons/icons"

export const OnBoarding: React.FC<{ me: any, dismiss: () => void }> = ({ me, dismiss }) => {

    const auth = getAuth()
    const { user, linkTwitter, logout, getAccessToken, ready } = usePrivy()
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
            // alert(privyUid)

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
    }, [user, ready])
    return <IonContent>
        {useMemo(() => <IonTitle className="ion-text-center">
            <br />
            {ready ? <>
                {(user === null) ? <IonButton onClick={() => {
                    linkTwitter();
                }}>
                    Connect to Privvy

                </IonButton> : <>
                    <IonButton onClick={dismiss} color={'tertiary'}>
                        {user.twitter?.name}
                        <IonIcon color="success" icon={checkmark} />
                    </IonButton>
                    <br />
                </>}
            </> : <IonSpinner />}

        </IonTitle>, [refresh, me, walletAddress, user, ready])}
        <IonLoading isOpen={tribeLoading} />

    </IonContent >
}