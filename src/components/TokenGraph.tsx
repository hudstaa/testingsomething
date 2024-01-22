import { IonButton, IonButtons, IonGrid } from '@ionic/react';
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const TokenGraph: React.FC<MyChartComponentProps> = ({ chainName, contractId }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [timeFrame, setTimeFrame] = useState('1'); // Default to 1 day


    useEffect(() => {
      const days = timeFrame === '1m' ? 30 : timeFrame === '1w' ? 7 : 1;
      const fetchChartData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${contractId}/market_chart/?vs_currency=usd&days=${days}&precision=full`);
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
    }, [chainName, contractId, timeFrame]);

    return (
      <div>

        <IonGrid className='transparent' style={{padding: 0, height: '300px'}}>

          <ResponsiveContainer aspect={1.3} width={'114%'} style={{padding: 0, marginLeft: '-7%', }}>
              <AreaChart data={chartData}>
                {/* <Tooltip /> */}
                <Area type="monotone" dataKey="price" strokeWidth="4px" stroke="#F45000" fillOpacity={0} fill="url(#colorPrice)" />
              </AreaChart>
          </ResponsiveContainer>

        </IonGrid>
        <div style={{  marginBottom: '5%', width: '100%' }}>
          <IonButtons style={{display: 'flex', justifyContent: 'space-around', padding: 10}}>
            <IonButton className='bold' style={{'--background': timeFrame === '1d' ? 'var(--ion-color-vote)' : 'transparent','--border-radius': '12px', '--padding-start': '10px', '--padding-bottom': '10px', '--padding-top': '10px', '--padding-end': '10px', '--color': 'var(--ion-color-dark)'}} onClick={() => setTimeFrame('1d')}><span className='bold' style={{opacity: .6}}>1D</span></IonButton>
            <IonButton className='bold' style={{'--background': timeFrame === '1w' ? 'var(--ion-color-vote)' : 'transparent','--border-radius': '12px', '--padding-start': '10px', '--padding-bottom': '10px', '--padding-top': '10px', '--padding-end': '10px', '--color': 'var(--ion-color-dark)'}}  onClick={() => setTimeFrame('1w')}><span className='bold' style={{opacity: .6}}>1W</span></IonButton>
            <IonButton className='bold' style={{'--background': timeFrame === '1m' ? 'var(--ion-color-vote)' : 'transparent','--border-radius': '12px', '--padding-start': '10px', '--padding-bottom': '10px', '--padding-top': '10px', '--padding-end': '10px', '--color': 'var(--ion-color-dark)'}}  onClick={() => setTimeFrame('1m')}><span className='bold' style={{opacity: .6}}>1M</span></IonButton>
          </IonButtons>
        </div>
        </div>
    );
};

export default TokenGraph;
