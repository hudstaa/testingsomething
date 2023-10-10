import { IonAvatar, IonBadge, IonButtons, IonCol, IonGrid, IonImg, IonItem, IonRow } from '@ionic/react';
import { Trade } from '../models/Trade';
import { formatUnits, formatEther } from 'viem'
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
            return formatter.format(Math.round(delta), key as any)?.toString().replaceAll("ago", "").replaceAll("hours", "h").replaceAll("seconds", "s").replaceAll("minute", "m");
        }
    }
}
export const TradeItem: React.FC<{ trade: Trade }> = ({ trade }) => {
    return <IonItem lines={'none'} detail key={trade.transactionHash} >
        <MemberBadge address={trade.trader} />
        {trade.isBuy ? "BUY" : "SELL"}
        <MemberBadge color={trade.isBuy ? "success" : "danger"} address={trade.subject} />
        <IonBadge color='primary'>
            {formatEth(trade.ethAmount)}
        </IonBadge>
        <IonButtons slot='end'>
            {timeAgo(new Date(parseInt(trade.blockTimestamp) * 1000))}
        </IonButtons>
    </IonItem>
}