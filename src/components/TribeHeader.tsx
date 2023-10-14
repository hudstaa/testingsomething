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
import { signInWithCustomToken, signInWithPopup } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { FriendPortfolioChip } from "./FriendPortfolioChip";
import { useMember } from "../hooks/useMember";
import { OnBoarding } from "../pages/OnBoarding";
import axios from "axios";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
import { app } from "../App";

export const TribeHeader: React.FC<{ image?: string, title?: string, sticky?: boolean, color?: string }> = ({ title, sticky = true, color, image }) => {
    const { pathname } = useLocation();
    const { authenticated, linkTwitter, user, getAccessToken } = usePrivy()
    const { wallets } = useWallets();

    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
    const modalRef = useRef<HTMLIonModalElement>(null)
    const [showLogOut, setShowLogOut] = useState<boolean>(false)
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
    const auth = getAuth();
    const fireUser = auth.currentUser;
    const me = useMember(x => x.getCurrentUser(fireUser?.uid))
    console.log(me, "MEE", fireUser?.uid);
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
                <IonButton onClick={async () => {
                    const auth = getAuth();
                    const privyToken = await getAccessToken();
                    const { data: token } = await axios.post('https://us-central1-tribal-pass.cloudfunctions.net/authenticateUser', { token: privyToken });
                    console.log(token);
                    token !== null && signInWithCustomToken(auth, token)
                        .then((result) => {
                        }).catch((error) => {
                        });
                }}>
                    Connect Twitter
                </IonButton> :
                <IonButton routerLink={me === null ? undefined : '/member/' + user.wallet?.address}>
                    @{user.twitter?.username}
                </IonButton> : <IonButton onClick={() => {
                    linkTwitter()
                }}>
                Login
            </IonButton>}
        </IonButtons>
    </IonToolbar >, [user, fireUser, title, me])
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
        <IonModal isOpen={me === null} onWillDismiss={() => { setShowLogOut(false) }} ref={modalRef}>
            <OnBoarding me={me} />
        </IonModal>
    </IonHeader>

}