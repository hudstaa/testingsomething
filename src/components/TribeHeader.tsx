import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonImg, IonModal, IonIcon, IonProgressBar, IonRouterLink } from "@ionic/react"
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useLocation } from "react-router"
import { BalanceChip } from "./BalanceBadge";
import { Address } from "viem";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useEffect, useMemo, useRef, useState } from "react";
import { baseGoerli } from "viem/chains";
import { MemberBadge } from "./MemberBadge";
import { useTitle } from "../hooks/useTitle";
import { flameOutline } from "ionicons/icons";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";
export const provider = new TwitterAuthProvider();

export const TribeHeader: React.FC<{ title: string, sticky?: boolean }> = ({ title, sticky = true }) => {
    const { pathname } = useLocation();
    const { authenticated, linkTwitter, user, login } = usePrivy()
    const { wallets } = useWallets();

    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
    const [fireAuth, setFireAuth] = useState<boolean>(false);
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
    const fireUser = auth.currentUser;

    useEffect(() => {

    }, [])
    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setFireAuth(true);
            } else {
                setFireAuth(false);
            }
        });
    }, [auth])
    const toolbar = useMemo(() => <IonToolbar>
        <IonModal ref={modalRef}>
        </IonModal>
        <IonRouterLink routerLink="/" routerDirection="root">
            <IonTitle color={title.includes('Activity') ? "danger" : title.includes('Discover') ? "success" : 'tertiary'}>{title}</IonTitle>
        </IonRouterLink>
        <IonButtons slot='start'>
            <IonButton routerLink={'/'}>
                <IonIcon icon={flameOutline} />
            </IonButton>
        </IonButtons>
        <IonButtons slot='end'>
            {authenticated && user ? typeof fireUser === null ?
                <IonButton onClick={() => {
                    const auth = getAuth();
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
                    Connect Twitter
                </IonButton> :
                <IonButton routerLink={'/member/' + user.wallet!.address}>
                    {user.wallet ? <MemberBadge address={user.wallet!.address} /> : user.twitter?.name}
                </IonButton> : <IonButton onClick={() => {
                    linkTwitter()
                }}>
                Login
            </IonButton>}
        </IonButtons>
    </IonToolbar>, [user, fireUser, fireAuth])
    if (!sticky) {
        return toolbar;
    }
    return <IonHeader>
        {toolbar}

    </IonHeader>

}