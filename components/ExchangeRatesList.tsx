'use client';

import { TimeSeriesData } from '@/app/utils/fxTimeSeriesDb';
import React, { useEffect, useState } from 'react';

interface ExchangeRateProps {
  source: string;
  rate?: number;
  fetchedAt?: number;
}

const ExchangeRate: React.FC<ExchangeRateProps> = ({ source, rate, fetchedAt }) => {
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
    <div className="bg-gray-200 rounded-lg p-4">
      <h2 className="text-lg text-gray-700 font-bold">{source}</h2>
      {rate && (
        <p className="text-gray-700">1 THB = {rate} INR</p>
      )}
      {timeElapsed !== "" && (
        <p className="text-gray-700 text-xs">
          Last fetched: <span className="font-light">{timeElapsed} ago</span>
        </p>
      )}
    </div>
  );
};

interface ExchangeRatesListProps {
  exchangeRates: { label: string; details: TimeSeriesData | null }[];
}

const ExchangeRatesList: React.FC<ExchangeRatesListProps> = ({ exchangeRates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {exchangeRates.map(({ label, details }) => (
        <ExchangeRate key={label} source={label} rate={details?.fxRate} fetchedAt={details?.timestamp} />
      ))}
    </div>
  );
};

export default ExchangeRatesList;
