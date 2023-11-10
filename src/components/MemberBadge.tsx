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
    const { push } = useHistory();
    return member && member !== null ? <IonChip onMouseDown={() => {
        push('/member/' + address);
    }} color={color}>
        <IonAvatar>
            <IonImg onError={() => {

            }} src={member?.twitterPfp || personOutline} />
        </IonAvatar>
        <IonText>
            {member?.twitterName || address.slice(0, 4) + "..." + address.slice(38, 42)}
        </IonText>
    </IonChip> : <IonChip>
        {address.slice(0, 4) + '...' + address.slice(38, 42)}
    </IonChip>
}

export const MemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol' | 'double-smol', style?: any }> = ({ address, color = undefined, size = 'big', style }) => {
    const member = useMember(x => x.getFriend(address));

    let pfpStyle = {};
    switch (size) {
        case 'smol':
            pfpStyle = { width: 30, height: 30, padding: 0, borderRadius: 7 };
            break;
        case 'veru-smol':
            pfpStyle = { width: 20, height: 20, padding: 0, borderRadius: 10 };
            break;
        case 'double-smol':
            pfpStyle = { width: 48, height: 48, padding: 0, borderRadius: 10 };
            break;
        case 'big':
        default:
            pfpStyle = { width: 100, height: 100, padding: 10, borderRadius: 20 };
            break;
    }

    return <IonRouterLink style={{ ...style, ...pfpStyle }} routerLink={'/member/' + address} routerDirection='none'>
        <img src={member?.twitterPfp || personOutline} style={pfpStyle} />
    </IonRouterLink>
}

export const ChatMemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol' | 'double-smol', style?: any }> = ({ address, color = undefined, size = 'big', style }) => {
    const member = useMember(x => x.getFriend(address));

    let pfpStyle = {};
    switch (size) {
        case 'smol':
            pfpStyle = { width: 30, height: 30, padding: 0, borderRadius: 7 };
            break;
        case 'veru-smol':
            pfpStyle = { width: 15, height: 15, padding: 0, borderRadius: 15 };
            break;
        case 'double-smol':
            pfpStyle = { width: 40, height: 40, padding: 0, borderRadius: 10 };
            break;
        case 'big':
        default:
            pfpStyle = { width: 100, height: 100, padding: 10, borderRadius: 20 };
            break;
    }

    return <img src={member?.twitterPfp || personOutline} style={{ ...style, ...pfpStyle }} />
}

export const MemberAlias: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol' }> = ({ address, color = undefined, size = 'big' }) => {
    const member = useMember(x => x.getFriend(address))
    const { push } = useHistory();
    return <IonText style={{ margin: 0, padding: 0 }} onMouseDown={() => {
        push('/member/' + address);
    }} color='dark'>
        {member?.twitterName}
    </IonText>
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
    const { push } = useHistory();
    return <IonRow>
        <IonGrid fixed style={{ paddingLeft: 0 }}>
            <IonRow >
                <IonButton fill='clear' onMouseDown={() => {
                    push('/member/' + member!.address);
                }} color='medium' className='medium' style={{ fontSize: '11px', margin: 0 }}>
                    @{member?.twitterUsername}
                </IonButton>
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