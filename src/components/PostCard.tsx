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
export const CashTag: React.FC<{ content: string }> = ({ content }) => {
    const { setTradeUri } = useNotifications();
    const hit = sugar.known_pairs[content.substring(1).toLowerCase()]
    const emoji = hit && hit.emoji;
    const { push } = useHistory()
    return <a href={'javascript:void(0)'} onClick={() => {
        push({search:new URLSearchParams(hit.swap).toString(),pathname:'/swap'})
    }}>
        
        {content}
    </a>
}

export const PostCard: React.FC<{ onPostPage?: boolean, commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ onPostPage = false, hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    const { localCommentCount, commentAdded } = useNotifications()
    const newComments = localCommentCount[id] || 0;
    const member = useMember(x => x.getFriend(author));
    const { localNotif, setLocalNotif } = useNotifications()
    const { push } = useHistory();
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? 'tabblur' : 'white';
    const { pathname } = useLocation()
    const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    const [isTap, setIsTap] = useState(true);

    const cardStyle = onPostPage ? {
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        cursor: 'pointer!important'
    } : {
        borderBottom: '1px solid var(--ion-color-medium-shade)',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        cursor: 'pointer!important'
    };

    const gptRowStyle = onPostPage ? {
        borderBottom: '1px solid var(--ion-color-medium-shade)',
        marginBottom: 4,
        marginTop: -8,

        paddingLeft: 41, //testing TwitStyles

        display: 'flex',
        justifyContent: 'space-between'
    } : {
        marginTop: -8,
        marginBottom: -4,
        marginLeft: 41, //testing TwitStyles
        display: 'flex',
        justifyContent: 'space-between'
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
        setIsTap(true); // Assume it's a tap initially
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        // If the finger moves significantly, consider it a swipe
        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;
        if (Math.abs(moveX - touchStart.x) > 10 || Math.abs(moveY - touchStart.y) > 10) {
            setIsTap(false); // It's a swipe
        }
    };

    const handleTouchEnd = () => {
        if (isTap) {
            // It's a tap, handle click
            handleClick();
        }
        // Else, it's a swipe, and Swiper will handle it
    };

    const handleClick = () => {
        console.log("Post clicked");
        push('/post/' + id); // Navigate to the post
    };

    return  <div style={cardStyle} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}><IonCard  onMouseDown={(e) => {
        console.log(e.target)
        const classes = Array.from((e.target as any).classList);
        console.log(e.target);
        const isAlias = classes.includes('alias') || classes.includes('cashtag')
        if ((e.target as any)?.nodeName === "VIDEO") {
            return;
        }
        if ((e.target as any)?.tagName === "A") {
            return;
        }
        if ((e.target as any)?.nodeName != 'VIDEO' && (e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            push('/post/' + id);
        }
    }} color={bgColor} key={id} style={{ marginTop: 0,marginBottom:0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, cursor: 'pointer!important' }} onClick={(e) => {

    }}>
        <IonCardHeader style={{ display: 'flex', cursor: 'pointer', paddingLeft: 10, paddingBottom: 0, paddingTop: 8, marginRight: 0 }}>
            <div style={{ display: 'flex' }}>
                <div style={{borderRadius: 10, marginTop: 4}}>
                    <MemberPfp color='dark' size="veru-smol" address={author}/>
                </div>
                <div style={{ marginLeft: 4, marginTop: 0}}>
                    <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
                </div>
                
            </div>
        </IonCardHeader>
        <IonCardContent style={{ paddingLeft: 46, marginLeft: 0, paddingBottom: 1, paddingTop: 0, margin: 0, paddingRight: 16,  marginTop: '-10px' }}  >
            <div>
            <IonText color='dark' className='regular' style={{ whiteSpace: 'pre-wrap', fontSize: onPostPage ? '1.05rem' : '1rem', letterSpacing: '.0135em'}} onClick={() => {}}>
                <Linkify options={{
                    render:({attributes,content,eventListeners,tagName})=>{
                        if(content.startsWith("$")){
                            const info = sugar.known_pairs[content.toLowerCase().slice(1)];
                            if(!info){
                                return <a {...attributes}>{content}</a>
                            }
                            return <CashTag content={content}/>
                        }else if(content.startsWith("@")){
                            return <TwitterNameLink twitterName={content.toLowerCase().slice(1)}/>
                        }
                    },
                    formatHref:
                    {
                        mention: (href) => "https://tribe.computer/member/" + href.substring(1),
                    }
                }}>
                    {content}
                </Linkify>
                
                            </IonText>
                            </div>
            {media && (
                <div style={{ marginTop: 8, marginBottom: -4, marginRight: 0, overflow: 'hidden', borderRadius: '12px' }}>
                    {media.type.includes("image") ?
                        <img style={{ border: '1px solid var(--ion-color-medium-shade)', minWidth: '100%', maxHeight: 1000, borderRadius: 12 }} src={media.src} /> : <video preload="metadata" autoPlay={showComments} style={{ border: '1px solid var(--ion-color-light-tint)', minHeight: '100%', width: '100%', borderRadius: 10 }} controls src={media.src + '#t=0.6'} onPlay={(e: any) => { e.target.currentTime = 0 }} />}
                </div>
            )}
        </IonCardContent>


        {<IonRow className="GPT" style={gptRowStyle}>
            <IonButton style={{ marginLeft: -8, marginBottom: 0, marginTop:0}} routerDirection="root" color='dark' fill="clear" onMouseDown={() => {
            }}>
                 <IonIcon color={'medium'} icon={'/icons/msgo.svg'} style={{ height: 18, width: 18 }} /> 
                <IonText color={'medium'} className="medium" style={{ fontSize: ".9rem", marginTop: '1px', marginLeft: 4, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0}
                </IonText>
            </IonButton>
            <IonButton style={{ marginLeft: -14, marginBottom: 0, marginTop: 0}} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/send.svg'} style={{ marginTop: 1, height: 18, width: 18 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0}} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/bookmark.svg'} style={{ height: 18, width: 18 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0}} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/share.svg'} style={{ height: 19, width: 19 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <div style={{ marginLeft: '10%', marginRight: -2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downRE.svg' : '/icons/downGRE.svg'} style={{ marginRight: -12, height: 30, width: 30 }} />
                </IonButton>
                <IonLabel style={{
                    fontSize: '1.05rem', width: 24, paddingBottom: 2, alignItems: "middle", textAlign: 'center', fontVariantNumeric: 'tabular-nums'
                }} >
                    <IonText color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'} className='bold ion-text-center'>{score} </IonText>
                </IonLabel>
                <IonButton  fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'}>
                    <IonIcon icon={typeof voted === 'undefined' || voted === null || voted === -1 ? '/icons/upGRE.svg' : '/icons/upOR.svg'} style={{marginLeft: -12, marginRight: 0, height: 30, width: 30 }} />
                </IonButton>
            </div>
        </IonRow>}
        {showComments && <CommentList offset total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
    </div>
}