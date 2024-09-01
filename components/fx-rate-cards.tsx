'use client';

import { TimeSeriesData } from '@/app/utils/fxTimeSeriesDb';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';

interface ExchangeRateProps {
  source: string;
  displayName: string;
  description: string | null;
  fees: string | null;
  data: TimeSeriesData | null
}

const FxRateCard: React.FC<ExchangeRateProps> = ({ displayName, description, fees, data }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");

  useEffect(() => {
    if (data) {
      const calculateElapsedTime = () => {
        const now = Date.now();
        const elapsedTime = Math.round((now - data.timestamp) / 1000);

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        const time = (minutes > 0 ? `${minutes}m ` : "") + `${seconds}s`;
        setTimeElapsed(time);
      };

      calculateElapsedTime();
    }
  }, [data]);

  return (
    <Card className="rounded-lg p-1 shadow max-h-41">
      <CardHeader className="flex flex-col justify-between min-h-[8rem]">
        <div>
          <CardTitle className="mb-1">{displayName}</CardTitle>
          {description && <CardDescription className="min-h-[1rem]">
            {description}
          </CardDescription>}
          {fees && <CardDescription className="min-h-[1rem]">
            Fees: {fees}
          </CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        {data && (
          <p>1 THB = {data.fxRate.toFixed(4)} INR</p>
        )}
        {timeElapsed !== "" && (
          <p className="text-xs">
            Last fetched: <span className="font-light">{timeElapsed} ago</span>
          </p>
        )}
      </CardContent>
    </Card>

  );
};

interface ExchangeRatesListProps {
  exchangeRates: ExchangeRateProps[];
}

const FxRateCards: React.FC<ExchangeRatesListProps> = ({ exchangeRates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exchangeRates.map((exchangeRate, index) => (
        <FxRateCard key={index} {...exchangeRate} />
      ))}
    </div>
  );
};

export default FxRateCards;
