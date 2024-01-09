import { IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePriceContext } from '../hooks/PriceContext';

interface ChartData {
  time: string; // Time is formatted by hour
  price: number; // Price as a number for AreaChart
}

interface MyChartComponentProps {
  contractId: string;
  chainName: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const TokenGraph: React.FC<MyChartComponentProps> = ({ chainName, contractId }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const { setPrice } = usePriceContext(); // Get the setPrice function from context

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
      useEffect(() => {
        if (active && payload && payload.length) {
          setPrice(payload[0].value); // Update the price in context
        }
      }, [active, payload]);
  
      // Return null as we don't need an actual tooltip
      return null;
    };

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
      <div style={{maxHeight: '500px'}}>
        <IonGrid className='transparent' style={{padding: 0}}>

        <ResponsiveContainer height={window.innerHeight / 1} width={'110%'} style={{padding: 0, marginLeft: '-5.25%'}}>
            <AreaChart data={chartData}>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area type="monotone" dataKey="price" strokeWidth="3.5px" stroke="#F45000" fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
        </ResponsiveContainer>

        </IonGrid>
        </div>
    );
};

export default TokenGraph;
