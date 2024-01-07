import { IonButton, IonIcon, IonItem, IonText } from "@ionic/react";
import { returnDownBack } from "ionicons/icons";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { ChatMemberPfp, MemberAlias, MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const NewChatBubble: React.FC<{ message: Message, me: string, channel: string, reply: (messageId: string) => void }> = ({ message, me, channel, reply }) => {
    const isMe = me === message.author;
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const bgColor = darkmode ? 'white' : 'black';

    const messageContainerStyle: React.CSSProperties = {
        display: 'flex',
        overflowWrap: 'break-word',
        flexDirection: isMe ? 'row-reverse' : 'row', // Layout direction based on the sender
        alignItems: 'flex-end', // Align items to the end (bottom for row layout)
        maxWidth: '75%', // Set a max width for the message container
    };

    const textBubbleStyle: React.CSSProperties = {
        maxWidth: '100%', // Maximum width for text bubble
        overflowWrap: 'break-word',
        paddingLeft: '8px',
        paddingRight: '10px',
        paddingTop: '3px',
        wordWrap: 'break-word', // Add this line
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%', // Image can fill the width of the chat container
        height: '200px',
        minWidth: '20px', // Keep image aspect ratio
        // Additional styles as needed
    };

    const alias = (
        <div style={{
            display: 'flex',
            flexDirection: 'column', // This will align the items horizontally
            fontSize: '13px',
            overflowWrap: 'break-word',
        }}>
            {!isMe && (
                <div style={{paddingLeft: 0, marginLeft: -3, marginTop: 0,marginBottom: -2, textAlign: 'left',lineHeight: '20px' }}> {/* Adjust line height to align text with image */}
                    <MemberAlias color={bgColor}address={message.author} />
                </div>
            )}
        </div>
    );    
    const time = (
        <div style={{
            display: 'flex',
            flexDirection: 'column', // This will align the items horizontally
            overflowWrap: 'break-word',
        }}>
            {
                    <span style={{ paddingLeft:32 ,textAlign: 'right', paddingTop: 0,marginRight: -4, marginBottom: -2, fontSize: '10px'}}>
                        {timeAgo(new Date(message.sent !== null ? message.sent.seconds * 1000 : Date.now()))}
                    </span>
            }
        </div>
    );    

    const contentBubble = (
        <div onClick={()=>{
            !isMe&&reply(message.id);
        }} style={{ 
            marginBottom: isMe ? 0 : 12, 
            paddingLeft: isMe ? 0 : 0, 
            overflowWrap: 'break-word',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: isMe ? 'flex-end' : 'flex-start' 
        }}>
            {message.media && (
                <img className={(isMe ? "send" : "recieve") + ' msg image-msg'} style={imageStyle} src={message.media.src} />
            )}
            <div className={(isMe ? "send" : "recieve") + ' msg regular'} style={textBubbleStyle}>
                {alias}
                {message.content}
                {time}
            </div>
        </div>
    );
    const replyButton = !isMe && (
        <button
            style={{ display: 'inline-block', margin: '0px!important', paddingLeft: 8  ,verticalAlign:'center', padding: '0px!important', background: 'rgba(0,0,0,0)' }}
            color='primary'

        >
            <IonIcon color='tertiary' icon={returnDownBack} />
        </button>
    );
    const profile = (
        <div style={{
            display: 'flex',
            top: 0,
            minWidth: '28px',
            paddingTop: 1,
            width: '28px',
            height: '28px',
            flexDirection: 'column', // This will align the items horizontally
            fontSize: '12px',
            marginRight: 4,
            marginLeft: 4,
            overflowWrap: 'break-word',
        }}>
            {!isMe && (
                <ChatMemberPfp
                    size="smol"
                    address={message.author}
                />
            )}
        </div>
    );

    const combinedBubble = (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            {profile}
            {contentBubble}
            {/* {replyButton} */}
        </div>
    );
    
    return (
        <div className="message-container" key={message.id} style={{
            display: 'flex',
            paddingRight: 4,
            paddingBottom: 2,
            flexDirection: 'column',
            overflowWrap: 'break-word',
            alignItems: isMe ? 'flex-end' : 'flex-start',
        }}>
            {/* Render the reply if present */}
            {message.reply && <RenderReply messageId={message.reply} channel={channel} me={me} isReplyToMe={isMe} />}

            {/* Render the message content */}
            <div style={messageContainerStyle}>
                {isMe ? contentBubble : combinedBubble}
            </div>
        </div>
    );
}


export const RenderReply: React.FC<{ messageId: string, channel: string, isReplyToMe: boolean, me: string }> = ({ messageId, channel, me, isReplyToMe }) => {
    const message = useGroupMessages(x => x.replyMessages[channel].find(x => x.id === messageId) || x.groupMessages[channel].find(x => x.id === messageId))

    if (message === null || typeof message === 'undefined') {
        return null
    }
    const isMe = me === message.author;

    const contentBubble = !message.media ? <div key={messageId + 'content'} style={{ margin: '0px', paddingTop: 4, paddingBottom: 10, font: 'Avenir', whiteSpace: 'pre-wrap' }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
        {message.content}
    </div> : <img key={messageId + 'img'} style={{ margin: '0px!important' }} className={(isMe ? "send" : "recieve") + ' reply msg image-msg regular'} height={50} src={message.media.src} />

    const items = [
        // <ChatMemberPfp style={{ margin: '0px!important', position: 'absolute', bottom: 0, left: !isMe ? -20 : undefined, right: !isMe ? undefined : -20 }} size="veru-smol" address={message.author} />
        , contentBubble]

    if (!isReplyToMe) {
        items.reverse();
    }
    return <div style={{ margin: '0px!important', maxWidth: '50%', whiteSpace: 'pre-wrap', marginLeft: 40, marginBottom: 4 }} key={'reply' + message.id}>
        {items}
    </div>
}