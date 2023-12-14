import { gql, useQuery } from "@apollo/client"
import { IonCard, IonChip, IonGrid, IonProgressBar, IonSpinner, IonText } from "@ionic/react"
import { push } from "ionicons/icons"
import { Area, XAxis, YAxis, ResponsiveContainer, AreaChart, CartesianGrid, Tooltip } from 'recharts'
import { formatEther, size } from "viem"
import { timeAgo } from "./TradeItem"
import { useMemo } from "react"

export const accountTradesOfQuery = gql`
query MyQuery($address: String!) {
    trades(first:1000,where: {subject: $address},orderBy: blockTimestamp, orderDirection: asc) {
      tokenAmount
      supply
      trader
      subject
      isBuy
      ethAmount
      blockTimestamp
      transactionHash
    }
  }
`




const parseTrades = (trades: any) => {
    if (typeof trades === 'undefined') {
        return [];
    } else {
        return trades.map((x: any) => ({ ...x, price: formatEther(BigInt(x.ethAmount / x.tokenAmount)) }));
    }

}

export const dateFormatter = (date: any) => {
    if (isNaN(date)) {
        return ""
    }
    return timeAgo(new Date(parseFloat(date) * 1000)) || "";
};

export const MemberGraph: React.FC<{ address: string }> = ({ address }) => {
    const { data, loading, error } = useQuery<{ trades: any[] }>(accountTradesOfQuery, { variables: { address: address.toLowerCase() } })
    const trades = parseTrades(data?.trades);

    const graph = useMemo(() => {
        return <IonGrid className='transparent' style={{ marginLeft: -70, marginRight:-10, padding: 0, height: window.innerHeight / 3 }}>
            {loading && <IonProgressBar color='tertiary' type='indeterminate' />}
            {error && <IonChip color='danger'>{error.message}</IonChip>}
            {trades.length > 0 && <ResponsiveContainer height={window.innerHeight / 3} width={'100%'}>
                <AreaChart data={trades}>
                    <CartesianGrid stroke="" />
                    <YAxis dataKey="price" scale="auto" domain={[0, 'auto']} type="number"tickMargin={-60}orientation="left"axisLine={false} tickLine={false} interval="preserveEnd" minTickGap={80} yAxisId={0} />
                    <Tooltip cursor={true} labelStyle={{ paddingTop: 4 }} contentStyle={{padding: '10px 14px',borderRadius: 10,borderColor: 'var(--ion-color-paper)'}}/>
                    <Area type="monotone" dataKey="price" stroke="#F45000" fillOpacity={0.3} fill="#3B1400" />
                </AreaChart>
            </ResponsiveContainer>}
        </IonGrid >
    }, [address, trades, data])

    return graph;
}