import { IonAvatar, IonButton, IonButtons, IonHeader, IonImg, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import axios from "axios";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { baseGoerli } from "viem/chains";
import { useMember } from "../hooks/useMember";
import { OnBoarding } from "../pages/OnBoarding";

export const TribeHeader: React.FC<{ image?: string, title?: string, sticky?: boolean, color?: string, content?: ReactElement }> = ({ title, sticky = true, color, image, content }) => {
    const { authenticated, linkTwitter, user, getAccessToken, ready } = usePrivy()
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
    const auth = getAuth();
    const fireUser = auth.currentUser;
    const me = useMember(x => x.getCurrentUser(auth.currentUser?.uid))

    useEffect(() => {
        if (fireUser && ready && me?.address) {
            modalRef.current?.dismiss();
        }
    }, [ready, auth?.currentUser, me])
    const toolbar = useMemo(() => <IonToolbar>
        <IonButtons slot='start'>
            <IonButton routerLink="/activity">
                <IonImg style={{ height: 30 }} src='/icon.svg' />
            </IonButton>
            {/* <IonButton onClick={() => {

            }}>
                <IonImg src='/icon.png' />
            </IonButton> */}
        </IonButtons>

        <IonTitle color={color}>
            {title}
        </IonTitle>

        <IonButtons slot='end'>
            {authenticated && user ? typeof fireUser === null ?
                <IonButton onClick={async () => {
                    const auth = getAuth();
                    const privyToken = await getAccessToken();
                    const { data: token } = await axios.post('https://us-central1-tribal-pass.cloudfunctions.net/authenticateUser', { token: privyToken });
                    token !== null && signInWithCustomToken(auth, token)
                        .then((result) => {
                        }).catch((error) => {
                        });
                }}>
                    Connect Twitter
                </IonButton> :
                <IonButton routerLink={'/account/'}> {!me?.twitterPfp ? <IonText>@{user.twitter?.username}</IonText> :
                    <IonAvatar><IonImg src={me?.twitterPfp} /></IonAvatar>}
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
        <IonModal canDismiss={me !== null} isOpen={me === null} ref={modalRef}>
            <OnBoarding dismiss={() => {
                modalRef.current?.dismiss();
            }} me={me} />
        </IonModal>
        {content}
    </IonHeader>

}