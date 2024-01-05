import { Address } from "viem"
import { useMember } from "../hooks/useMember"
import { useEffect, useState } from "react"
import { getPoints } from "../lib/friendTech"
import { IonChip, IonBadge, IonSpinner, IonButton, IonImg, IonAvatar, IonIcon, IonText, IonItem, IonButtons } from "@ionic/react"
import { checkmark } from "ionicons/icons"

export const FriendPortfolioChip: React.FC<{ address?: string }> = ({ address }) => {
    const member = useMember(x => x.getFriend(address))
    const [points, setPoints] = useState<any>(undefined)
    useEffect(() => {
        member && member.friendTechAddress && getPoints(member?.friendTechAddress).then((res) => {
            setPoints(res);
        }).catch(() => {
            setPoints(null)
        })
    }, [member])
    if (member && typeof member.friendTechAddress === 'undefined' || points === null) {
        return <></>
    }
    return typeof points !== 'undefined' ? <IonButton fill="clear">
        {points.totalPoints} Points
        <IonBadge color='light'>
            👑
            {points.leaderboard}
        </IonBadge>
        <IonBadge color={points.tier === 'GOLD' ? "warning" : points.tier === 'DIAMOND' ? "secondary" : points.tier === 'SILVER' ? "medium" : points.tier === 'BRONZE' ? "light" : "danger"}>
            {points.tier}
        </IonBadge>
    </IonButton> : <IonChip><IonSpinner /></IonChip>
}
export const FriendTechPortfolioChip: React.FC<{ address?: string, held: number, name: string, pfp: string }> = ({ name, pfp, held }) => {
    return <IonItem lines="none">
        <IonChip color={'transparent'}>

            <IonAvatar>
                <IonImg src={pfp} />
            </IonAvatar>
            <IonText>
                {name}
            </IonText>
        </IonChip>

        <IonButtons slot='end'>
            <IonChip color={'transparent'}>

                <IonAvatar>
                    <IonImg src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAV1BMVEX///8AuvoAt/oAtfr8//8Uvfr3/f/d9P5ZyvvO8P7y+//G7P6y5v1mz/tJxvvn+P6V3P2H1/zV8f43w/un4v171Py86f1x0vyf3/0ewPp50fyu4v04wPvgoS+uAAADkUlEQVRoge1Z25bqIAyVYC/WDr2o1R7n/7/zQIvIJYmdkXlzv+mC3TQkOwnd7T744IPcaMZDt/8b6u5SAIjT0P0B90EzGwD0+bmFA9SZjd8XwmMXY1byG4gAx4zcgeELMtreQkwuqmzk14QcTrkifv+dGK5jJhN5k3pFs9/zkB8lQi4gj9vPmOUCVBbyASUX0OYgv+DkoshB/kWQw4CtbqZ+6NuxfJNciFTCygEWSKGGttrwBJIcLvHSbn6u1Y8o6nPzgjxNULc/Mr2co6X6AWpiJZo6UL33Gq6s0XQTV0bniFBMvX6kTh5qMuNiNfe33V4abumvhPPxDF3hx/qIysSDvsBzbmI2yem5jj74dSla2iuG3JPeMqlX8Vos6VDJdTvckR54w43tiExjxeJJ7lzZvyQXBXKqitugolWcczDH0OJiYP3S2J8n1vS09LIv/IiXR706cabLQ0JOZd4C+AotqNkTuiXkHesWm0e1/anmDZb4YP1og/Hxc665xXNKzkmXgKVz7NyL/GPfMw1GNj/Wjn0E95NdnKpvydmy+nFy5JzOYeSMmGp8771g0SnLWoJ034yki9WPlyc5G4tTSt4x64WsvEjUTSQnvRj5josvOPjRChfuNVFyvBm1G9qnsmiokSNHazWjGKab9jS/4HyIkzN5ZAK98pqhivEhoHW6YsiHIM1gYpxONK+0qJuubvLIr0wbQEw7dJk2KeoPfHM6Wrql1HBPSqMhv3vk0JEHhCXoArJkGHLfzXCmg5Fsqqk6nZDXO0IBmAGTssccaKCzsCdklxujCNNNKIbkZ6IwzsyoQdQMEwKhqQoPXP4iCNc7k/4huRzRnIsHkRB4mhpPhuT6iJHy8uoGCzXdBG+U8XJEspTzuEGD5Z5Runv0VJWaLjEpD4Dc6yyujMlhigMmHs4wYCLQYA8to2PYcg+BZJK5NZriv3Uy+o6B+dW0uyAVJWNTmgI6NpT7E9Qmbr9a2o1mSEcEWR73X/LxGlvvGeJavbTFSL4bRxyVBJDqB/eQUbAv3UI6lNlrqqptf3RfFQX7wpLMiWRZeIVo6jVnFU98b1xWBxGzFvRQjtObmO0ovdHEVpdAY9+70vR7oD55GThtjTwcZ+d2e3K+LG7LRgbODbYC+Pn/9qeBclUwEHbiroS09EWGy3XjdhC980Az1WC+mkA6JP8CE6hbeHDduc72yQFL6y7fJ4EPPviAxH9sByOUcm2KWAAAAABJRU5ErkJggg=='} />
                </IonAvatar>
                <IonText>
                    {held}
                </IonText>
            </IonChip>
        </IonButtons>
    </IonItem>
}