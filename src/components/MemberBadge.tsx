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

export const MemberPfp: React.FC<{ address: string, color?: string, size?: 'smol' | 'big' | 'veru-smol' }> = ({ address, color = undefined, size = 'big' }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonRouterLink routerLink={'/member/' + address}><IonAvatar style={size == 'smol' ? { width: 40, height: 40, padding: 5 } : size === 'veru-smol' ? { width: 20, height: 20, padding: 5 } : undefined}>
        <IonImg style={{ cursor: 'pointer' }} src={member?.twitterPfp || personOutline} />
    </IonAvatar></IonRouterLink>
}
export const MemberToolbar: React.FC<{ address: string, color?: string, content?: ReactElement[] | ReactElement }> = ({ address, color = undefined, content }) => {
    const member = useMember(x => x.getFriend(address))

    return <IonItem color='light' lines='none' detail={false} routerLink={'/member/' + address}>

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

    return <IonRouterLink routerLink={'/member/' + address}><IonRow>

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
    </IonRow></IonRouterLink>
}

export const ChatBubble: React.FC<{ id: string, message: string, address: string, isMe: boolean, sent: Timestamp, reply: (id: string) => void }> = ({ message, address, reply, isMe, sent, id }) => {
    const friend = useMember(x => x.getFriend(address));
    return (
        <IonRow key={id}>
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

                            <IonButton onClick={() => {
                                reply(id)
                            }} color='tertiary' fill='clear' className='message-card ion-no-margin' style={{ top: '50%', postion: 'absolute', transform: 'translateY(-50%)' }}>
                                <IonIcon icon={returnDownBack} />
                            </IonButton>
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
export const ChatBubbleWithReply: React.FC<{ id: string, message: string, address: string, isMe: boolean, repliedTo: { id: string, content: string, author: string, sent: Timestamp }, sent: Timestamp, reply: (id: string) => void }> = ({ message, address, reply, isMe, sent, id, repliedTo }) => {
    const friend = useMember(x => x.getFriend(address));
    return (
        <IonRow key={id}>
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
                            <IonCard className='ion-no-margin message-card from-me' style={{ opacity: '70%' }}>
                                <IonCardContent>
                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {repliedTo.content}
                                    </IonText>
                                </IonCardContent>
                                <IonText style={{ fontSize: 13, position: 'absolute', bottom: 0, left: 0 }} color='tertiary' >
                                    <IonRow>
                                    </IonRow>
                                </IonText>
                                <div style={{ position: 'absolute', right: 10, bottom: 0, zIndex: 1000000000000 }}>
                                    <MemberPfp address={repliedTo.author} size='veru-smol' />
                                </div>

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
                            <IonCard className='ion-no-margin message-card' style={{ opacity: '70%' }}>
                                <IonCardContent>
                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {repliedTo.content}
                                    </IonText>
                                </IonCardContent>
                                <IonText style={{ fontSize: 13, position: 'absolute', bottom: 0, left: 0 }} color='tertiary' >
                                    <IonRow>
                                    </IonRow>
                                </IonText>
                                <div style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 1000000000000 }}>
                                    <MemberPfp address={repliedTo.author} size='veru-smol' />
                                </div>

                            </IonCard>
                            <IonText style={{ fontSize: 13, position: 'absolute', bottom: 15, left: 10 }} color='tertiary' >
                                {friend?.twitterName} {timeAgo(new Date(sent.seconds * 1000))}
                            </IonText>
                            <IonButton onClick={() => {
                                reply(id)
                            }} color='tertiary' fill='clear' className='message-card ion-no-margin' style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                <IonIcon icon={returnDownBack} />
                            </IonButton>
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