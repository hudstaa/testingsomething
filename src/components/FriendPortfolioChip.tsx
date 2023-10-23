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
            console.log(res, "POINTS");
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
export const FriendTechPortfolioChip: React.FC<{ address?: string, name: string, pfp: string }> = ({ name, pfp }) => {
    return <IonItem lines="none">
        <IonAvatar>
            <IonImg src={pfp} />
        </IonAvatar>
        <IonText>
            {name}
        </IonText>
        <IonButtons slot='end'>
        </IonButtons>
    </IonItem>
}