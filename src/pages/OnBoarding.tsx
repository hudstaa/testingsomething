import { IonButton, IonContent, IonItem, IonLoading, IonModal, IonPage, IonTitle } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import { TwitterAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { useMember } from "../hooks/useMember"
import { useEffect, useMemo, useState } from "react"
import { TribeHeader, provider } from "../components/TribeHeader"
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import { app } from "../App"

export const OnBoarding: React.FC = () => {


    const auth = getAuth()
    const { user, linkTwitter, logout } = usePrivy()
    const walletAddress = user?.wallet?.address;
    const member = useMember(x => x.getFriend(walletAddress, true))
    const loading = useMember(x => x.isLoading(walletAddress));
    const [refresh, setRefresh] = useState<number>(0)
    const [tribeLoading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        auth.onAuthStateChanged(() => {
            setRefresh(x => x + 1);
            console.log("AUTH STATE CHANGED");
        })
    }, [])
    return <IonContent>
        {useMemo(() => <IonTitle className="ion-text-center">
            {(auth.currentUser === null) ? <IonButton onClick={() => {
                signInWithPopup(auth, provider)
                    .then((result) => {
                        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                        // You can use these server side with your app's credentials to access the Twitter API.
                        const credential = TwitterAuthProvider.credentialFromResult(result);
                        if (credential === null) {
                            return;
                        }
                        const token = credential.accessToken;
                        const secret = credential.secret;

                        // The signed-in user info.
                        const user = result.user;
                        // IdP data available using getAdditionalUserInfo(result)
                        // ...
                        setRefresh(x => x + 1);
                    })
            }}>
                Connect to firebase
            </IonButton> : <IonButton onClick={() => {
                auth.signOut();
                console.log(auth);
            }} color='light'>✅Connected to Firestore with {auth.currentUser.displayName}</IonButton>}
            <br />
            {<>
                {user === null ? <IonButton onClick={() => {
                    linkTwitter();
                }}>
                    Connect to Privvy

                </IonButton> : <IonButton onClick={() => {
                    logout();
                }} color={'light'}>✅Connected to Privvy with {user.twitter?.name}</IonButton>}
            </>}
            <br />

            {member === null && user !== null && auth.currentUser !== null && auth.currentUser?.providerData[0]?.uid === user.twitter?.subject && < IonButton onClick={() => {
                const syncPrivvy = httpsCallable(getFunctions(app), 'syncPrivvy',);
                setLoading(true);
                syncPrivvy({ userDid: user!.id.replaceAll('did:privy:', '') })
                    .then(result => {
                        console.log(result.data);
                        setLoading(false);

                    })
                    .catch(error => {
                        setLoading(false);
                        console.log(error);
                    });

            }}>
                Join Tribe
            </IonButton>}
            {user !== null && auth.currentUser !== null && auth.currentUser?.providerData[0]?.uid === user.twitter?.subject ? <></> : <>{user !== null && auth.currentUser !== null && "Connected with different accounts!"}</>}
        </IonTitle>, [refresh, member, loading, walletAddress, user])}
        <IonLoading isOpen={tribeLoading} />
    </IonContent >
}