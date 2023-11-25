import { IonButton, IonContent, IonFooter, IonHeader, IonPage, IonText, IonTitle } from "@ionic/react";
import { useMember } from "../hooks/useMember";
import { useParams } from "react-router";
import { formatEth, hideTabs } from "../lib/sugar";
import { Address } from "viem";
import useBuyPass from "../hooks/useBuyPass";
import useSellPass from "../hooks/useSellPass";
import { useEffect, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";

export const TradeMobile: React.FC = () => {
    const { address } = useParams<{ address: string }>()
    const member = useMember(x => x.getFriend(address))
    const { buyPass, buyPrice, status: buyStatus, error: buyError } = useBuyPass(member?.address as Address, 1n)
    const { sellPass, sellPrice, status: sellStatus, error: sellError } = useSellPass(member?.address as Address, 1n)
    useEffect(() => {
        if (buyStatus === 'success' || sellStatus === 'success') {
            window.close();
        }
    }, [sellStatus, buyStatus])
    hideTabs();
    return <IonPage>
        <IonHeader>
        </IonHeader>
        <IonContent>
            <IonTitle>
                <IonText>

                    Trade {member?.twitterName}
                </IonText>
                <br />
                {useMemo(() => <div className="ion-text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <IonButton disabled={typeof sellPass === 'undefined'} style={{ marginLeft: 'auto', marginRight: 10 }} color='danger' onClick={sellPass}>
                        Sell {formatEth(sellPrice as any)}
                    </IonButton>
                    <IonButton disabled={typeof buyPass === 'undefined'} style={{ marginLeft: 10, marginRight: 'auto' }} color='success' onClick={buyPass}>
                        Buy {formatEth(buyPrice)}
                    </IonButton>
                </div>, [sellPass, buyPass])}
            </IonTitle>
        </IonContent>
        <IonFooter>

        </IonFooter>
    </IonPage>

}