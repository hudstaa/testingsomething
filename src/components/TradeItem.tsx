import { IonAvatar, IonBadge, IonButtons, IonCol, IonGrid, IonImg, IonItem, IonRow, IonText } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther, getAddress } from 'viem'
import { useMember } from '../hooks/useMember';
import { MemberBadge } from './MemberBadge';
import { formatEth } from '../lib/sugar';




export function timeAgo(input: Date) {
    const date = (input instanceof Date) ? input : new Date(input);
    const formatter = new Intl.RelativeTimeFormat('en');
    const ranges: Record<string, number> = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1,
    };
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    if (secondsElapsed > -1) {
        return "now"
    }
    for (let key in ranges) {
        if ((ranges[key]) < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[key];
            return formatter.format(Math.round(delta), key as any)?.toString().replaceAll("ago", "").replaceAll("hours", "h").replaceAll("seconds", "s").replaceAll("minutes", "m").replaceAll("minute", "m").replaceAll("second", "s");
        }
    }
}
export const TradeItem: React.FC<{ trade: Trade }> = ({ trade }) => {
    return <IonItem lines={'none'} detail key={trade.transactionHash} >
        <MemberBadge address={getAddress(trade.trader)} />
        <IonText color={trade.isBuy ? "success" : "danger"}>
            {trade.isBuy ? "BUY" : "SELL"}
        </IonText>
        <MemberBadge color={trade.isBuy ? "success" : "danger"} address={getAddress(trade.subject)} />
        <IonButtons slot='end'>
            <IonBadge color='primary'>
                {formatEth(trade.ethAmount)}
            </IonBadge>
        </IonButtons>
    </IonItem>
}