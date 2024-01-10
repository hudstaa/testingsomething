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
        <IonModal className='custom-modal2' presentingElement={presenter} initialBreakpoint={1} breakpoints={[0, 1]} ref={modalRef} isOpen={isOpen} onDidDismiss={() => {
            setHighlight(null);
        }}>
              <div style={{backgroundColor: 'black', position: 'absolute', top: 0, right: 0, minHeight: '100vh', minWidth: '100vw', zIndex: -1}}>
                <img style={{minHeight: '100vh', minWidth: '100vw',  filter:' blur(30px)', opacity: 0.25 }} src={highlight?.twitterPfp || personOutline} />
              </div>

            <IonHeader style={{justifyContent: 'center', marginBottom: '2.5%'}}>
                <IonCardHeader className='ion-image-center' style={{ marginTop: '2.5%',paddingBottom: 0 }}>
                <div style={{ paddingTop: 8, opacity: '0.5' }}>
                        <IonText className="bold" color={'white'} style={{ fontSize: '1rem' }}>
                            Created by @{highlight?.twitterUsername}
                        </IonText>
                    </div>
                    <div style={{ paddingTop: '1rem', opacity: '1' }}>
                        <IonText className="bold" color={'white'} style={{ fontSize: '1.25rem' }}>
                            {highlight?.twitterName}'s tribe
                        </IonText>
                    </div>
                    {/* <div style={{ paddingTop: 8 }}>
                        <IonText className="heavy" style={{ fontSize: '1.5rem' }}>
                            {formatEth(buyPrice)}
                        </IonText>
                    </div> */}
                    <img style={{ width: '9rem', height: '9rem', borderRadius: '2rem', }} src={highlight?.twitterPfp || personOutline} />

                </IonCardHeader>
            </IonHeader>

            <IonContent style={{ padding: 0, '--background': 'transparent', zIndex: 1 }}>
                <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column' }}>
                    
                    <IonCardContent style={{ margin: '24px', padding: 0, borderTop: '1px solid var(--ion-color-primary-shade)' }}>
                    <div style={{display: 'flex'}}>
                        </div>

                        {useMemo(() => <div className="ion-text-center" style={{ paddingTop: 24, marginBottom: '2.5%', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <IonButton className="custombutton" disabled={typeof buyPass === 'undefined'} style={{ margin: 0, width: '100%' }} color='tribe' onClick={buyPass}>
                                Mint {formatEth(buyPrice)}
                            </IonButton>
                        </div>, [sellPass, buyPass])}


                            <div className="ion-text-center" style={{ paddingTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' , marginBottom: '2.5%'}}>
                                <IonButton className="custombutton" style={{ height: 36, margin: 0, marginRight: 2, width: '100%' }} color='tribe' onMouseDown={() => {
                                    push('/member/' + highlight?.address)
                                    setHighlight(null);
                                    dismiss(false);
                                }}>
                                    Profile
                                </IonButton>
                            </div>
                            <div className="ion-text-center" style={{ paddingTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                                <IonButton className="custombutton" style={{ height: 36, margin: 0, marginLeft: 2, width: '100%' }} color='tribe' onMouseDown={() => {
                                    setHighlight(null);
                                    dismiss(false);
                                    push('/channel/' + highlight?.address)
                                }}>
                                    Chat
                                </IonButton>
                            </div>


                    </IonCardContent>
                </div>
                <IonItem color={'transparent'} lines="none">
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