import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonImg, IonModal, IonIcon, IonProgressBar } from "@ionic/react"
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useLocation } from "react-router"
import { BalanceChip } from "./BalanceBadge";
import { Address } from "viem";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useEffect, useRef } from "react";
import { baseGoerli } from "viem/chains";
import { MemberBadge } from "./MemberBadge";
import { useTitle } from "../hooks/useTitle";
import { flameOutline } from "ionicons/icons";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
const provider = new TwitterAuthProvider();
import { getAuth } from "firebase/auth";

export const TribeHeader: React.FC<{ title: string, sticky?: boolean }> = ({ title, sticky = true }) => {
    const { pathname } = useLocation();
    const { authenticated, linkTwitter, user, login } = usePrivy()
    const { wallets } = useWallets();

    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
    const modalRef = useRef<HTMLIonModalElement>(null)
    useEffect(() => {
        wallets.forEach((wallet) => {
            if (wallet.connectorType === 'embedded') {
                setActiveWallet(wallet);
            }
        })
    }, [wallets, activeWallet]);
    useEffect(() => {
        activeWallet && activeWallet.switchChain(baseGoerli.id);
    }, [activeWallet])
    if (user && user.wallet && typeof user.wallet.address === 'undefined') {
        return <IonHeader>
            {user?.twitter?.name}
        </IonHeader>
    }
    const auth = getAuth();
    const toolbar = <IonToolbar>
        <IonModal ref={modalRef}>
        </IonModal>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot='start'>
            <IonButton routerLink={'/'}>
                <IonIcon icon={flameOutline} />
            </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
            {authenticated && user ? !auth.currentUser!.uid ? <IonButton onClick={() => {
                <IonButton onClick={() => {
                    const auth = getAuth();
                    signInWithPopup(auth, provider)
                        .then((result) => {
                            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                            // You can use these server side with your app's credentials to access the Twitter API.
                            const credential = TwitterAuthProvider.credentialFromResult(result);
                            console.log(credential);
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
                    Link
                </IonButton>
            }}></IonButton> :
                <IonButton routerLink={'/member/' + user.wallet!.address}>
                    {user.wallet ? <MemberBadge address={user.wallet!.address} /> : user.twitter?.name}
                </IonButton> : <IonButton onClick={() => {
                    linkTwitter()
                }}>
                Login
            </IonButton>}
        </IonButtons>
    </IonToolbar>
    if (!sticky) {
        return toolbar;
    }
    return <IonHeader>
        {toolbar}

    </IonHeader>

}