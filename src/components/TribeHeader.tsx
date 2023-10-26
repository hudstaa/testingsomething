import { IonAvatar, IonBadge, IonButton, IonButtons, IonHeader, IonImg, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { ReactElement, useEffect, useMemo, useRef } from "react";
import { baseGoerli } from "viem/chains";
import { useMember } from "../hooks/useMember";
import { nativeAuth } from "../lib/sugar";
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
    const auth = nativeAuth();
    const fireUser = auth.currentUser;
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const me = useMember(x => x.getCurrentUser(uid));

    useEffect(() => {
        if (fireUser && ready && me?.address) {
            modalRef.current?.dismiss();
        }
    }, [ready, auth?.currentUser, me])
    const toolbar = useMemo(() => <IonToolbar color={'tribe'}>
        <IonButtons slot='start'>
            <IonButton routerLink="/activity">
                <IonImg style={{ height: 30 }} src='/favicon.png' />
            </IonButton>
            {/* <IonButton onClick={() => {

            }}>
                <IonImg src='/icon.png' />
            </IonButton> */}
        </IonButtons>

        <IonTitle>
            {title}
        </IonTitle>

        <IonButtons slot='end'>
            {me &&
                <IonButton routerLink={'/account/'}>
                    {me.twitterPfp ? <IonAvatar><IonImg src={me?.twitterPfp} /></IonAvatar> : <IonBadge>{me.twitterName}</IonBadge>}
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