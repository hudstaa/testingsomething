import { IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string; // Time is formatted by hour
  price: number; // Price as a number for AreaChart
}

interface MyChartComponentProps {
  contractId: string;
  chainName: string;
}

export const TokenGraph: React.FC<MyChartComponentProps> = ({ chainName, contractId }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
      const fetchChartData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${contractId}/market_chart/?vs_currency=usd&days=1&precision=full`);
        const data = await response.json();

        setChartData(data.prices.map((item: [number, number]) => ({
          time: new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            hour12: false
          }).format(new Date(item[0])),
          price: item[1] // Keep price as a number for area chart
        })));
      };
  
      fetchChartData();
    }, [chainName, contractId]);

    return (
        <IonGrid className='transparent'>
        <ResponsiveContainer height={window.innerHeight / 4} width={'100%'}>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F45000" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#F45000" stopOpacity={0}/> {/* Adjust this value as needed */}
                    </linearGradient>
                </defs>
                <Tooltip cursor={true} labelStyle={{ paddingTop: 4 }} contentStyle={{ padding: '10px 14px', borderRadius: 10, borderColor: 'var(--ion-color-paper)' }} />
                <Area type="monotone" dataKey="price" strokeWidth="3.5px" stroke="#F45000" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
        </ResponsiveContainer>
        </IonGrid>
    );
};

export default TokenGraph;
