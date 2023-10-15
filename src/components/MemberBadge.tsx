import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonGrid, IonImg, IonItem, IonLabel, IonRouterLink, IonRow, IonText, IonTitle } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
import { useMember } from '../hooks/useMember';
import { useHistory } from 'react-router';
import { person, personOutline } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
import { timeAgo } from './TradeItem';
export const MemberBadge: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
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

export const MemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' }> = ({ address, color = undefined, size = 'big' }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonAvatar style={size == 'smol' ? { width: 40, height: 40 } : undefined}>
        <IonImg src={member?.twitterPfp || personOutline} />
    </IonAvatar>
}
export const MemberToolbar: React.FC<{ address: string, color?: string }> = ({ address, color = undefined }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRouterLink routerLink={'/member/' + address}>
        <IonRow>
            <IonCol size='3'>
                <IonAvatar>
                    <IonImg src={member?.twitterPfp || personOutline} />
                </IonAvatar>
            </IonCol>
            <IonCol>
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
            </IonCol>
        </IonRow>
    </IonRouterLink>
}


export const ChatBubble: React.FC<{ message: string, address: string, isMe: boolean, sent: Timestamp }> = ({ message, address, isMe, sent }) => {
    const isMyMessage = false;
    const bubbleClass = isMyMessage ? 'my-bubble' : 'their-bubble';
    const friend = useMember(x => x.getFriend(address));
    return (
        <IonRow>
            {isMe ? <>
                <IonGrid>
                    <IonRow >
                        <IonCol size='9' offset='2'>
                            <IonCard className='message-card ion-no-margin from-me'>
                                <IonCardContent>

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                            <IonText style={{ fontSize: 13, position: 'absolute', bottom: -10, right: 10 }} color='tertiary' >
                                {friend?.twitterName} {timeAgo(new Date(sent.seconds * 1000))}
                            </IonText>
                        </IonCol>
                        <IonCol
                            size='1'
                        >
                            <div style={{ position: 'absolute', bottom: 0, left: 5 }}>
                                <IonAvatar >
                                    <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                </IonAvatar>
                            </div>
                        </IonCol>

                    </IonRow>
                </IonGrid>
            </> : <>
                <IonGrid>
                    <IonRow >
                        <IonCol
                            size='1'
                        >
                            <div style={{ position: 'absolute', bottom: 0, right: -20 }}>
                                <IonAvatar >
                                    <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                </IonAvatar>
                            </div>
                        </IonCol>
                        <IonCol size='9'>
                            <IonCard className='message-card ion-no-margin'>
                                <IonCardContent>

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                            <IonText style={{ fontSize: 13, position: 'absolute', bottom: -10, left: 10 }} color='tertiary' >
                                {friend?.twitterName} {timeAgo(new Date(sent.seconds * 1000))}
                            </IonText>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </>
            }
        </IonRow >
    );
};

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