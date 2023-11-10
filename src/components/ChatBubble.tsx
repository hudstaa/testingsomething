import { IonButton, IonIcon, IonItem, IonText } from "@ionic/react";
import { returnDownBack } from "ionicons/icons";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { ChatMemberPfp, MemberAlias, MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const NewChatBubble: React.FC<{ message: Message, me: string, channel: string, reply: (messageId: string) => void }> = ({ message, me, channel, reply }) => {
    const isMe = me === message.author;

    // Style for the container of the message and the profile picture
    const messageContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        maxWidth: '70%',
        padding: '5px',

    };

    // Style for the text bubble
    const textBubbleStyle: React.CSSProperties = {
        maxWidth: '100%',
        padding: '10px',
        borderTopLeftRadius: '12px', // Optional: to make it look like a bubble
        borderTopRightRadius: '12px', // Optional: to make it look like a bubble
        borderBottomLeftRadius: isMe ? '12px' : '2px',
        borderBottomRightRadius: isMe ? '2px' : '12px',
        backgroundColor: isMe ? 'var(--ion-color-paper)' : 'var(--ion-color-paper)', // Optional: different background for sender and receiver
        marginLeft: isMe ? '0' : '5px', // Make space for the profile picture if not 'me'
    };

    // Style for the profile picture
    const profilePictureStyle: React.CSSProperties = {
        width: '30px', // Adjusted for a visible profile picture
        height: '30px',
        alignSelf: 'end',
        display: isMe ? 'none' : 'flex', // Hide the profile picture if 'me'
    };

    // Construct the content bubble with the alias and the message content
    const contentBubble = (
        <div style={textBubbleStyle}>
            {!isMe && (
                <div style={{ fontSize: '12px' }}>
                    <MemberAlias address={message.author} size='smol' />
                </div>
            )}
            {message.media && (
                <img className={(isMe ? "send" : "recieve") + ' msg image-msg'} style={{ maxWidth: '100%', height: '200px' }} src={message.media.src} />
            )}
            <div className={(isMe ? "send" : "recieve") + ' msg regular'}>
                {message.content}
            </div>
        </div>
    );

    const replyButton = !isMe && (
        <button
            style={{ display: 'inline-block', margin: '0px!important', paddingLeft: 5, marginTop: 'auto', marginBottom: 'auto', padding: '0px!important', background: 'rgba(0,0,0,0)' }}
            onClick={() => reply(message.id)}
            color='primary'

        >
            <IonIcon color='tertiary' icon={returnDownBack} />
        </button>
    );

    const profileAndAlias = (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: '12px',
            marginBottom: '5px', // Add space between alias and message bubble
        }}>
            {!isMe && (
                <>
                    <ChatMemberPfp
                        size="veru-smol"
                        address={message.author}
                        style={{ marginRight: '5px', width: '20px', height: '20px' }}
                    />
                    <div style={{ lineHeight: '20px' }}>
                        <MemberAlias address={message.author} size='veru-smol' />
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="message-container" key={message.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
        }}>
            {message.reply && <RenderReply messageId={message.reply} channel={channel} me={me} isReplyToMe={isMe} />}
            <div style={messageContainerStyle}>
                {!isMe && <ChatMemberPfp size="smol" address={message.author} style={profilePictureStyle} />}
                {contentBubble}
                {replyButton}
            </div>
        </div>
    );
};

export const RenderReply: React.FC<{ messageId: string, channel: string, isReplyToMe: boolean, me: string }> = ({ messageId, channel, me, isReplyToMe }) => {
    const message = useGroupMessages(x => x.replyMessages[channel].find(x => x.id === messageId) || x.groupMessages[channel].find(x => x.id === messageId))

    if (message === null) {
        return <>NULL</>
    }
    if (typeof message === 'undefined') {
        return <>undefined</>
    }
    const isMe = me === message.author;

    const contentBubble = !message.media ? <div style={{ margin: '0px!important', font: 'Avenir', whiteSpace: 'pre-wrap' }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
        {message.content}
    </div> : <><img style={{ margin: '0px!important' }} className={(isMe ? "send" : "recieve") + ' reply msg image-msg regular'} height={50} src={message.media.src} /></>

    const items = [
        // <ChatMemberPfp style={{ margin: '0px!important', position: 'absolute', bottom: 0, left: !isMe ? -20 : undefined, right: !isMe ? undefined : -20 }} size="veru-smol" address={message.author} />
        , contentBubble]

    if (!isReplyToMe) {
        items.reverse();
    }
    return <div style={{ margin: '0px!important', whiteSpace: 'pre-wrap' }} key={'reply' + message.id}>
        {items}
    </div>
}