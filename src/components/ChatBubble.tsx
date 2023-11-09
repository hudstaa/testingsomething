import { IonButton, IonIcon, IonItem, IonText } from "@ionic/react";
import { returnDownBack } from "ionicons/icons";
import { useGroupMessages } from "../hooks/useGroupMessages";
import { Message } from "../models/Message";
import { ChatMemberPfp, MemberPfp } from "./MemberBadge";
import { timeAgo } from "./TradeItem";

export const NewChatBubble: React.FC<{ message: Message, me: string, channel: string, reply: (messageId: string) => void }> = ({ message, me, channel, reply }) => {
    const isMe = me === message.author;
    const contentBubble = !message.media ? <div style={{ margin: 0, whiteSpace: 'pre-wrap' }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
        {message.content}
    </div> : <div style={{ margin: 0, padding: 0 }}>
        <img className={(isMe ? "send" : "recieve") + ' msg image-msg'} height={'200px'} src={message.media.src} />
        {message.content && <div style={{ margin: 0 }} className={(isMe ? "send" : "recieve") + ' msg regular'}>
            {message.content}
        </div>}
    </div>

    const items = [
        !isMe ? <button style={{ margin: '0px!important', padding: 0, paddingRight: 5, paddingLeft: 5, background: 'rgba(0,0,0,0)' }} onClick={() => {
            reply(message.id);
        }} color='primary' >
            <IonIcon style={{ margin: 0 }} color='tertiary' icon={returnDownBack} />
        </button> : undefined
        , message.reply ? <RenderReply messageId={message.reply} channel={channel} me={me} isReplyToMe={isMe} />
            : undefined,
        <div style={{ margin: '0px!important' }}>
            {contentBubble}
        </div>
        , isMe ? <></> :
            <ChatMemberPfp size="smol" address={message.author} style={{ margin: '0px!important', width: '50px!important', height: '50px!important' }} />
        ,



    ]

    if (!isMe) {
        items.reverse();
    }
    return <div className="message-container" key={message.id} style={{ margin: '0px!important', alignItems: isMe ? 'right' : 'left', display: 'flex', justifyContent: isMe ? 'end' : 'start' }} >
        {items}
    </div >
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