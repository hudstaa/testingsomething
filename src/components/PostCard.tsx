import { IonBadge, IonButton, IonRow, IonGrid, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonRouterLink, IonText, IonToast } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { useMemo, useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader, MemberPfp, TwitterNameLink } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { paperPlane, share, shareOutline, shareSocialOutline, personOutline, arrowDown, arrowUp } from "ionicons/icons"
import { useNotifications } from "../hooks/useNotifications"
import { useHistory, useLocation } from "react-router"
import { useMember } from "../hooks/useMember"
import Linkify from "linkify-react"
import * as sugar from '../lib/sugar'
import 'linkify-plugin-mention';


export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    const { localCommentCount, commentAdded } = useNotifications()
    const newComments = localCommentCount[id] || 0;
    const member = useMember(x => x.getFriend(author));
    const { localNotif, setLocalNotif } = useNotifications()
    const { push } = useHistory();
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? 'light' : 'white';
    const { pathname } = useLocation()
    return  <IonCard  onMouseDown={(e) => {
        console.log(e.target)
        const isAlias = Array.from((e.target as any).classList).includes('alias')
        if ((e.target as any)?.nodeName === "VIDEO") {

            return;
        }
        if ((e.target as any)?.nodeName != 'VIDEO' && (e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            push('/post/' + id);
        }
    }} color={bgColor} key={id} style={{ marginTop: 12,marginBottom:0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, cursor: 'pointer!important' }} onClick={(e) => {

    }}>
        <IonCardHeader style={{ display: 'flex', cursor: 'pointer', paddingLeft: 16, paddingBottom: 12, paddingTop: 8, marginRight: 0 }}>
            <div style={{ display: 'flex' }}>
                <div style={{borderRadius: 100, marginTop: 4}}>
                    <MemberPfp color='dark' size="veru-smol" address={author}/>
                </div>
                <div style={{ marginLeft: 8}}>
                    <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
                </div>
            </div>
        </IonCardHeader>
        <IonCardContent style={{ paddingLeft: 16, paddingBottom: 1, paddingTop: 0, margin: 0,paddingRight: 16,  marginTop: -4 }}  >
            <div style={{paddingRight: 32}}>
            <IonText color='dark' className='regular' style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', letterSpacing: "-0.0135em" }} onClick={() => {
            }} >
                <Linkify options={{
                    render:({attributes,content,eventListeners,tagName})=>{
                        if(content.startsWith("$")){
                            const info = sugar.known_pairs[content.toLowerCase().slice(1)];
                            if(!info){
                                return <a {...attributes}>{content}</a>
                            }
                            return <a {...attributes}>{content}{info.emoji}</a>
                        }else if(content.startsWith("@")){
                            return <TwitterNameLink twitterName={content.toLowerCase().slice(1)}/>
                        }
                    }                    ,
                    formatHref:
                {                    
                    mention: (href) => "https://beta.tribe.computer/member/" + href.substring(1),
                }}}>
                {content}
                </Linkify>
                
                            </IonText>
                            </div>
            {media && (
                <div style={{ marginTop: 16, marginBottom: -10, marginRight: 0, overflow: 'hidden', borderRadius: '10px' }}>
                    {media.type.includes("image") ?
                        <img style={{ border: '1px solid var(--ion-color-medium-shade)', minWidth: '100%', maxHeight: 1000, borderRadius: 10 }} src={media.src} /> : <video preload="metadata" autoPlay={showComments} style={{ border: '1px solid var(--ion-color-light-tint)', minHeight: '100%', width: '100%', borderRadius: 10 }} controls src={media.src + '#t=0.6'} onPlay={(e: any) => { e.target.currentTime = 0 }} />}
                </div>
            )}
        </IonCardContent>


        {<IonRow style={{ marginTop: 12, borderTop: '1px solid var(--ion-color-medium-shade)', display: 'flex', justifyContent: 'space-between'}}>
            {<IonButton style={{ marginLeft: -1, marginBottom: 0, marginTop: -5, opacity: '50%' }} routerDirection="root" color='dark' fill="clear" onMouseDown={() => {
                open((message) => {
                    makeComment(id, message as any)
                }, "", "Comment", id)
            }}>
                 <IonIcon color={'medium'} icon={'/icons/msgo.svg'} style={{ height: 24, width: 24 }} /> 
                <IonText color={'medium'} className='medium' style={{ fontSize: "1rem", marginTop: 0, marginLeft: 4, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0}
                </IonText>
            </IonButton>}
            <IonButton style={{ marginLeft: -12, marginBottom: 0, marginTop: -5, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/send.svg'} style={{ height: 24, width: 24 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: -5, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/bookmark.svg'} style={{ height: 24, width: 24 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: -5, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/boost.svg'} style={{ height: 24, width: 24 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: -5, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/share.svg'} style={{ height: 25, width: 25 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>

        </IonRow>}
        <IonButton style={{ position: 'absolute', right: -10, top: -5 }} fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'}>
            <IonIcon icon={arrowUp} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'} style={{ height: 28, width: 28 }} />
        </IonButton>
        <IonLabel style={{
            position: 'absolute', right: 18.5, top: 40, fontSize: 15, fontVariantNumeric: 'tabular-nums'
        }} >
            <IonText color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'} className='black ion-text-center'>{score} </IonText>
        </IonLabel>
        <IonButton style={{ position: 'absolute', right: -10, top: 44 }} fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} >
            <IonIcon icon={arrowDown} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} style={{ height: 28, width: 28 }} />
        </IonButton>
        {showComments && <CommentList offset total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
}