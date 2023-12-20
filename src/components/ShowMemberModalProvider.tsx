import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonFab, IonGrid, IonIcon, IonImg, IonItem, IonList, IonModal, IonRouterOutlet, IonAvatar, IonText, IonToolbar, IonHeader, IonContent, IonFooter, IonRow } from "@ionic/react"
import { WriteMessage } from "./WriteMessage"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { useMember } from "../hooks/useMember";
import { close, personOutline } from "ionicons/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { BuyPriceBadge } from "../pages/Discover";
import { Address } from "viem";
import useBuyPass from "../hooks/useBuyPass";
import useSellPass from "../hooks/useSellPass";
import { formatEth } from "../lib/sugar";
import { useBalance } from "wagmi";
import useTabs from "../hooks/useTabVisibility";
import { useNotifications } from "../hooks/useNotifications";
import useBoosters from "../hooks/useBoosters";
import { MemberGraph } from "./MemberGraph";

export const ShowMemberModalProvider: React.FC = () => {
    const { highlight, setHighlight } = useMember();
    const { dismiss } = useWriteMessage()
    const me = useMember(x => x.getCurrentUser())
    const isOpen = highlight !== null;
    const modalRef = useRef<HTMLIonModalElement>(null);
    const { push } = useHistory();
    const { pathname } = useLocation()
    const [trade, setTrade] = useState();
    useEffect(() => {
        if (isOpen == false) {
            modalRef.current?.dismiss()
        } else {

        }
    }, [isOpen])
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'light';

    const highlightAddress = highlight?.address || "0x000000000000000000000000000000000000dead"
    const { buyPass, buyPrice, status: buyStatus, error: buyError } = useBuyPass(highlightAddress as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus, error: sellError } = useSellPass(highlightAddress as Address, 1n)
    const { balance } = useBoosters(me?.address, highlightAddress)
    const { setTab } = useTabs()
    const [presenter, setPresenter] = useState();
    useEffect(() => {
        setTab(pathname.split("/")[1] as any)
        setPresenter(document.querySelector("ion-page") as any)

    }, [pathname])
    return <>
        <IonModal presentingElement={presenter} initialBreakpoint={0.7} breakpoints={[0, 0.7]} ref={modalRef} isOpen={isOpen} onDidDismiss={() => {
            setHighlight(null);
        }}>
            <IonHeader >
                <IonCardHeader className='ion-image-left' style={{ borderBottom: '1px solid var(--ion-color-light)' }}>
                    <div style={{paddingTop: 4}}>
                    <IonText color='medium'>
                        {highlight?.bio}
                    </IonText>
                    </div>
                    <div style={{paddingTop: 8}}>
                    <IonText className="medium">
                        {highlight?.twitterName}
                    </IonText>
                    </div>
                    <img style={{ width: 44, height: 44, borderRadius: '100%', }} src={highlight?.twitterPfp || personOutline} />

                </IonCardHeader>


            </IonHeader>
            <IonContent style={{padding: 0}}>

                <IonCardContent style={{padding: 0}}>
                    <IonList>

                        <IonItem lines="none">
                            <IonButton style={{ margin: 'auto', padding: -10, marginRight: 5 }} color='tribe' onMouseDown={() => {
                                push('/member/' + highlight?.address)
                                setHighlight(null);
                                dismiss(false);
                            }}>
                                Profile
                            </IonButton>
                            <IonButton style={{ margin: 'auto', marginLeft: 5, padding: -10 }} color='tribe' onMouseDown={() => {
                                setHighlight(null);
                                dismiss(false);
                                push('/channel/' + highlight?.address)
                            }}>
                                chat
                            </IonButton>


                        </IonItem>

                    </IonList>

                </IonCardContent>
                    <div style={{   display: 'flex', flexDirection: 'column'}}>
                        <div style={{borderBottom: '1px solid var(--ion-color-light)'}}>
                            {highlight && <MemberGraph address={highlight.address} />}
                        </div>
                    {useMemo(() => <div className="ion-text-center" style={{paddingTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <IonButton disabled={typeof sellPass === 'undefined'} style={{ marginLeft: 'auto', marginRight: 10 }} color='danger' onClick={sellPass}>
                            Sell {formatEth(sellPrice as any)}
                        </IonButton>
                        <IonButton disabled={typeof buyPass === 'undefined'} style={{ marginLeft: 10, marginRight: 'auto' }} color='success' onClick={buyPass}>
                            Buy {formatEth(buyPrice)}
                        </IonButton>
                    </div>, [sellPass, buyPass])}
                    </div>
                    <IonItem lines="none">
                        <IonText color='warning'>
                            {buyError?.message}
                            {sellError?.message}
                        </IonText>
                    </IonItem>
            </IonContent>
            <IonFooter>
            </IonFooter>
        </IonModal >
    </>
}