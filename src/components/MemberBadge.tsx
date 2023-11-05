import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonRouterLink, IonRow, IonText, IonTitle } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
import { useMember } from '../hooks/useMember';
import { useHistory } from 'react-router';
import { arrowDownCircle, person, personOutline, returnDownBack } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
import { timeAgo } from './TradeItem';
import { ReactElement } from 'react';
export const MemberBadge: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
    const member = useMember(x => x.getFriend(address))
    return <IonRouterLink routerDirection='none' routerLink={'/member/' + address}>
        {member && member !== null ? <IonChip color={color}>
            <IonAvatar>
                <IonImg onError={() => {

                }} src={member?.twitterPfp || personOutline} />
            </IonAvatar>
            <IonText>
                {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
            </IonText>
        </IonChip> : <IonChip>
            {address.slice(0, 4) + '...' + address.slice(38, 42)}
        </IonChip>}</IonRouterLink>
}

export const MemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol', style?: any }> = ({ address, color = undefined, size = 'big', style }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRouterLink style={style} routerLink={'/member/' + address} routerDirection='none'>
        <img src={member?.twitterPfp || personOutline} style={size == 'smol' ? { width: 40, height: 40, padding: 5, borderRadius: 15 } : size === 'veru-smol' ? { width: 20, height: 20, padding: 5, borderRadius: 10 } : { width: 100, height: 100, padding: 10, borderRadius: 20 }} />
    </IonRouterLink>
}

export const ChatMemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol', style?: any }> = ({ address, color = undefined, size = 'big', style }) => {
    const member = useMember(x => x.getFriend(address))

    return <img src={member?.twitterPfp || personOutline} style={size == 'smol' ? { width: '40px!important', height: '40px!important', minWidth: 40, maxWidth: 40, minHeight: 40, maxHeight: 40, padding: 5, borderRadius: 15 } : size === 'veru-smol' ? { width: 20, height: 20, padding: 5, borderRadius: 10 } : { width: 100, height: 100, padding: 10, borderRadius: 20 }} />
}
export const MemberAlias: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol' }> = ({ address, color = undefined, size = 'big' }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRouterLink routerLink={'/member/' + address} routerDirection='none'>
        {member?.twitterName}
    </IonRouterLink>
}
export const MemberToolbar: React.FC<{ address: string, color?: string, content?: ReactElement[] | ReactElement }> = ({ address, color = undefined, content }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonItem color='paper' lines='none' detail={false} routerLink={'/member/' + address}>

        <IonAvatar>
            <IonImg src={member?.twitterPfp || personOutline} />
        </IonAvatar>
        <IonGrid fixed>

            <IonRow>
                <IonText>
                    {member?.twitterName}
                </IonText>
            </IonRow>
            <IonRow>
                <IonText color='medium'>
                    @{member?.twitterUsername}
                </IonText>
            </IonRow>
        </IonGrid>
        {content ? <IonText className='ion-float-right'>
            {content}
        </IonText> : <></>}
    </IonItem>
}

export const MemberCardHeader: React.FC<{ address: string, color?: string, content?: ReactElement[] | ReactElement }> = ({ address, color = undefined, content }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRow>
        <IonRouterLink routerLink={'/member/' + address} routerDirection='none'>
            <img style={{ width: 37.5, height: 37.5, borderRadius: '10px', marginLeft: 2 }} src={member?.twitterPfp || personOutline} />
        </IonRouterLink>        
        <IonGrid fixed>
            <IonRow style={{ marginBottom: '2px', marginTop: '-1px'}}> {/* Reduced bottom margin */}
                <IonRouterLink routerLink={'/member/' + address}>
                    <IonText color='dark' style={{ fontSize: '16px' }}>
                        {member?.twitterName}
                    </IonText>
                </IonRouterLink>
            </IonRow>
            <IonRow style={{ marginTop: '-5px' }}> {/* Reduced top margin */}
                <IonRouterLink routerLink={'/member/' + address}>
                    <IonText color='medium' className='semibold' style={{ fontSize: '11px' }}>
                        @{member?.twitterUsername}
                    </IonText>
                </IonRouterLink>
            </IonRow>
            <IonRow>
                {content ? content : <></>}
            </IonRow>
        </IonGrid>
    </IonRow>
}

export const MemberBubble: React.FC<{ address: string, color?: string, message: string }> = ({ address, color = undefined }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRouterLink routerLink={'/member/' + address}>
        {member && member !== null ? <IonChip color={color}>
            <IonAvatar>
                <IonImg onError={() => {

                }} src={member?.twitterPfp || personOutline} />
            </IonAvatar>
            <IonText>
                {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
            </IonText>
        </IonChip> : <IonChip>
            {address.slice(0, 4) + '...' + address.slice(38, 42)}
        </IonChip>}</IonRouterLink>
}
export const MemberChip: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
    if (!address) {
        return <></>
    }
    const member = useMember(x => x.getFriend(address.toLowerCase()))
    return <IonChip color={color}>
        <IonAvatar>
            <IonImg src={member?.twitterPfp || personOutline} />
        </IonAvatar>
        <IonText>
            {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
        </IonText>
    </IonChip>
}