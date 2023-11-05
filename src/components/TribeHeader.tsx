import { IonAvatar, IonBadge, IonButton, IonButtons, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonImg, IonModal, IonRouterLink, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { baseGoerli } from "viem/chains";
import { useMember } from "../hooks/useMember";
import { nativeAuth } from "../lib/sugar";
import { OnBoarding } from "../pages/OnBoarding";
import { useHistory } from "react-router";
import { app } from "../App";
import { getFirestore, query, collection, where, getDocs, Timestamp, onSnapshot } from "firebase/firestore";
import { MemberPfp } from "./MemberBadge";
import { useNotifications } from "../hooks/useNotifications";

export const TribeHeader: React.FC<{ image?: string, title?: string, sticky?: boolean, color?: string, content?: ReactElement, hide?: boolean }> = ({ title, sticky = true, color, hide, image, content }) => {
    const { user, ready } = usePrivy()
    const { setNotifications, notifications } = useNotifications();
    const modalRef = useRef<HTMLIonModalElement>(null)
    const auth = nativeAuth();
    const fireUser = auth.currentUser;
    const me = useMember(x => x.getCurrentUser());

    useEffect(() => {
        if (fireUser && ready && me?.address) {
            modalRef.current?.dismiss();
        }
    }, [ready, auth?.currentUser, me])

    const { location } = useHistory();
    const toolbar = !hide ? <IonToolbar>
        <IonButtons slot='start' style={{ marginLeft: 12 }}>
            <IonRouterLink routerDirection="back" routerLink={'/' + location.pathname?.split('/')[1]}>
                <IonText color='dark'>
                    {title}
                </IonText>
            </IonRouterLink>
        </IonButtons>
        <IonButtons slot='end'>
            {me &&
                <IonButton routerLink={'/account'}>
                    {notifications && notifications.length > 0 && < IonBadge color='tribe'>
                        {notifications.length}
                    </IonBadge>}
                    <MemberPfp address={me.address} size="smol" />
                </IonButton>}
        </IonButtons>
    </IonToolbar > : <IonToolbar color='tribe'>
        {content}
    </IonToolbar>
    if (!sticky) {
        return toolbar;
    }
    if (user && user.wallet && typeof user.wallet.address === 'undefined') {
        return <IonHeader>
            {user?.twitter?.name}
        </IonHeader>
    }

    return <IonHeader color="tribe" style={{ border: 0 }}>
        {toolbar}
        <IonModal canDismiss={me !== null} isOpen={me === null} ref={modalRef}>
            <OnBoarding dismiss={() => {
                modalRef.current?.dismiss();
            }} me={me} />
        </IonModal>
        {!hide && content}
    </IonHeader>

}
