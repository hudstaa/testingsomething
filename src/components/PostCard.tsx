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
        marginTop: 16,
        marginBottom: 4,
        display: 'flex',
        justifyContent: 'space-between'
    } : {
        marginTop: 0,
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
        const isAlias = Array.from((e.target as any).classList).includes('alias')
        if ((e.target as any)?.nodeName === "VIDEO") {

            return;
        }
        if ((e.target as any)?.nodeName != 'VIDEO' && (e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            push('/post/' + id);
        }
    }} color={bgColor} key={id} style={{ marginTop: 0,marginBottom:0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, cursor: 'pointer!important' }} onClick={(e) => {

    }}>
        <IonCardHeader style={{ display: 'flex', cursor: 'pointer', paddingLeft: 16, paddingBottom: 12, paddingTop: 8, marginRight: 0 }}>
            <div style={{ display: 'flex' }}>
                <div style={{borderRadius: 10, marginTop: 4}}>
                    <MemberPfp color='dark' size="veru-smol" address={author}/>
                </div>
                <div style={{ marginLeft: 8}}>
                    <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
                </div>
                
            </div>
        </IonCardHeader>
        <IonCardContent style={{ paddingLeft: 16, paddingBottom: 1, paddingTop: 0, margin: 0,paddingRight: 16,  marginTop: -4 }}  >
            <div>
            <IonText color='dark' className='medium' style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', letterSpacing: "-0.0235em" }} onClick={() => {
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


        {<IonRow className="GPT" style={gptRowStyle}>
            <IonButton style={{ marginLeft: -1, marginBottom: 0, marginTop:0, opacity: '50%' }} routerDirection="root" color='dark' fill="clear" onMouseDown={() => {
            }}>
                 <IonIcon color={'medium'} icon={'/icons/msgo.svg'} style={{ height: 20, width: 20 }} /> 
                <IonText color={'medium'} className="fab" style={{ fontSize: "1rem", marginTop: 0, marginLeft: 4, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0}
                </IonText>
            </IonButton>
            <IonButton style={{ marginLeft: -14, marginBottom: 0, marginTop: 0, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/send.svg'} style={{ height: 20, width: 20 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/bookmark.svg'} style={{ height: 20, width: 20 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <IonButton style={{ marginLeft: 0, marginBottom: 0, marginTop: 0, opacity: '50%' }} color='dark' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={'/icons/share.svg'} style={{ height: 21, width: 21 }}/>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>
            <div style={{ marginLeft: '20%', marginRight: -8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/ardoo.svg' : '/icons/ardo.svg'} style={{ marginRight: -8, height: 20, width: 20 }} />
                </IonButton>
                <IonLabel style={{
                    fontSize: 20, width: 24, alignItems: "middle", textAlign: 'center', fontVariantNumeric: 'tabular-nums'
                }} >
                    <IonText color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'tribe'} className='header ion-text-center'>{score} </IonText>
                </IonLabel>
                <IonButton  fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'}>
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/arup.svg' : '/icons/arupo.svg'} style={{marginLeft: -8, marginRight: 0, height: 20, width: 20 }} />
                </IonButton>
            </div>
        </IonRow>}
        {showComments && <CommentList offset total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
    </div>
}