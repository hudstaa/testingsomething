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
    return <IonItem style={{ '--padding-start': '0', '--inner-padding-end': '0','--border-color': 'var(--ion-color-vote)' }} lines="full">
        <IonChip color={'transparent'}>

            <IonAvatar style={{width: 36, height: 36}}>
                <IonImg style={{borderRadius: '14px'}} src={pfp} />
            </IonAvatar>
            <IonText className='semi' style={{ paddingLeft: '.5rem',fontSize: '1rem'}}>
                {name}
            </IonText>
        </IonChip>

        <IonButtons slot='end'>
            <IonChip color={'transparent'}>
                <IonText className='heavy' color="tribelue" style={{ fontSize: '1.25rem'}}>
                    {held}
                </IonText>
                <IonAvatar style={{ marginLeft: 5 }}>
                    <IonImg src={'/icons/ft.png'} />
                </IonAvatar>

            </IonChip>
        </IonButtons>
    </IonItem>
}