import { IonToolbar, IonButton, IonBadge, IonIcon, IonLabel, IonText } from "@ionic/react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import { chevronUp, chevronDown, arrowUp, arrowDown } from "ionicons/icons";
import { useEffect, useState } from "react";
import { app } from "../App";

interface VoteToolbarProps {
    score: number;
    commentId: string,
    uid: string,
    postId: string
    handleVote: (vote: boolean) => void;
}
function formatNumber(num: number) {
    let isNegative = num < 0;
    let absoluteNum = Math.abs(num);

    let shorthand = '';
    if (absoluteNum < 1000) {
        shorthand = absoluteNum.toString();
    } else if (absoluteNum < 1000000) {
        shorthand = (absoluteNum / 1000).toFixed(1) + 'k';
    } else if (absoluteNum < 1000000000) {
        shorthand = (absoluteNum / 1000000).toFixed(1) + 'm';
    } else {
        shorthand = (absoluteNum / 1000000000).toFixed(1) + 'b';
    }

    return isNegative ? '-' + shorthand : shorthand;
}
// const Voter: React.FC<VoteToolbarProps> = ({ score, handleVote, commentId, postId, uid }) => {
//     const [voted, setVoteCache] = useState<1 | -1 | null>(null);

//     useEffect(() => {
//         getDoc(doc(getFirestore(app), 'post', postId, 'comments', commentId, 'votes', uid!)).then((postDoc) => {
//             setVoteCache(postDoc.data()?.vote || null);
//         })
//     }, [])

//     const totalScore = formatNumber(score + ((voted === null) ? 0 : voted));
//     const length = String(totalScore).length
//     const font = [16, 16, 16, 14, 13, 11, 10, 10];
//     const fontSize = font[length];

//     return (
//         <div className="vote-toolbar">
//             <IonButton className="vote-button" fill="clear" onPointerDown={() => {
//                 setVoteCache(-1);
//                 handleVote(false);
//             }} slot="start">
//                 <IonIcon icon={voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} />
//             </IonButton>
//             <div className="score-container">
//                 <IonLabel className="score-label">
//                     <IonText style={{ fontSize }}>{score === null ? <></> : totalScore}</IonText>
//                 </IonLabel>
//             </div>
//             <IonButton className="vote-button" fill="clear" onPointerDown={() => {
//                 setVoteCache(1);
//                 handleVote(true);
//             }} slot="end">
//                 <IonIcon icon={voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} />
//             </IonButton>
//         </div>
//     );
// }


const Voter: React.FC<VoteToolbarProps> = ({ score, handleVote, commentId, postId, uid }) => {
    const [voted, setVoteCache] = useState<1 | -1 | null>(null);
    useEffect(() => {
        getDoc(doc(getFirestore(app), 'post', postId, 'comments', commentId, 'votes', uid!)).then((postDoc) => {
            setVoteCache(postDoc.data()?.vote || null);
        })
    }, [])
    const totalScore = formatNumber(score + ((voted === null) ? 0 : voted));
    const padding = [0, 36, 34, 30, 26, 27, 24, 20]
    const font = [16, 16, 16, 14, 13, 11, 10, 10];
    const length = totalScore.toString().length;
    const right = padding[length]
    const fontSize = font[length];
    return (
        <>

            <IonButton style={{ marginRight: 20 }} fill="clear" onPointerDown={() => {
                setVoteCache(-1)
                handleVote(false)
            }} slot="start">
                <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === -1 ? '/icons/downvote-box-red.svg' : '/icons/downvote-box.svg'} />
            </IonButton>
            <IonLabel style={{ position: 'absolute', right }}>
                <IonText style={{ fontSize, font: 'courier-new!important' }} >{score === null ? <></> : totalScore}</IonText>
            </IonLabel>
            <IonButton fill="clear" onPointerDown={() => {
                setVoteCache(1)
                handleVote(true)
            }} slot="end">
                <IonIcon icon={typeof voted !== 'undefined' && voted !== null && voted === 1 ? '/icons/upvote-box-green.svg' : '/icons/upvote-box.svg'} />
            </IonButton>

        </>
    );
}

export default Voter;