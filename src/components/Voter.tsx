import { IonToolbar, IonButton, IonBadge, IonIcon, IonLabel, IonText } from "@ionic/react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { chevronUp, chevronDown } from "ionicons/icons";
import { useEffect, useState } from "react";
import { app } from "../App";

interface VoteToolbarProps {
    score: number;
    commentId: string,
    uid: string,
    postId: string
    handleVote: (vote: boolean) => void;
}

const Voter: React.FC<VoteToolbarProps> = ({ score, handleVote, commentId, postId, uid }) => {
    const [voted, setVoteCache] = useState<1 | -1 | null>(null);
    useEffect(() => {
        getDoc(doc(getFirestore(app), 'post', postId, 'comments', commentId, 'votes', uid!)).then((postDoc) => {
            setVoteCache(postDoc.data()?.vote || null);
        })
    }, [])
    const totalScore = score + ((voted === null) ? 0 : voted);
    return (
        <>
            <IonButton fill="clear" onPointerDown={() => {
                setVoteCache(1)
                handleVote(true)
            }} slot="start">
                <IonIcon icon={chevronUp} color={typeof voted !== 'undefined' && voted !== null && voted === 1 ? 'success' : 'medium'} />
            </IonButton>

            <IonLabel>
                <IonText className='ion-text-center'>{score === null ? <></> : totalScore}</IonText>
            </IonLabel>

            <IonButton fill="clear" onPointerDown={() => {
                handleVote(false)
                setVoteCache(-1)

            }} slot="end">
                <IonIcon color={typeof voted !== 'undefined' && voted !== null && voted === -1 ? 'danger' : 'medium'} icon={chevronDown} />
            </IonButton>
        </>
    );
}

export default Voter;