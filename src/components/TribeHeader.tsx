import { IonBackButton, IonAvatar, IonBadge, IonButton, IonButtons, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonImg, IonModal, IonRouterLink, IonText, IonTitle, IonToolbar } from "@ionic/react";
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

export const TribeHeader: React.FC<{ image?: string, title?: string, sticky?: boolean, color?: string, content?: ReactElement, hide?: boolean, showBackButton?: boolean }> = ({ title, sticky = true, color, hide, image, content, showBackButton = false }) => {
    const { user, ready } = usePrivy()
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
    let backPage = '/' + location.pathname?.split('/')[1];
    if (backPage || "".includes('/channel')) {
        backPage = '/chat'
    }
    const toolbar = !hide ? (
        <IonToolbar style={{
          paddingTop: 'max(env(safe-area-inset-top), 10px)', // Updated this line
          paddingBottom: 'env(safe-area-inset-bottom), 0px',
        }}>
          <IonButtons slot="start">
            {showBackButton && title !== 'channel' && (
              <IonBackButton color="dark" defaultHref={backPage} />
            )}
          </IonButtons>
          <IonTitle style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: '20px',
            flex: showBackButton ? 'none' : 1, // Adjust flex when a back button is present
            marginLeft: showBackButton ? 0 : 'env(safe-area-inset-left)',
            marginRight: 'env(safe-area-inset-right)',
          }}>
            {title}
          </IonTitle>
          <IonButtons slot="end">
            {/* Placeholder for end buttons, if any */}
          </IonButtons>
        </IonToolbar>
      ) : (
        <IonToolbar color='tribe' style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {content}
        </IonToolbar> );
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
