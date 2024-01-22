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
        return <IonGrid className='transparent' style={{ marginLeft: 0, marginRight: -10,padding: 0, height: window.innerHeight / 4 }}>
            {error && <IonChip color='danger'>{error.message}</IonChip>}
            {trades.length > 0 && <ResponsiveContainer height={window.innerHeight / 4} width={'100%'}>
            <AreaChart data={trades}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.25}/>
                                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0}/> {/* Adjust this value as needed */}
                                </linearGradient>
                            </defs>
                            <Tooltip cursor={false} labelClassName='bold'  labelStyle={{  paddingTop: 4, color: 'transparent' }} contentStyle={{ backgroundColor: 'transparent', padding: '10px 14px', borderColor: 'transparent' }} />
                            <Area type="monotone" dataKey="price" strokeWidth="3.5px" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
            </ResponsiveContainer>}
        </IonGrid >
    }, [address, trades, data])

    return graph;
}