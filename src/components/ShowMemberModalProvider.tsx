import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonFab, IonGrid, IonIcon, IonImg, IonItem, IonList, IonModal, IonRouterOutlet, IonAvatar, IonText, IonToolbar, IonHeader, IonContent, IonFooter, IonRow } from "@ionic/react"
import { WriteMessage } from "./WriteMessage"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { useMember } from "../hooks/useMember";
import { close, personOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { BuyPriceBadge } from "../pages/Discover";
import { Address } from "viem";
import useBuyPass from "../hooks/useBuyPass";
import useSellPass from "../hooks/useSellPass";
import { formatEth } from "../lib/sugar";
import { useBalance } from "wagmi";

export const ShowMemberModalProvider: React.FC = () => {
    const { highlight, setHighlight } = useMember();
    const me = useMember(x => x.getCurrentUser())
    const isOpen = highlight !== null;
    const modalRef = useRef<HTMLIonModalElement>(null);
    const { push } = useHistory();
    const [trade, setTrade] = useState();
    useEffect(() => {
        if (isOpen == false) {
            modalRef.current?.dismiss()
        } else {

        }
    }, [isOpen])
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? undefined : 'light';

    const { buyPass, buyPrice, status: buyStatus } = useBuyPass(highlight?.address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus } = useSellPass(highlight?.address as Address, 1n)
    const balance = useBalance(me?.address as any)
    return <>
        <IonModal initialBreakpoint={0.4} breakpoints={[0, 0.25, 0.5, 0.75]} ref={modalRef} isOpen={isOpen} onDidDismiss={() => {
            setHighlight(null);
        }}>
            <IonHeader>
                <IonCardHeader className='ion-image-center' style={{ boderBottom: 0 }}>
                    <IonText color='medium'>
                        {highlight?.bio}
                    </IonText>
                    <IonText >
                        {highlight?.twitterName}
                    </IonText>
                    <img style={{ width: 70, height: 70, borderRadius: '10px', }} src={highlight?.twitterPfp || personOutline} />

                </IonCardHeader>


            </IonHeader>
            <IonContent>

                <IonCardContent>
                    <IonList>

                        <IonItem>
                            <IonButton style={{ margin: 'auto', padding: -10 }} color='tribe' onMouseDown={() => {
                                push('/member/' + highlight?.address)
                                setHighlight(null);
                            }}>
                                Profile
                            </IonButton>
                        </IonItem>
                        <div className="ion-text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <IonButton disabled={!sellPass} style={{ marginLeft: 'auto', marginRight: 0 }} color='danger' onClick={sellPass}>
                                Sell {formatEth(sellPrice as any)}
                            </IonButton>
                            <IonButton disabled={!buyPass} style={{ marginLeft: 0, marginRight: 'auto' }} color='success' onClick={buyPass}>
                                Buy {formatEth(buyPrice)}
                            </IonButton>
                        </div>
                    </IonList>

                </IonCardContent>
            </IonContent>
            <IonFooter>
                NICE
            </IonFooter>
        </IonModal >
    </>
}