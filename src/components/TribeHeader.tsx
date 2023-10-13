import { IonHeader, IonToolbar, IonTitle, IonButton, IonButtons, IonImg, IonModal, IonIcon, IonProgressBar, IonRouterLink, IonNav, IonBackButton, IonRow, IonGrid, IonAvatar, IonCol, IonCard, IonChip, IonText, IonCardTitle } from "@ionic/react"
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useLocation } from "react-router"
import { BalanceChip } from "./BalanceBadge";
import { Address } from "viem";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { baseGoerli } from "viem/chains";
import { MemberBadge } from "./MemberBadge";
import { useTitle } from "../hooks/useTitle";
import { flameOutline } from "ionicons/icons";
import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { FriendPortfolioChip } from "./FriendPortfolioChip";
import { useMember } from "../hooks/useMember";
import { OnBoarding } from "../pages/OnBoarding";
export const provider = new TwitterAuthProvider();

export const TribeHeader: React.FC<{ image?: string, title?: string, sticky?: boolean, color?: string }> = ({ title, sticky = true, color, image }) => {
    const { pathname } = useLocation();
    const { authenticated, linkTwitter, user } = usePrivy()
    const { wallets } = useWallets();

    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
    const modalRef = useRef<HTMLIonModalElement>(null)
    const [walletAddress, setWalletAddress] = useState<string>(user?.wallet?.address || "")
    const loading = useMember(x => x.isLoading(user?.wallet?.address))
    useEffect(() => {
        wallets.forEach((wallet) => {
            if (wallet.connectorType === 'embedded') {
                setActiveWallet(wallet);
            }
        })
    }, [wallets, activeWallet]);
    useEffect(() => {
        activeWallet && activeWallet.switchChain(baseGoerli.id);
        activeWallet && setWalletAddress(activeWallet.address)
    }, [activeWallet])
    const auth = getAuth();
    const fireUser = auth.currentUser;
    const member = useMember(x => x.getFriend(walletAddress, true))
    useEffect(() => {

    }, [])

    const toolbar = useMemo(() => <IonToolbar>
        <IonButtons slot='start'>
            <IonBackButton />
        </IonButtons>
        <IonRouterLink routerLink={'/'} routerDirection="none">

            <IonTitle color={color}>
                {title}
            </IonTitle>
        </IonRouterLink>

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
                <IonButton routerLink={'/member/' + walletAddress}>
                    {user.wallet ? <MemberBadge address={user.wallet.address} /> : user.twitter?.name}
                </IonButton> : <IonButton onClick={() => {
                    linkTwitter()
                }}>
                Login
            </IonButton>}
        </IonButtons>
    </IonToolbar >, [user, fireUser, title, member])
    if (!sticky) {
        return toolbar;
    }
    if (user && user.wallet && typeof user.wallet.address === 'undefined') {
        return <IonHeader>
            {user?.twitter?.name}
        </IonHeader>
    }

    return <IonHeader>
        {toolbar}
        <IonModal isOpen={member === null} ref={modalRef}>
            <OnBoarding />
        </IonModal>
    </IonHeader>

}