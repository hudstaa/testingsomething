import { IonAvatar, IonBadge, IonButtons, IonCol, IonGrid, IonImg, IonItem, IonRow } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
import { useMember } from '../hooks/useMember';
import { MemberBadge } from './MemberBadge';
import { MemberStats } from '../models/Stats';
export const StatItem: React.FC<{ stats: MemberStats }> = ({ stats }) => {
    const member = useMember(x => x.getFriend(stats.address))
    return <IonItem lines={'none'} detail key={stats.address} routerLink={'/member/' + stats.address}>
        <IonAvatar>
            <IonImg src={member?.twitterPfpUrl} />
        </IonAvatar>
        <IonGrid>
            <IonRow>
                {stats.address}
            </IonRow>
            <IonRow>
                <IonBadge>
                    {formatUnits(stats.price, 18)}ETH
                </IonBadge>
            </IonRow>
        </IonGrid>
        <IonButtons slot='end'>
            <IonRow>
            </IonRow>
            <IonRow>
                <IonBadge color={stats.change24hour > 0n ? "success" : "danger"}>
                    {formatUnits(stats.change24hour, 18)}ETH
                </IonBadge>
            </IonRow>
        </IonButtons>
    </IonItem>
}