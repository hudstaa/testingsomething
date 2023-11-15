import { IonBadge, IonButton, IonRow, IonGrid, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonItemDivider, IonLabel, IonRouterLink, IonText, IonToast } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { useMemo, useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { paperPlane, share, shareOutline, shareSocialOutline, personOutline } from "ionicons/icons"
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
        if ((e.target as any)?.nodeName != 'ION-BUTTON' && (e.target as any)?.parentNode?.nodeName !== 'ION-BUTTON' && !isAlias) {
            push('/post/' + id);
        }
    }} color={bgColor} key={id} style={{ margin: 0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, marginBottom: 5, cursor: 'pointer!important' }} onClick={(e) => {

    }}>

        <IonCardHeader style={{ cursor: 'pointer!important', paddingLeft: 12, paddingBottom: 1, paddingTop: 5, marginRight: 0 }}>
            <MemberCardHeader address={author} content={<>{sent !== null && sent?.seconds && timeAgo(new Date(sent.seconds * 1000))}</>} />
        </IonCardHeader>
        <IonRouterLink routerDirection="root" routerLink={"/post/" + id}>
            <IonCardContent style={{ paddingLeft: 12, paddingBottom: 1, paddingTop: 1, margin: 0 }}  >
                <IonRouterLink routerDirection="root" routerLink={'/post/' + id}>
                    <IonText color='dark' className='text' style={{ whiteSpace: 'pre-wrap', fontSize: '20px', lineHeight: '1', letterSpacing: '-0.0135em' }} onClick={() => {
                    }} >
                        {content}
                    </IonText>
                </IonRouterLink>
                {media && (
                    <div style={{ marginTop: 10, marginBottom: 0, marginRight: -8, overflow: 'hidden', borderRadius: '10px' }}>
                        {media.type.includes("image") ?
                            <img style={{ minWidth: '100%', maxHeight: 1000, borderRadius: 10 }} src={media.src} /> : <video autoPlay muted style={{ minHeight: '100%', width: '100%', borderRadius: 10 }} controls src={media.src} />}
                    </div>
                )}
            </IonCardContent>
        </IonRouterLink>


        {<IonItem color='paper' lines="inset" style={{ marginRight: '-10px', marginLeft: '-6px' }}>
            {<IonButton style={{ margin: 0 }} routerDirection="root" color='white' fill="clear" onMouseDown={() => {
                open((message) => {
                    makeComment(id, message as any)
                }, "", "Comment", id)
            }}>
                <IonIcon color={'medium'} icon={'/icons/sq.svg'} style={{ height: 18, width: 18, marginLeft: '-5px' }} />
                <IonText color={'medium'} className='header' style={{ fontSize: 14, marginTop: 3, paddingLeft: 5, color: 'var(--ion-color-soft)' }}>
                    {typeof commentCount !== 'undefined' ? commentCount + newComments : newComments + 0}
                </IonText>
            </IonButton>}
            <IonButton fill='clear' onMouseDown={() => {
                setLocalNotif("Copied to share link to clipboard")
                navigator.clipboard.writeText('https://tribe.computer/post/' + id)
            }}>

                <IonIcon icon={'/icons/se.svg'} style={{ height: 18, width: 18, marginTop: 2, marginLeft: '-7px', color: 'var(--ion-color-soft)' }} />
            </IonButton>


            <IonButtons slot='end'>
                <IonButton style={{ position: 'absolute', right: 55 }} fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} style={{ height: 28, width: 28 }} />
                </IonButton>

                <IonLabel style={{ position: 'absolute', marginTop: 1, paddingLeft: 1, right: 40, paddingRight: 4 }} >
                    <IonText className='header'>{score} </IonText>
                </IonLabel>

                <IonButton style={{ position: 'absolute', right: 0 }} fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} style={{ height: 28, width: 28 }} />
                </IonButton>

            </IonButtons>
        </IonItem>}
        {showComments && <CommentList total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
}