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

export const TribeHeader: React.FC = () => {
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
    const { title } = useTitle()
    if (user && user.wallet && typeof user.wallet.address === 'undefined') {
        return <IonHeader>
            {user?.twitter?.name}
        </IonHeader>
    }
    return <IonHeader>
        <IonModal ref={modalRef}>
        </IonModal>
        <IonToolbar>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot='start'>
                <IonButton routerLink={'/'}>
                    <IonIcon icon={flameOutline} />
                </IonButton>
            </IonButtons>
            <IonButtons slot='end'>
                {authenticated && user ?
                    <IonButton routerLink={'/member/' + user.wallet!.address}>
                        {user.wallet ? <MemberBadge address={user.wallet!.address} /> : user.twitter?.name}
                    </IonButton> : <IonButton onClick={() => {
                        linkTwitter()
                    }}>
                        Login
                    </IonButton>}
            </IonButtons>
        </IonToolbar>
    </IonHeader>

}