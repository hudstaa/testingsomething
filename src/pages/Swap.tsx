import { IonContent, IonFooter, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Wallet } from '../components/Wallet';
const Swap: React.FC = () => {
    const { search } = useLocation();
    const iframe = useRef<HTMLIFrameElement>(null)
    const [filterType, setFilterType] = useState('Apps')
    const { pathname } = useLocation()
    useEffect(() => {

        if (search.includes('solana')) {
            (window as any).Jupiter.init({
                displayMode: "integrated",
                formProps: {
                    initialOutputMint: new URLSearchParams(search).get('outputCurrency'),
                    fixedOutputMint: true,
                },
                integratedTargetId: "integrated-terminal",
                endpoint: "https://holy-icy-tent.solana-mainnet.quiknode.pro/",
            })
        }
        if (iframe.current && iframe.current.contentWindow) {
            const base = new URLSearchParams(search).get('chain') === 'solana' ? 'jupiter' : 'swap/#'
            let origin = 'https://tribe.computer'
            if (!window.location.origin.includes('localhost')) {
                origin = window.location.origin
            }
            const uri = origin + '/' + base + search;
            iframe.current.contentWindow.location = uri;
        }
    }, [search])
    const { push } = useHistory()
    useEffect(() => {
        <div style={{ height: '100%' }} id="integrated-terminal"></div>

    })
    return <IonPage>
        {filterType === 'Wallet' ? <Wallet /> :
            <IonContent>
                {search.includes('solana') ?
                    <div style={{ height: '1000px' }}>
                        <div id="integrated-terminal"></div>
                    </div>
                    : <iframe src={'https://tribe.computer/swap'} ref={iframe} style={{ border: 'none', height: '100%', width: '100%', overflow: 'hidden' }} />}

            </IonContent>}
        {pathname.includes('swap') && <IonFooter color='black'>
            <div style={{ marginBottom: -2, paddingBottom: 2, backgroundColor: "black", display: 'flex', flexDirection: 'row', borderTopLeftRadius: '28px', borderTopRightRadius: '28px', paddingLeft: 8, paddingRight: 8, paddingTop: 6 }}>
                <IonSegment
                    value={filterType}
                    slot='start'
                    className="heavy my-custom-segment-class2"
                    style={{ fontSize: 24, display: 'flex', paddingLeft: 3, border: '1px solid #FFFFFF10', paddingRight: 3, justifyContent: 'space-between', alignItems: 'center', borderRadius: 24 }} >
                    <IonSegmentButton value="Feed" onClick={() => {
                        push('/post')
                    }}>
                        <IonLabel className='heavy' style={{ color: filterType === 'Feed' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Feed</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Apps" onClick={() => setFilterType('Apps')}>
                        <IonLabel className='heavy' style={{ color: filterType === 'Apps' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Swap</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Wallet" onClick={() => { setFilterType('Wallet') }}>
                        <IonLabel className='heavy' style={{ color: filterType === 'Wallet' ? 'white' : 'var(--ion-color-medium)', fontSize: 18, paddingBottom: 0, paddingTop: 0, paddingLeft: 24, paddingRight: 24 }}>Wallet</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div>
        </IonFooter>}

    </IonPage>
}
export default Swap;