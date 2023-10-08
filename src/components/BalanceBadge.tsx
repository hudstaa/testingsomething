import { IonBadge } from "@ionic/react"
import { formatEther } from "viem"
import { Address, useBalance } from "wagmi"
export const BalanceChip: React.FC<{ address: Address, color?: string | undefined }> = ({ address, color }) => {
    const balance = useBalance({ address, watch: true })
    return <IonBadge color={color ? color : 'tertiary'}>
        {balance.data && parseFloat(formatEther(balance.data.value)).toFixed(4)}Ξ
    </IonBadge>
}
