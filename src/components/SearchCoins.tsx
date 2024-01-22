import { IonHeader, IonToolbar, IonTitle, IonSearchbar, IonList, IonItem, IonButtons, IonAvatar, IonImg, IonText, IonIcon, IonButton } from "@ionic/react"
import algoliasearch from "algoliasearch";
import { search } from "ionicons/icons";
import { useState } from "react"
const searchClient = algoliasearch('LR3IQNACLB', 'd486674e7123556e91d7557fa704eb20');
export const SearchProvider: React.FC = () => {
    const [show, setShow] = useState<boolean>(false)
    const [hits, setHits] = useState<any[]>([]);
    return null;
    return <>
        {show && <div style={{ position: 'absolute', width: '100vw', top: 60 }}>
            <IonToolbar >
                <IonSearchbar class="custom" style={{ padding: 12, paddingTop: 4, paddingBottom: 0, borderRadius: 30 }} onIonInput={(event) => {

                    if (event.detail.value && event.detail.value !== null) {
                        searchClient.search([{ query: event.detail.value, indexName: 'coin index' }]).then((res) => {
                            setHits((res.results[0] as any).hits || [])
                        })
                    } else {
                        setHits([]);
                    }

                }} />
                <IonList >
                    {hits.map(x => (
                        <IonItem
                            detail={false}
                            lines="none"
                            onClick={() => { setHits([]); setShow(false) }}
                            routerLink={'/coin/' + x.id}
                            style={{ display: 'flex', alignItems: 'center' }} // Added flex styles here
                        >
                            <IonButtons slot='start'>
                                <IonAvatar>
                                    <IonImg class="disco-avatar" src={x.image} style={{ marginTop: 8, width: 35, height: 35 }} />
                                </IonAvatar>
                            </IonButtons>
                            <IonText className='semi' style={{ marginLeft: 0 }}>{x.name}</IonText> {/* Added IonText for better control */}
                        </IonItem>
                    ))}
                </IonList>
            </IonToolbar>

            <div /></div>}

        <div style={{ position: 'absolute', right: 170, top: -5, zIndex: 1000000000 }}>
            <IonButton fill='clear' color='tribe' onClick={() => {
                setShow(!show);
            }}>
                <IonIcon icon={search} />
            </IonButton>
        </div></>
}
