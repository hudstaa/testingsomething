import { IonHeader, IonToolbar, IonTitle, IonSearchbar, IonList, IonItem, IonButtons, IonAvatar, IonImg, IonText } from "@ionic/react"
import algoliasearch from "algoliasearch";
import { useState } from "react"
const searchClient = algoliasearch('LR3IQNACLB', 'd486674e7123556e91d7557fa704eb20');
export const SearchCoins: React.FC = () => {
    const [hits, setHits] = useState<any[]>([]);
    return <IonHeader style={{ display: 'flex', flexDirection: 'column' }}>
        <IonToolbar>
            <IonTitle className='bold' color={'dark'} style={{ paddingTop: 12, fontSize: 18 }}>
                Discover
            </IonTitle>
        </IonToolbar>
        <IonToolbar>

            <IonSearchbar class="custom" style={{ padding: 12, paddingTop: 4, paddingBottom: 0, borderRadius: 30 }} onIonInput={(event) => {
                event.detail.value && event.detail.value !== null && searchClient.search([{ query: event.detail.value, indexName: 'tribe-members' }]).then((res) => {
                    setHits((res.results[0] as any).hits || [])
                })
            }} />
        </IonToolbar>
        <IonList>
            {hits.map(x => (
                <IonItem
                    detail={false}
                    lines="none"
                    onClick={() => setHits([])}
                    routerLink={'/member/' + x.address}
                    style={{ display: 'flex', alignItems: 'center' }} // Added flex styles here
                >
                    <IonButtons slot='start'>
                        <IonAvatar>
                            <IonImg class="disco-avatar" src={x.twitterPfp} style={{ marginTop: 8, width: 35, height: 35 }} />
                        </IonAvatar>
                    </IonButtons>
                    <IonText className='semi' style={{ marginLeft: 0 }}>{x.twitterName}</IonText> {/* Added IonText for better control */}
                </IonItem>
            ))}
        </IonList>
    </IonHeader>
}