'use client';

import React, { useEffect, useState } from "react";

const ExchangeRate: React.FC<{ title: string; rate: number }> = ({ title, rate }) => (
  <div className="bg-gray-200 rounded-lg p-4">
    <h2 className="text-lg text-gray-700 font-bold">{title}</h2>
    <p className="text-gray-700">1 THB = {rate} INR</p>
  </div>
);

const App = () => {
  const [exchangeRates, setExchangeRates] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const latestRate = await fetchLatestRate();
      const latestDeeMoneyRate = await fetchLatestDeeMoneyRate();
      const latestWesternUnionRate = await fetchLatestWesternUnionRate();

      const allRates = [{
        label: "Latest",
        value: parseFloat(latestRate.toFixed(4))
      },
      {
        label: "DeeMoney",
        value: parseFloat(latestDeeMoneyRate.toFixed(4))
      },
      {
        label: "Western Union",
        value: parseFloat(latestWesternUnionRate.toFixed(4))
      }]

      const allRatesSorted = allRates.sort((a, b) => b.value - a.value);
      setExchangeRates(allRatesSorted);
    };

    fetchData();
  }, []);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Exchange Rates THB/INR</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exchangeRates.map(({ label, value }) => (
          <ExchangeRate key={label} title={label} rate={value} />
        ))}
      </div>
    </div>
  );
};

const fetchLatestRate = async () => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestRates');
    const data = await response.json();
    console.log('Latest rates:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest rates:', error);
    return {};
  }
};

const fetchLatestDeeMoneyRate = async () => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestDeeMoneyRates');
    const data = await response.json();
    console.log('Latest deemoney rates:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest deemoney rates:', error);
    return {};
  }
};

const fetchLatestWesternUnionRate = async () => {
  // Fetch exchange rates from source 1
  // Return an object with currency rates

  try {
    const response = await fetch('/api/getLatestWesternUnionRates');
    const data = await response.json();
    console.log('Latest western union rates:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest western union rates:', error);
    return {};
  }
};

export default App;