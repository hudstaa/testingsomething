import { IonCard, IonCardHeader, IonText, IonButton, IonBadge, IonIcon, IonLabel, IonCardContent, IonRouterLink, IonImg, IonItem, IonButtons } from "@ionic/react"
import { Timestamp } from "firebase/firestore"
import { chevronUp, chevronDown, chatbubble, pencilOutline, arrowDown, arrowUp } from "ionicons/icons"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { timeAgo } from "./TradeItem"
import { WriteMessage } from "./WriteMessage"
import { useEffect, useState } from "react"
import { useWriteMessage } from "../hooks/useWriteMessage"



export const PostCard: React.FC<{ commentCount?: number, hideComments: boolean, id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ hideComments, author, sent, uid, handleVote, id, score, voted, content, makeComment, media, commentCount }) => {
    const [showComments, setShowComments] = useState<boolean>(!hideComments);
    const { open } = useWriteMessage();
    return <IonCard color='paper' key={id} style={{ margin: 5, marginLeft: -5, marginRight: -5, paddingRight: 0, paddingLeft: 0, marginBottom: 10, cursor: 'pointer!important' }} onClick={(e) => {

    }}>

        <IonCardHeader >
            <IonBadge color='paper' style={{ position: 'absolute', right: 20, top: 20 }}>
                <IonText color='tribe' className="regular">
                    {sent && timeAgo(new Date(sent.seconds * 1000))}
                </IonText>
            </IonBadge>
            <MemberCardHeader address={author} />
        </IonCardHeader>
        <IonRouterLink routerLink={"/post/" + id}>
            <IonCardContent style={{ paddingLeft: 20, paddingBottom: 0, paddingTop: 0, margin: 0 }} >
                <IonRouterLink routerLink={'/post/' + id}>
                    <IonText color='dark' style={{ whiteSpace: 'pre-wrap', padding: 0 }} onClick={() => {
                    }} >
                        {content}
                    </IonText>
                </IonRouterLink>
                {media && <IonImg src={media.src} />}
            </IonCardContent>
        </IonRouterLink>


        {<IonItem color='paper' lines="inset">
            <IonButton color='medium' fill="clear" onClick={(e) => {
                open((message: any) => { makeComment(id, message) }, '', 'make a comment')
            }}>
                <IonIcon color={showComments ? 'tribe' : 'medium'} icon={chatbubble} style={{ padding: 2 }} />

                <IonText color={showComments ? 'tribe' : 'medium'} style={{ padding: 2 }}>
                    {commentCount}
                </IonText>
            </IonButton>
            <IonButtons slot='end'>
                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, false)} color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'} >
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} />
                </IonButton>
                <IonLabel >
                    <IonText className='ion-text-center'>{score}</IonText>
                </IonLabel>

                <IonButton fill='clear' onPointerDown={() => handleVote(id, uid, true)} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                    <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} />
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