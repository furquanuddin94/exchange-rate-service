'use client';

import { TimeSeriesData } from '@/app/utils/fxTimeSeriesDb';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface ExchangeRateProps {
  source: string;
  rate?: string;
  fetchedAt?: number;
}

const FxRateCard: React.FC<ExchangeRateProps> = ({ source, rate, fetchedAt }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");

  useEffect(() => {
    if (fetchedAt) {
      const calculateElapsedTime = () => {
        const now = Date.now();
        const elapsedTime = Math.round((now - fetchedAt) / 1000);

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        const time = (minutes > 0 ? `${minutes}m ` : "") + `${seconds}s`;
        setTimeElapsed(time);
      };

      calculateElapsedTime();
    }
  }, [fetchedAt]);

  return (
    <Card className="rounded-lg p-1 shadow max-h-36">
      <CardHeader>
        <CardTitle>{source}</CardTitle>
      </CardHeader>
      <CardContent>
        {rate && (
          <p>1 THB = {rate} INR</p>
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
  exchangeRates: { source: string; data: TimeSeriesData | null }[];
}

const FxRateCards: React.FC<ExchangeRatesListProps> = ({ exchangeRates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {exchangeRates.map(({ source, data }) => (
        <FxRateCard key={source} source={source} rate={data?.fxRate?.toFixed(4)} fetchedAt={data?.timestamp} />
      ))}
    </div>
  );
};

export default FxRateCards;
