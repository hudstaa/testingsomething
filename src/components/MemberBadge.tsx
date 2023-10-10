import { IonAvatar, IonBadge, IonButtons, IonChip, IonCol, IonGrid, IonImg, IonItem, IonRouterLink, IonRow, IonText } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
import { useMember } from '../hooks/useMember';
import { useHistory } from 'react-router';
export const MemberBadge: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
    if (!address) {
        return <></>
    }
    const member = useMember(x => x.getFriend(address.toLowerCase()))
    return <IonRouterLink routerLink={'/member/' + address}>
        <IonChip color={color}>
            <IonAvatar>
                <IonImg src={member?.twitterPfpUrl} />
            </IonAvatar>
            <IonText>
                {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
            </IonText>
        </IonChip></IonRouterLink>
}
export const MemberChip: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
    if (!address) {
        return <></>
    }
    const member = useMember(x => x.getFriend(address.toLowerCase()))
    return <IonChip color={color}>
        <IonAvatar>
            <IonImg src={member?.twitterPfpUrl} />
        </IonAvatar>
        <IonText>
            {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
        </IonText>
    </IonChip>
}