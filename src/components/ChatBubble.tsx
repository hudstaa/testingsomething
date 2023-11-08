import { IonButton, IonIcon, IonItem, IonText } from "@ionic/react";
import { returnDownBack } from "ionicons/icons";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { ChatMemberPfp, MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const NewChatBubble: React.FC<{ message: Message, me: string, channel: string, reply: (messageId: string) => void }> = ({ message, me, channel, reply }) => {
    const isMe = me === message.author;

    const bubbleAndButtonContainerStyle = {
        display: 'flex',
        alignItems: 'center', // Vertically align the content bubble and reply button
        // Adjust the width to account for the profile picture
    };

    const contentBubble = (
        <div style={{ maxWidth: '70%', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
            {message.media && (
                <img className={(isMe ? "send" : "recieve") + ' msg image-msg'} style={{ maxWidth: '100%', height: 'auto' }} src={message.media.src} />
            )}
            <div className={(isMe ? "send" : "recieve") + ' msg regular'} style={{ margin: 0 }}>
                {message.content}
            </div>
        </div>
    );

    const replyButton = !isMe && (
        <button
            style={{ margin: '0px!important', padding: '0px!important', background: 'rgba(0,0,0,0)' }}
            onClick={() => reply(message.id)}
            color='primary'
        >
            <IonIcon color='tertiary' icon={returnDownBack} />
        </button>
    );

    const profilePic = isMe ? <></> : (
        <ChatMemberPfp
            size="smol"
            address={message.author}
            style={{ margin: '0px!important', width: '50px!important', height: '50px!important' }}
        />
    );
    return (
        <div className="message-container" key={message.id} style={{
            margin: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
        }} >
            {/* Render the reply if present */}
            {message.reply && <RenderReply messageId={message.reply} channel={channel} me={me} isReplyToMe={isMe} />}
            {/* Render the message content with the profile picture */}
            <div style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                {profilePic}
                {contentBubble}
            </div>
            {replyButton}
        </div>
    );
}


export const RenderReply: React.FC<{ messageId: string, channel: string, isReplyToMe: boolean, me: string }> = ({ messageId, channel, me, isReplyToMe }) => {
    const message = useGroupMessages(x => x.replyMessages[channel].find(x => x.id === messageId) || x.groupMessages[channel].find(x => x.id === messageId))

    if (message === null) {
        return <>NULL</>
    }
    if (typeof message === 'undefined') {
        return <>undefined</>
    }
    const isMe = me === message.author;

    const contentBubble = !message.media ? <div style={{ margin: '0px!important', font: 'Avenir' }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
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