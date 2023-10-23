import { IonCard, IonCardHeader, IonButton, IonBadge, IonIcon, IonLabel, IonText, IonCardContent, IonImg } from "@ionic/react"
import { chevronUp, chevronDown } from "ionicons/icons"
import { CommentList } from "./CommentList"
import { MemberCardHeader } from "./MemberBadge"
import { WriteMessage } from "./WriteMessage"
import { Timestamp } from "firebase/firestore"
import { timeAgo } from "./TradeItem"

export const Post: React.FC<{ id: string, sent: Timestamp, score: number, voted: 1 | -1 | undefined | null, author: string, uid: string, content: string, makeComment: (id: string, content: string) => void, handleVote: (id: string, uid: string, vote: boolean) => void, media?: { src: string, type: string } }> = ({ author, sent, uid, handleVote, id, score, voted, content, makeComment, media }) => {
    return <IonCard color='light' key={id}>
        <IonCardHeader >
            {/* <IonBadge color='light' style={{ position: 'absolute', left: '45%', top: 0 }}>
            <IonText color='tertiary'>
                {timeAgo(new Date(sent.seconds * 1000))}
            </IonText>
        </IonBadge> */}
            <MemberCardHeader address={author} content={<IonText color='medium' style={{ postion: 'absolute', right: 300 }}>
                {timeAgo(new Date((sent?.seconds || 0) * 1000))}
            </IonText>
            } />

            <IonButton fill='clear' onClick={() => handleVote(id, uid, true)} style={{ position: 'absolute', top: -12, right: 0 }}>
                <IonBadge color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'}>
                    <IonIcon icon={chevronUp} />

                </IonBadge>
            </IonButton>

            <IonLabel style={{ position: 'absolute', bottom: '40%', right: 31 }}>
                <IonText className='ion-text-center'>{score === null ? <></> : score}</IonText>
            </IonLabel>
            <IonButton fill='clear' onClick={() => handleVote(id, uid, false)} style={{ position: 'absolute', bottom: -12, right: 0 }}>
                <IonBadge color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'}>
                    <IonIcon icon={chevronDown} />
                </IonBadge>
            </IonButton>

        </IonCardHeader>
        <IonCardContent style={{ padding: 20 }} >
            <IonText style={{ whiteSpace: 'pre-wrap' }} >
                {content}
            </IonText>
            {media && <IonImg src={media.src} />}

        </IonCardContent>

        <CommentList postId={id} />
        <WriteMessage
            placeHolder='write a comment'
            address={''}
            sendMessage={(message: any) => { makeComment(id, message) }}
        />
    </IonCard>
}