import { gql, useQuery } from "@apollo/client"
import { IonCard, IonChip, IonGrid, IonProgressBar, IonSpinner, IonText } from "@ionic/react"
import { push } from "ionicons/icons"
import { LineChart, XAxis, Tooltip, YAxis, Line, ResponsiveContainer } from "recharts"
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
        return <IonGrid >
            {loading && <IonProgressBar color='tertiary' type='indeterminate' />}
            {error && <IonChip color='danger'>{error.message}</IonChip>}
            {trades.length > 0 && <ResponsiveContainer height={window.innerHeight / 3} width={'100%'}>
                <LineChart onClick={({ activePayload }) => {
                    if (activePayload && activePayload[0]) {
                        const address = activePayload[0].payload.address
                    }
                }}
                    data={trades}
                >
                    <XAxis dataKey="blockTimestamp" tickFormatter={dateFormatter} tick />
                    {/* <Tooltip cursor={false} content={CustomTooltip as any} /> */}

                    <YAxis dataKey={'price'} scale={'auto'} domain={[0, 'auto']} />
                    <Line isAnimationActive={false} type="monotone" dataKey="price" stroke="#8884d8" dot={false} />

                </LineChart></ResponsiveContainer>}

        </IonGrid >
    }, [address, trades, data])
    return graph;
}