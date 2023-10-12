import { IonButton, IonContent, IonItem, IonPage, IonTitle } from "@ionic/react"
import { usePrivy } from "@privy-io/react-auth"
import { TwitterAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { useMember } from "../hooks/useMember"
import { useEffect } from "react"
import { TribeHeader, provider } from "../components/TribeHeader"
import { getFunctions, httpsCallable } from "firebase/functions";

export const OnBoarding: React.FC = () => {


    const auth = getAuth()
    const { user } = usePrivy()
    const walletAddress = user?.wallet?.address;
    const member = useMember(x => x.getFriend(walletAddress))
    const loading = useMember(x => x.isLoading(walletAddress));
    useEffect(() => {
        if (user && auth && !loading) {
            console.log(user);
            typeof member === null && fetch('https://privvysync-5vxicp27ma-uc.a.run.app?userDid=' + user.id.replaceAll('did:privy:', '')).then(res => {
                console.log(res);
            })
        }
    }, [member, user, auth])
    console.log(member, "member")
    return <IonPage>
        <IonContent>
            <TribeHeader title={"Onboarding"} />
            <IonTitle className="ion-text-center">

                {auth.currentUser === null ? <IonButton onClick={() => {
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
                        }).catch((error) => {
                            // Handle Errors here.
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // The email of the user's account used.
                            const email = error.customData.email;
                            // The AuthCredential type that was used.
                            const credential = TwitterAuthProvider.credentialFromError(error);
                            // ...
                        });
                }}>
                    Connect to firebase
                </IonButton> : <IonButton color='light'>✅Connected to Firestore</IonButton>}
                <br />
                {user === null ? <IonButton>
                    Connect to Privvy
                </IonButton> : <IonButton color={'light'}>✅Connected to Privvy</IonButton>}
                <br />
                {member == null ? <IonButton>
                    Member not found
                </IonButton> : <IonButton color='light'>✅Connected to Tribe</IonButton>}
                <br />

                {typeof member !== null && auth.currentUser && <IonButton onClick={() => {
                    const savePFPFunction = httpsCallable(getFunctions(), 'saveTwitterPFP');
                    savePFPFunction()
                        .then(result => {
                            console.log(result.data);
                        })
                        .catch(error => {
                            console.error('Error saving PFP:', error);
                        });

                }}>
                    Sync Twitter PFP
                </IonButton>}
            </IonTitle>

        </IonContent>
    </IonPage >
}