'use client';

import React, { useEffect, useState } from "react";
import { ExchangeRateInfo } from "./common/model/ExchangeRateInfo";

const ExchangeRate: React.FC<{ source: string; rate?: number, fetchedAt?: Date }> = ({ source, rate, fetchedAt }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");

  useEffect(() => {
    if (fetchedAt) {
      const currentTime = new Date();
      const elapsedTime = currentTime.getTime() - fetchedAt.getTime();
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      setTimeElapsed(`${minutes}m ${seconds}s`);
    }
  }, [fetchedAt]);

  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <h2 className="text-lg text-gray-700 font-bold">{source}</h2>
      {rate && (
        <p className="text-gray-700">1 THB = {rate} INR</p>
      )}
      {timeElapsed != "" && (
        <p className="text-gray-700 text-xs">
          Last fetched: <span className="font-light">{timeElapsed} ago</span>
        </p>
      )}
    </div>
  );
};

const App = () => {
  const [exchangeRates, setExchangeRates] = useState<{ label: string; details: ExchangeRateInfo | null }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestRate = await fetchLatestRate();
      const latestDeeMoneyRate = await fetchLatestDeeMoneyRate();
      const latestWesternUnionRate = await fetchLatestWesternUnionRate();

      console.log("llll", latestDeeMoneyRate, latestWesternUnionRate);

      const allRates = [{
        label: "Latest",
        details: latestRate
      },
      {
        label: "DeeMoney",
        details: latestDeeMoneyRate
      },
      {
        label: "Western Union",
        details: latestWesternUnionRate
      }]

      const allRatesSorted = allRates.filter(({ details }) => details !== null).sort((a, b) => (b.details?.value ?? 0) - (a.details?.value ?? 0));
      setExchangeRates(allRatesSorted);
    };

    fetchData();
  }, []);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Exchange Rates THB/INR</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exchangeRates.map(({ label, details }) => (
          <ExchangeRate key={label} source={label} rate={details?.value} fetchedAt={details?.fetchedAt} />
        ))}
      </div>
    </div>
  );
};

const fetchLatestRate = async (): Promise<ExchangeRateInfo | null> => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestRates');
    const data = await response.json();
    console.log('Latest rates:', data);
    // Parse the fetched data and convert fetchedAt to a Date object
    return new ExchangeRateInfo(data.value, new Date(data.fetchedAt));
  } catch (error) {
    console.error('Error fetching latest rates:', error);
    return null;
  }
};

const fetchLatestDeeMoneyRate = async (): Promise<ExchangeRateInfo | null> => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestDeeMoneyRates');
    const data = await response.json();
    console.log('Latest deemoney rates:', data);
    return new ExchangeRateInfo(data.value, new Date(data.fetchedAt));
  } catch (error) {
    console.error('Error fetching latest deemoney rates:', error);
    return null;
  }
};

const fetchLatestWesternUnionRate = async (): Promise<ExchangeRateInfo | null> => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestWesternUnionRates');
    const data = await response.json();
    console.log('Latest western union rates:', data);
    return new ExchangeRateInfo(data.value, new Date(data.fetchedAt));
  } catch (error) {
    console.error('Error fetching latest western union rates:', error);
    return null;
  }
};

export default App;