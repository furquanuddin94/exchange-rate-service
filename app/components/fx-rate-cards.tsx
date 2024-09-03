'use client';

import { TimeSeriesData } from '@/app/utils/fxTimeSeriesDb';
import React, { useEffect, useState } from 'react';
import { Card, CardTitle, CardDescription } from '../../components/ui/card';

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
    <Card className="w-full max-w-sm">
      <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 p-6">
        <CardTitle className="text-2xl font-semibold self-start">{displayName}</CardTitle>
        <div className="space-y-1 text-right">
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
          {fees && (
            <CardDescription className="text-xs">Fees: {fees}</CardDescription>
          )}
        </div>
        <div className="col-span-2 mt-6 space-y-2">
          {data && (
            <p className="text-lg font-medium">1 THB = {data.fxRate.toFixed(4)} INR</p>
          )}
          {timeElapsed !== "" && (
            <p className="text-xs text-muted-foreground">
              Last fetched: <span className="font-light">{timeElapsed} ago</span>
            </p>
          )}
        </div>
      </div>
    </Card>

  );
};

interface FxRateCardsProps {
  exchangeRates: ExchangeRateProps[];
}

const FxRateCards: React.FC<FxRateCardsProps> = ({ exchangeRates }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exchangeRates.map((exchangeRate, index) => (
        <FxRateCard key={index} {...exchangeRate} />
      ))}
    </div>
  );
};

export default FxRateCards;
