import { IonButton, IonCol, IonItem, IonRow, IonTitle } from "@ionic/react"

export const Apps: React.FC = () => {
    const allApps = ["Swap"]//, "Mint", "Trending", "Gainers & Losers", "NFTs"];//"Games", "DAOs", "Social", "Lending", "Analytics", "Wallets", "Dapps", "Bridges", "Staking", "Governance", "Yield Farming", "NFT Marketplaces"]
    return <IonRow>{allApps.map((name) => <IonCol size="2" className="ion-text-center" style={{ verticalAlign: 'middle', background: '', borderRadius: 14, padding: 10, margin: 10, aspectRatio: 1, width: "10vh" }}>
    <IonButton routerLink={'/'+name.replaceAll(' ','').replaceAll('&','-').toLowerCase()}>
    {name}
    </IonButton>
</IonCol>)}</IonRow>
}