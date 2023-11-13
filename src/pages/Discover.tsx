import { IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonImg, IonItem, IonList, IonListHeader, IonRow, IonSearchbar, IonText, IonTitle } from '@ionic/react';
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

const searchClient = algoliasearch('LR3IQNACLB', 'd486674e7123556e91d7557fa704eb20');

export const BuyPriceBadge: React.FC<{ address: string | undefined, style?: any, onClick?: () => void }> = ({ address, style, onClick }) => {
  const { buyPrice } = useBuyPass(address as Address, 1n);
  return <IonBadge color='tribe' style={style} onClick={onClick}>
    {formatEther(buyPrice)}
  </IonBadge>
}

const Discover: React.FC = () => {
  const discoverStats = useDiscover(x => x.stats());
  const members = useMember(x => x.friendCache)
  const { loadCache } = useMember()
  const { setTitle } = useTitle();
  useEffect(() => {
    setTitle('discover')
    loadCache();
  }, [])
  const [hits, setHits] = useState<Member[]>([])
  return (
    <TribePage page='discover'>
      <TribeHeader title='Discover' color='primary' content={
        <>
          <IonSearchbar class="custom" onIonInput={(event) => {
            event.detail.value && event.detail.value !== null && searchClient.search([{ query: event.detail.value, indexName: 'tribe-members' }]).then((res) => {
              setHits((res.results[0] as any).hits || [])
            })
          }} />
          <IonList>
            {hits.map(x => <IonItem detail={false} lines='none' color='light' onClick={() => {
              setHits([])
            }} routerLink={'/member/' + x.address}>
              <IonButtons slot='start'>
                <IonAvatar>
                  <IonImg src={x.twitterPfp} />
                </IonAvatar>
              </IonButtons>
              {x.twitterName}
              <BuyPriceBadge address={x?.address} />
            </IonItem>)}

          </IonList>
        </>
      } />
      <TribeContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd='6' offsetMd='3' sizeXs='12' >
              <IonRow>
                {Object.values(members).filter(x => x?.address !== '0x0000000000000000000000000000000000000000').filter(x => x?.twitterPfp).map((member, i) => <IonCol size='6' key={i}>
                  <IonCard routerLink={'/member/' + member?.address} style={{ aspectRatio: 1 }}>
                    <IonImg style={{ position: 'absolute' }} src={member?.twitterPfp || personOutline} />

                    <IonBadge color='light' style={{ position: 'absolute', bottom: 5, left: 5 }}>
                      {member?.twitterName}
                    </IonBadge>

                    {<BuyPriceBadge address={member?.address} style={{ position: 'absolute', top: 5, right: 5 }} />}
                    {/* <MemberGraph address={member!.address} /> */}
                  </IonCard>
                </IonCol>)}
              </IonRow>
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
