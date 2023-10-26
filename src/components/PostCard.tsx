import { IonCard, IonCardHeader, IonText, IonButton, IonBadge, IonIcon, IonLabel, IonCardContent, IonRouterLink, IonImg, IonItem, IonButtons } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { chevronUp, chevronDown, chatbubble, pencilOutline, arrowDown, arrowUp } from "ionicons/icons"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { useEffect, useState } from "react"



export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    return <IonCard color='paper' key={id} style={{ margin: 5, marginBottom: 10, cursor: 'pointer!important' }}>
        <IonCardHeader >
            <IonBadge color='light' style={{ position: 'absolute', right: 20, top: 20 }}>
                <IonText color='tertiary'>
                    {sent && timeAgo(new Date(sent.seconds * 1000))}
                </IonText>
            </IonBadge>
            <MemberCardHeader address={author} />
        </IonCardHeader>
        <IonRouterLink routerLink={"/posts/" + id}>
            <IonCardContent style={{ padding: 20 }} >
                <IonRouterLink routerLink={'/posts/' + id}>
                    <IonText color='dark' style={{ whiteSpace: 'pre-wrap' }} onClick={() => {
                    }} >
                        {content}
                    </IonText>
                </IonRouterLink>
                {media && <IonImg src={media.src} />}
            </IonCardContent>
        </IonRouterLink>


        {<IonItem color='paper' lines="inset">
            <IonButton color='medium' fill="clear" onClick={() => {
                setShowComments(x => !x)
            }}>
                <IonIcon color={showComments ? 'tertiary' : 'medium'} icon={chatbubble} />
                <IonText color={showComments ? 'tertiary' : 'medium'}>
                    {commentCount}
                </IonText>
            </IonButton>
            <IonButtons slot='end'>
                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, false)} >
                    <IonBadge color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'}>
                        <IonIcon icon={arrowDown} />
                    </IonBadge>
                </IonButton>
                <IonLabel >
                    <IonText className='ion-text-center'>{score}</IonText>
                </IonLabel>

                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, true)} >
                    <IonBadge color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                        <IonIcon icon={arrowUp} />

                    </IonBadge>
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