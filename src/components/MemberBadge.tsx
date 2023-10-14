import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonCol, IonGrid, IonImg, IonItem, IonLabel, IonRouterLink, IonRow, IonText } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
import { useMember } from '../hooks/useMember';
import { useHistory } from 'react-router';
import { personOutline } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
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


export const ChatBubble: React.FC<{ message: string, address: string, isMe: boolean, sent: Timestamp }> = ({ message, address, isMe, sent }) => {
    const isMyMessage = false;
    const bubbleClass = isMyMessage ? 'my-bubble' : 'their-bubble';
    const friend = useMember(x => x.getFriend(address));
    return (
        <IonItem lines='none' className={'chat-item'} >
            {isMe ? <>
                <IonGrid fixed>
                    <IonRow >
                        <IonCol size='9' offset='2'>
                            <IonCard className='message-card ion-no-margin from-me'>
                                <IonCardContent>

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                            <div style={{ position: 'absolute', bottom: -7, right: -10 }} >
                                <IonAvatar style={{ float: 'right', width: 17, height: 17 }}>
                                    <IonImg src={friend?.twitterPfp} />
                                </IonAvatar>
                                <IonText color='tertiary' style={{ fontSize: 10 }}>
                                    {friend?.twitterName}
                                </IonText>
                            </div>


                        </IonCol>


                    </IonRow>
                </IonGrid>
            </> : <>
                <IonGrid fixed>
                    <IonRow >
                        <IonCol size='1'>
                        </IonCol>
                        <IonCol size='9'>
                            <IonCard className='message-card ion-no-margin'>
                                <IonCardContent>

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                </IonCardContent>
                            </IonCard>
                            <div style={{ position: 'absolute', bottom: -7, left: -10 }} >
                                <IonAvatar style={{ float: 'left', width: 17, height: 17 }}>
                                    <IonImg src={friend?.twitterPfp} />
                                </IonAvatar>
                                <IonText color='tertiary' style={{ fontSize: 10 }}>
                                    {friend?.twitterName}
                                </IonText>
                            </div>


                        </IonCol>


                    </IonRow>
                </IonGrid>
            </>
            }
        </IonItem >
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