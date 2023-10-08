import { gql, useQuery } from "@apollo/client"
import { IonGrid } from "@ionic/react"
import { push } from "ionicons/icons"
import { LineChart, XAxis, Tooltip, YAxis, Line } from "recharts"
import { formatEther, size } from "viem"
import { timeAgo } from "./TradeItem"

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
    const { data } = useQuery<{ trades: any[] }>(accountTradesOfQuery, { variables: { address: address.toLowerCase() } })
    const trades = parseTrades(data?.trades);
    return <IonGrid>
        <LineChart onClick={({ activePayload }) => {
            if (activePayload && activePayload[0]) {

                const address = activePayload[0].payload.address

            }
        }}
            width={window.innerWidth}
            height={window.innerHeight / 3}
            data={trades}
        >
            <XAxis dataKey="blockTimestamp" tickFormatter={dateFormatter} tick />
            {/* <Tooltip cursor={false} content={CustomTooltip as any} /> */}

            <YAxis dataKey={'price'} scale={'auto'} domain={[0, 'auto']} />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={undefined} />

        </LineChart>
    </IonGrid >
}