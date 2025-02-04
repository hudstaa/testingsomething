import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonHeader, IonImg, IonItem, IonList, IonListHeader, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Address, formatEther } from 'viem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import useBuyPass from '../hooks/useBuyPass';
import { useDiscover } from '../hooks/useDiscover';
import { Member, useMember } from '../hooks/useMember';
import { useTitle } from '../hooks/useTitle';
import { TribePage } from './TribePage';
import { MemberGraph } from '../components/MemberGraph';
import algoliasearch from 'algoliasearch';
import { collection, getFirestore, where, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { app } from '../App';
import { uniqByProp } from '../lib/sugar';

const searchClient = algoliasearch('LR3IQNACLB', 'd486674e7123556e91d7557fa704eb20');

export const BuyPriceBadge: React.FC<{ address: string | undefined, style?: any, onClick?: () => void }> = ({ address, style, onClick }) => {
  const { buyPrice } = useBuyPass(address as Address, 1n);
  return <IonBadge className='medium' style={{ paddingLeft: 0, fontSize: '.65rem', opacity: 0.6, fontWeight: 500, paddingTop: '4px' }} color='transparent'>{formatEther(buyPrice) + 'Ξ'}</IonBadge>
}
export const BuyPriceText: React.FC<{ address: string | undefined, style?: any, onClick?: () => void }> = ({ address, style, onClick }) => {
  const { buyPrice } = useBuyPass(address as Address, 1n);
  return formatEther(buyPrice) + 'Ξ'
}

const Discover: React.FC = () => {
  const discoverStats = useDiscover(x => x.stats());
  const [channels, setChannels] = useState<{ address: string, holders: Record<string, number> }[]>([]);
  const { setTitle } = useTitle();
  const me = useMember(x => x.getCurrentUser())
  useEffect(() => {
    setTitle('discover')
  }, [])
  const [type,setType]=useState<string>('members')
  const [hits, setHits] = useState<Member[]>([])
  const [coins, setCoins] = useState<{id:string,name:string,image:string}[]>([])
  const { getFriend } = useMember()

  useEffect(() => {
    const address = me?.address;
    if (typeof address === 'undefined') {
      return;
    }
    const channelsRef = collection(getFirestore(app), "channel");
    const conditions = [
      where(`boosts`, '>', 0), orderBy('boosts', 'desc'), limit(10)
    ];

    const q = query(channelsRef, ...conditions);
    console.log("NICE");
    getDocs(q)
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const result = querySnapshot.docs.map(doc => ({ ...doc.data(), address: doc.id }));
          console.log(result, "RESULT");
          setChannels(result as any);
        }
      })
      .catch(error => {
      });

  }, [me])
  return (
    <TribePage page='discover'>
      <IonHeader style={{ display: 'flex', flexDirection: 'column' }}>
        <IonToolbar color={'transparent'}>
          <IonTitle className='bold' color={'dark'} style={{ paddingTop: 0, fontSize: '1.25rem' }}>
            Discover
          </IonTitle>
        </IonToolbar>
        <IonToolbar>

          <IonSearchbar class="custom" style={{ padding: 12, paddingTop: 4, paddingBottom: 0, borderRadius: 30 }} onIonInput={(event) => {
            event.detail.value && event.detail.value !== null && searchClient.search([{ query: event.detail.value, indexName: 'tribe-members' },{ query: event.detail.value, indexName: 'coin index' }]).then((res) => {
              setHits((res.results[0] as any).hits || [])
              setCoins((res.results[1] as any).hits || [])
            })
          }} showClearButton='focus' />
          <IonButtons slot='end'>
<IonItem lines='none'>

<IonSelect interface='popover' value={type} onIonChange={(e)=>{
  setType(e.detail.value!)
}}>
<IonSelectOption value={'members'}>
Members
</IonSelectOption>
<IonSelectOption value='coins'>
Coins
</IonSelectOption>
</IonSelect>
</IonItem>

          </IonButtons>
        </IonToolbar>
        <IonList>
          {type=='coins'&&coins.map(x => (
                        <IonItem
                            detail={false}
                            lines="none"
                            onClick={() => { setHits([]);  }}
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
          {type=='members'&&hits.map(x => (
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
      <TribeContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd='6' offsetMd='3' sizeXs='12' >
              {channels?.filter(x => x?.address !== '0x0000000000000000000000000000000000000000').map((channel, i) => {
                const member = getFriend(channel.address);
                return <IonItem style={{ marginLeft: -10, paddingBottom: 4 }} lines="none" routerLink={'/member/' + member?.address} >
                  <IonAvatar style={{ height: 50 }}>
                    <IonImg class="disco3-avatar" src={member?.twitterPfp || personOutline} />
                  </IonAvatar>
                  <IonGrid style={{ paddingLeft: '1.5rem' }}>
                    <IonBadge style={{ paddingLeft: 6, marginBottom: -8, paddingTop: 0, paddingBottom: 0, fontSize: 16 }} color='transparent' >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ textAlign: 'left', fontSize: '1rem', paddingTop: 3, letterSpacing: '-0.0135em' }} className="semi">{member?.twitterName} </span>
                        <span className='semi' style={{ opacity: 0.45, fontSize: '.75rem', fontWeight: 500, paddingTop: 4 }}>{member?.bio}</span>
                      </div>
                      <div style={{ textAlign: 'left' }}>{<BuyPriceBadge address={member?.address} />}</div> {/* lets change to member count instead of price here*/}
                    </IonBadge>
                  </IonGrid>
                  <IonButtons slot='end'>
                    {typeof channel.holders[me!.address] === 'undefined' && <IonButton style={{ borderRadius: 12 }} color='tribe' fill='solid'>
                      <span className='bold'>Join</span>
                    </IonButton>}
                  </IonButtons>
                  {/* <MemberGraph address={member!.address} /> */}
                </IonItem>
              }
              )}
            </IonCol>
            <IonCol>
            </IonCol>
          </IonRow>
        </IonGrid>
      </TribeContent>
      <TribeFooter page='discover' />
    </TribePage>

  );
};

export default Discover;
