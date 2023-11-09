import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonLabel, IonRouterLink, IonText, IonToast } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { useMemo, useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { share } from "ionicons/icons"
import { useNotifications } from "../hooks/useNotifications"



export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { localCommentCount } = useNotifications()
    const [notif, setNotif] = useState<string | null>(null);
    return <IonCard color='paper' key={id} style={{ margin: 0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, marginBottom: 5, cursor: 'pointer!important' }} onClick={(e) => {

    }}>

        <IonCardHeader style={{ paddingLeft: 12, paddingBottom: 3, paddingTop: 12, marginRight: 0 }}>
            <IonBadge color='paper' style={{ position: 'absolute', right: 8, top: 15 }}>
                <IonText color='tribel' className="regular" style={{ letterSpacing: '-.25px' }}>
                    {sent && timeAgo(new Date(sent.seconds * 1000))}
                </IonText>
            </IonBadge>
            <MemberCardHeader address={author} />
        </IonCardHeader>
        <IonRouterLink routerLink={"/post/" + id}>
            <IonCardContent style={{ paddingLeft: 12, paddingBottom: 0, paddingTop: 3, margin: 0 }}  >
                <IonRouterLink routerLink={'/post/' + id}>
                    <IonText color='dark' className='medium' style={{ whiteSpace: 'pre-wrap', padding: 0, fontSize: '18px', lineHeight: '1', fontWeight: 500, letterSpacing: '-0.0135em' }} onClick={() => {
                    }} >
                        {content}
                    </IonText>
                </IonRouterLink>
                {media && (
                    <div style={{ marginTop: 10, marginBottom: 2, marginRight: -8, overflow: 'hidden', borderRadius: '15px' }}>
                        <IonImg src={media.src} />
                    </div>
                )}
            </IonCardContent>
        </IonRouterLink>


        {<IonItem color='paper' lines="inset" style={{ marginRight: '-10px', marginLeft: '-6px'}}>
            <IonButton color='white' fill="clear" routerLink={'/post/' + id}>
                <IonIcon color={showComments ? 'tribe' : 'medium'} icon={'/icons/bubblechat.svg'} style={{ height: 35, width: 35, marginLeft: '-10px'}} />

                <IonText color={showComments ? 'white' : 'medium'} className="regular" style={{fontSize: 16 }}>
                    {commentCount}
                </IonText>
            </IonButton>
            <IonButtons slot='end'>
                <IonButton style={{ position: 'absolute', right: 55 }} fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} style={{ height: 30, width: 30 }} />
                </IonButton>

                <IonLabel style={{ position: 'absolute', marginTop: 1, paddingLeft: 1, right: 40, paddingRight: 4 }} >
                    <IonText className='bold'>{score} </IonText>
                </IonLabel>

                <IonButton style={{ position: 'absolute', right: 0 }} fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} style={{ height: 30, width: 30 }} />
                </IonButton>

            </IonButtons>
        </IonItem>}
        {showComments && <CommentList total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}

    </IonCard>
}