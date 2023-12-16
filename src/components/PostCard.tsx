import { IonBadge, IonButton, IonRow, IonGrid, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonRouterLink, IonText, IonToast } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { useMemo, useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { paperPlane, share, shareOutline, shareSocialOutline, personOutline, arrowDown, arrowUp } from "ionicons/icons"
import { useNotifications } from "../hooks/useNotifications"
import { useHistory, useLocation } from "react-router"
import { useMember } from "../hooks/useMember"
import { usePost } from "../hooks/usePosts"


export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    const { localCommentCount, commentAdded } = useNotifications()
    const newComments = localCommentCount[id] || 0;
    const member = useMember(x => x.getFriend(author));
    const { localNotif, setLocalNotif } = useNotifications()
    const { push } = useHistory();
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgColor = darkmode ? 'paper' : 'white';
    const { pathname } = useLocation()
    return <IonCard onMouseDown={(e) => {
        console.log(e.target)
        const isAlias = Array.from((e.target as any).classList).includes('alias')
        if ((e.target as any)?.nodeName === "VIDEO") {

            return;
        }
        if ((e.target as any)?.nodeName != 'VIDEO' && (e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            push('/post/' + id);
        }
    }} color={bgColor} key={id} style={{ margin: 0, marginLeft: 0, marginRight: 0, paddingRight: 30, paddingBottom: 0, paddingLeft: 0, marginBottom: 5, cursor: 'pointer!important' }} onClick={(e) => {

    }}>

        <IonCardHeader style={{ cursor: 'pointer!important', paddingLeft: 12, paddingBottom: 1, paddingTop: 5, marginRight: 0 }}>
            <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
        </IonCardHeader>
        <IonCardContent style={{ paddingLeft: 12, paddingBottom: 1, paddingTop: 5, margin: 0 }}  >
            <IonText color='dark' className='text' style={{ whiteSpace: 'pre-wrap', fontSize: '20px', lineHeight: '1', letterSpacing: '-0.0135em' }} onClick={() => {
            }} >
                {content}
            </IonText>
            {media && (
                <div style={{ marginTop: 10, marginBottom: 0, marginRight: -8, overflow: 'hidden', borderRadius: '10px' }}>
                    {media.type.includes("image") ?
                        <img style={{ minWidth: '100%', maxHeight: 1000, borderRadius: 10 }} src={media.src} /> : <video preload="metadata" autoPlay={showComments} style={{ minHeight: '100%', width: '100%', borderRadius: 10 }} controls src={media.src + '#t=0.6'} onPlay={(e: any) => { e.target.currentTime = 0 }} />}
                </div>
            )}
        </IonCardContent>


        {<IonRow >
            {<IonButton style={{ margin: 0 }} routerDirection="root" color='medium' fill="clear" onMouseDown={() => {
                open((message) => {
                    makeComment(id, message as any)
                }, "", "Comment", id)
            }}>
                {/* <IonIcon color={'medium'} icon={'/icons/sq.svg'} style={{ height: 18, width: 18, marginLeft: '-5px' }} /> */}
                <IonText color={'medium'} className='semi' style={{ fontSize: 12, marginTop: 3, marginLeft: -4, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0} Comments
                </IonText>
            </IonButton>}
            <IonButton color='medium' fill='clear' size='small' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>
                <IonIcon icon={shareOutline} />
                <IonText className='semi' style={{ fontSize: 12, marginTop: 3 }}>
                    Share

                </IonText>
                {/* <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} /> */}
            </IonButton>

        </IonRow>}
        <div style={{ position: 'absolute', height: 120, width: 35, backgroundColor: 'var(--ion-color-paper)', borderRadius: 20, top: -5, right: -5 }}>

        </div>
        <IonButton style={{ position: 'absolute', right: -10, top: -5 }} fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'}>
            <IonIcon icon={arrowUp} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'} style={{ height: 28, width: 28 }} />
        </IonButton>
        <IonLabel style={{
            position: 'absolute', right: 19, top: 48, fontSize: 15, fontVariantNumeric: 'tabular-nums'
        }} >
            <IonText color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'tribe' : 'medium'} className='header ion-text-center'>{score} </IonText>
        </IonLabel>
        <IonButton style={{ position: 'absolute', right: -10, top: 55 }} fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} >
            <IonIcon icon={arrowDown} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'tribe' : 'medium'} style={{ height: 28, width: 28 }} />
        </IonButton>
        {showComments && <CommentList offset total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
}