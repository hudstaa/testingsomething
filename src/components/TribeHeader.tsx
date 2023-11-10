import { IonBackButton, IonAvatar, IonBadge, IonButton, IonButtons, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonImg, IonModal, IonRouterLink, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { baseGoerli } from "viem/chains";
import { useMember } from "../hooks/useMember";
import { nativeAuth } from "../lib/sugar";
import { OnBoarding } from "../pages/OnBoarding";
import { useHistory } from "react-router";
import { app } from "../App";
import { getFirestore, query, collection, where, getDocs, Timestamp, onSnapshot } from "firebase/firestore";
import { MemberPfp } from "./MemberBadge";
import { useNotifications } from "../hooks/useNotifications";
import useTabs from "../hooks/useTabVisibility";

export const TribeHeader: React.FC<{ image?: string, title?: string | ReactNode, sticky?: boolean, color?: string, content?: ReactElement, hide?: boolean, showBackButton?: boolean }> = ({ title, sticky = true, color, hide, image, content, showBackButton = false }) => {
    const { user, ready } = usePrivy()
    const { setTab } = useTabs();
    const modalRef = useRef<HTMLIonModalElement>(null)
    const auth = nativeAuth();
    const fireUser = auth.currentUser;
    const me = useMember(x => x.getCurrentUser());

    useEffect(() => {
        if (fireUser && ready && me?.address) {
            modalRef.current?.dismiss();
        }
    }, [ready, auth?.currentUser, me])

    const { location, replace } = useHistory();
    const toolbar = !hide ? (
        <IonToolbar>
            <IonButtons slot='start' style={{ marginLeft: 12 }}>
                {showBackButton ? <IonBackButton text={title as any} color="dark" />
                    : <IonText style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '-1px' }}>
                        {title as any}
                    </IonText>}
            </IonButtons>
        </IonToolbar>) : <IonToolbar color='tribe'>
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
        {!hide && content}
    </IonHeader>

}
