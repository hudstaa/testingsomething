import { IonRow, IonGrid, IonCol, IonCard, IonCardContent, IonText, IonAvatar, IonImg, IonButton, IonIcon, IonSpinner, IonRouterLink } from "@ionic/react";
import { Timestamp } from "firebase/firestore";
import { person, returnDownBack } from "ionicons/icons";
import { useMember } from "../hooks/useMember";
import { MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const ChatBubble: React.FC<{ id: string, media?: { src: string, type: string }, message: string, address: string, isMe: boolean, sent: Timestamp, reply: (id: string) => void }> = ({ message, address, reply, isMe, sent, id, media }) => {
    const friend = useMember(x => x.getFriend(address));
    return (
        <IonRow key={id}>
            {isMe ? <>
                <IonGrid>
                    <IonRow >
                        <IonCol size='9' offset='2'>
                            <IonCard className='message-card ion-no-margin from-me'>
                                <IonCardContent className="message-card-content">
                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                        <IonImg src={media?.src} />
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
                            <div style={{ position: 'absolute', bottom: -10, left: 5 }}>
                                <IonRouterLink routerLink={"/member/" + friend?.address}>
                                    <IonAvatar >
                                        <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                    </IonAvatar>
                                </IonRouterLink>
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
                                <IonRouterLink routerLink={"/member/" + friend?.address}>
                                    <IonAvatar >
                                        <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                    </IonAvatar>
                                </IonRouterLink>
                            </div>
                        </IonCol>
                        <IonCol size='9'>

                            <IonCard className='message-card ion-no-margin'>
                                <IonCardContent className="message-card-content">

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                    {media && <IonImg src={media.src} />}

                                </IonCardContent>
                            </IonCard>

                            <IonButton onClick={() => {
                                reply(id)
                            }} color='tertiary' fill='clear' className='message-card ion-no-margin' style={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute' }}>
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
export const ChatBubbleWithReply: React.FC<{ id: string, media?: { src: string, type: string }, message: string, address: string, isMe: boolean, repliedTo: { id: string, content: string, media?: { src: string, type: string }, author: string, sent: Timestamp }, sent: Timestamp, reply: (id: string) => void }> = ({ message, address, reply, isMe, sent, id, repliedTo, media }) => {
    const friend = useMember(x => x.getFriend(address));
    if (typeof repliedTo === 'undefined') {
        return <IonSpinner />
    }
    return (
        <IonRow key={id}>
            {isMe ? <>
                <IonGrid>
                    <IonRow >
                        <IonCol size='9' offset='2'>
                            <IonCard className='message-card ion-no-margin from-me'>
                                <IonCardContent className="message-card-content">

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                    {media && <IonImg src={media.src} />}

                                </IonCardContent>
                            </IonCard>
                            <IonCard className='ion-no-margin message-card from-me' style={{ opacity: '70%' }}>
                                <IonCardContent className="message-card-content">
                                    {repliedTo.content && <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {repliedTo.content}
                                    </IonText>}
                                    {repliedTo.media && <IonImg style={{ width: 50 }} src={repliedTo.media.src} />}


                                </IonCardContent>
                                <div style={{ position: 'absolute', right: 10, zIndex: 1000000000000 }}>
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
                                <IonRouterLink routerLink={"/member/" + friend?.address}>
                                    <IonAvatar >
                                        <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                    </IonAvatar>
                                </IonRouterLink>
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
                                <IonRouterLink routerLink={"/member/" + friend?.address}>
                                    <IonAvatar >
                                        <IonImg style={{ width: 25, height: 25 }} src={friend?.twitterPfp || person} />
                                    </IonAvatar>
                                </IonRouterLink>
                            </div>
                        </IonCol>
                        <IonCol size='9'>

                            <IonCard className='message-card ion-no-margin'>
                                <IonCardContent className="message-card-content">

                                    <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {message}
                                    </IonText>
                                    {media && <IonImg src={media.src} />}

                                </IonCardContent>
                            </IonCard>
                            <IonCard className='ion-no-margin message-card' style={{ opacity: '70%' }}>
                                <IonCardContent className="message-card-content">
                                    {repliedTo.content && <IonText style={{ wordWrap: 'break-word', textWrap: 'break-word', maxWidth: '90%' }}>
                                        {repliedTo.content}
                                    </IonText>}
                                    {repliedTo.media && <IonImg style={{ height: 50 }} src={repliedTo.media.src} />}
                                </IonCardContent>
                                <IonText style={{ fontSize: 13, position: 'absolute', bottom: 0, left: 0 }} color='tertiary' >
                                    <IonRow>
                                    </IonRow>
                                </IonText>

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
