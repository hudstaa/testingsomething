import { IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonImg, IonItem, IonList, IonListHeader, IonRow, IonText, IonTitle } from '@ionic/react';
import { personOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { Address, formatEther } from 'viem';
import { TribeContent } from '../components/TribeContent';
import { TribeFooter } from '../components/TribeFooter';
import { TribeHeader } from '../components/TribeHeader';
import useBuyPass from '../hooks/useBuyPass';
import { useDiscover } from '../hooks/useDiscover';
import { useMember } from '../hooks/useMember';
import { useTitle } from '../hooks/useTitle';
import { TribePage } from './TribePage';
import { MemberGraph } from '../components/MemberGraph';


const BuyPriceBadge: React.FC<{ address: string | undefined }> = ({ address }) => {
  const { buyPrice } = useBuyPass(address as Address, 1n);
  return <IonBadge>
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
  return (
    <TribePage page='discover'>
      <TribeHeader title='Discover' color='primary' />
      <TribeContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd='6' offsetMd='3' sizeXs='12' >
              <IonRow>
                {Object.values(members).map((member, i) => <IonCol size='6' key={i}>
                  <IonCard routerLink={'/member/' + member?.address} style={{ aspectRatio: 1 }}>
                    <IonImg style={{ position: 'absolute' }} src={member?.twitterPfp || personOutline} />

                    <IonBadge color='light' style={{ position: 'absolute', bottom: 25, left: 25 }}>
                      {member?.twitterName}
                    </IonBadge>
                    {/* <MemberGraph address={member!.address} /> */}
                  </IonCard></IonCol>)}
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
