'use client';

import React, { useEffect, useState } from "react";

const App = () => {
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const latestRate = await fetchLatestRate();
      const latestDeeMoneyRate = await fetchLatestDeeMoneyRate();
      const latestWesternUnionRate = await fetchLatestWesternUnionRate();

      setExchangeRates({
        latestRate: latestRate,
        latestDeeMoneyRate: latestDeeMoneyRate,
        latestWesternUnionRate: latestWesternUnionRate
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Exchange Rates THB/INR</h1>
      <pre>{JSON.stringify(exchangeRates, null, 2)}</pre>
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