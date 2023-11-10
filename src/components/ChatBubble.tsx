import { IonButton, IonIcon, IonItem, IonText } from "@ionic/react";
import { returnDownBack } from "ionicons/icons";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { ChatMemberPfp, MemberAlias, MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const NewChatBubble: React.FC<{ message: Message, me: string, channel: string, reply: (messageId: string) => void }> = ({ message, me, channel, reply }) => {
    const isMe = me === message.author;

    const messageContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: isMe ? 'row-reverse' : 'row', // Layout direction based on the sender
        alignItems: 'flex-end', // Align items to the end (bottom for row layout)
        maxWidth: '70%', // Set a max width for the message container
    };

    const textBubbleStyle: React.CSSProperties = {
        maxWidth: '100%', // Maximum width for text bubble
        padding: '10px', // Padding around text
        paddingLeft: '15px',
        paddingRight: '15px',
        wordBreak: 'break-all' as 'break-all', // Use 'break-all' instead of 'break-word'
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%', // Image can fill the width of the chat container
        height: '200px', // Keep image aspect ratio
        // Additional styles as needed
    };

    const contentBubble = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
            {message.media && (
                <img className={(isMe ? "send" : "recieve") + ' msg image-msg'} style={imageStyle} src={message.media.src} />
            )}
            <div className={(isMe ? "send" : "recieve") + ' msg regular'} style={textBubbleStyle}>
                {message.content}
            </div>
        </div>
    );

    const replyButton = !isMe && (
        <button
            style={{ display: 'inline-block', margin: '0px!important', paddingLeft: 5, marginTop: 'auto', marginBottom: 'auto', padding: '0px!important', background: 'rgba(0,0,0,0)' }}
            onMouseDown={() => reply(message.id)}
            color='primary'

        >
            <IonIcon color='tertiary' icon={returnDownBack} />
        </button>
    );

    const profileAndAlias = (
        <div style={{
            display: 'flex',
            flexDirection: 'row', // This will align the items horizontally
            alignItems: 'center', // This will center the items vertically within the row
            fontSize: '12px',
        }}>
            {!isMe && (
                <ChatMemberPfp
                    size="veru-smol"
                    address={message.author}
                    style={{ marginRight: '5px', width: '20px', height: '20px' }} // Adjust sizes as needed
                />
            )}
            {!isMe && (
                <div style={{ lineHeight: '20px' }}> {/* Adjust line height to align text with image */}
                    <MemberAlias address={message.author} size='veru-smol' />
                    <span style={{ paddingLeft: 10 }}>
                        {timeAgo(new Date(message.sent !== null ? message.sent.seconds * 1000 : Date.now()))}
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <div className="message-container" key={message.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
        }}>
            {/* Render the reply if present */}
            {message.reply && <RenderReply messageId={message.reply} channel={channel} me={me} isReplyToMe={isMe} />}

            {/* Render the message content */}
            <div style={messageContainerStyle}>
                {contentBubble}
                {replyButton}

            </div>

            {/* Render the profile picture and username under the message */}
            {profileAndAlias}
        </div>
    );
}


export const RenderReply: React.FC<{ messageId: string, channel: string, isReplyToMe: boolean, me: string }> = ({ messageId, channel, me, isReplyToMe }) => {
    const message = useGroupMessages(x => x.replyMessages[channel].find(x => x.id === messageId) || x.groupMessages[channel].find(x => x.id === messageId))

    if (message === null || typeof message === 'undefined') {
        return null
    }
    const isMe = me === message.author;

    const contentBubble = !message.media ? <div key={messageId + 'content'} style={{ margin: '0px!important', font: 'Avenir', whiteSpace: 'pre-wrap' }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
        {message.content}
    </div> : <img key={messageId + 'img'} style={{ margin: '0px!important' }} className={(isMe ? "send" : "recieve") + ' reply msg image-msg regular'} height={50} src={message.media.src} />

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