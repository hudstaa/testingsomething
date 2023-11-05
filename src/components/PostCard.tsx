import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonIcon, IonImg, IonItem, IonLabel, IonRouterLink, IonText } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"



export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    return <IonCard color='paper' key={id} style={{ margin: 0, marginLeft: 0, marginRight: 0, paddingRight: 0, paddingBottom: 2, paddingLeft: 0, marginBottom: 5, cursor: 'pointer!important' }} onClick={(e) => {

    }}>

        <IonCardHeader style={{ paddingLeft: 13, paddingBottom: 3, paddingTop: 12, marginLeft: -2, marginRight: -2 }}>
            <IonBadge color='paper' style={{ position: 'absolute', right: 13, top: 20 }}>
                <IonText color='tribel' className="regular" style={{ letterSpacing: '-.25px' }}>
                    {sent && timeAgo(new Date(sent.seconds * 1000))}
                </IonText>
            </IonBadge>
            <MemberCardHeader address={author} />
        </IonCardHeader>
        <IonRouterLink routerLink={"/post/" + id}>
            <IonCardContent style={{ paddingLeft: 15, paddingBottom: 0, paddingTop: 3, margin: 0 }}  >
                <IonRouterLink routerLink={'/post/' + id}>
                    <IonText color='dark' style={{ whiteSpace: 'pre-wrap', padding: 0, fontSize: '17.5px' }} onClick={() => {
                    }} >
                        {content}
                    </IonText>
                </IonRouterLink>
                {media && (
                    <div style={{ marginTop: 10, marginBottom: 2, marginRight: -4, overflow: 'hidden', borderRadius: '10px' }}>
                        <IonImg src={media.src} />
                    </div>
                )}
            </IonCardContent>
        </IonRouterLink>


        {<IonItem color='paper' lines="inset" >
            <IonButton color='white' fill="clear" onClick={(e) => {
                open((message: any) => { makeComment(id, message) }, '', 'make a comment')
            }}>
                <IonIcon color={showComments ? 'tribe' : 'medium'} icon={'/icons/bubblechat.svg'} style={{ height: 30, width: 30, marginLeft: '-13px', marginBottom: '-1px' }} />

                <IonText color={showComments ? 'white' : 'medium'} className="semi" style={{ padding: 0, marginTop: 2, fontSize: 15 }}>
                    {commentCount}
                </IonText>
            </IonButton>
            <IonButtons slot='end'>
                <IonButton style={{ position: 'absolute', right: 50 }} fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} style={{ height: 25, width: 25 }} />
                </IonButton>

                <IonLabel style={{ position: 'absolute', paddingLeft: 2, right: 38, paddingRight: 2 }} >
                    <IonText className='ion-text-center'>{score} </IonText>
                </IonLabel>

                <IonButton style={{ position: 'absolute', right: 0 }} fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} style={{ height: 25, width: 25 }} />
                </IonButton>

            </IonButtons>
        </IonItem>}
        {showComments && <CommentList total={commentCount || 0} uid={uid} postId={id} amount={commentCount} />}
        {(showComments) && <WriteMessage
            placeHolder='write a comment'
            address={''}
            sendMessage={(message: any) => { makeComment(id, message) }}
        />}

    </IonCard>
}