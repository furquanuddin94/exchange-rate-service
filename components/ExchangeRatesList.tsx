'use client';

import React, { useEffect, useState } from 'react';
import { ExchangeRateInfo } from '../app/common/model/ExchangeRateInfo';

interface ExchangeRateProps {
  source: string;
  rate?: number;
  fetchedAt?: Date;
}

const ExchangeRate: React.FC<ExchangeRateProps> = ({ source, rate, fetchedAt }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");

  useEffect(() => {
    if (fetchedAt) {
      const calculateElapsedTime = () => {
        const currentTime = new Date();
        const fetchedAtTime = new Date(fetchedAt);
        const elapsedTime = currentTime.getTime() - fetchedAtTime.getTime();
        console.log('currentTime', currentTime, 'fetchedAt', fetchedAtTime, 'elapsedTime', elapsedTime);
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        setTimeElapsed(`${minutes}m ${seconds}s`);
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
  exchangeRates: { label: string; details: ExchangeRateInfo | null }[];
}

const ExchangeRatesList: React.FC<ExchangeRatesListProps> = ({ exchangeRates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {exchangeRates.map(({ label, details }) => (
        <ExchangeRate key={label} source={label} rate={details?.value} fetchedAt={details?.fetchedAt} />
      ))}
    </div>
  );
};

export default ExchangeRatesList;
