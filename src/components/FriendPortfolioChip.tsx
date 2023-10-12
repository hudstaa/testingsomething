import { Address } from "viem"
import { useMember } from "../hooks/useMember"
import { useEffect, useState } from "react"
import { getPoints } from "../lib/friendTech"
import { IonChip, IonBadge, IonSpinner, IonButton } from "@ionic/react"

export const FriendPortfolioChip: React.FC<{ address?: string }> = ({ address }) => {
    const member = useMember(x => x.getFriend(address))
    const [points, setPoints] = useState<any>(undefined)
    useEffect(() => {
        member && member.friendTech && getPoints(member?.friendTech).then((res) => {
            console.log(res);
            setPoints(res);
        })
    }, [member])
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