import { ModeToggle } from '@/components/mode-toggle';
import { MultiLineChart } from '@/components/multi-line-chart';
import { cookies, headers } from 'next/headers';
import React from 'react';
import FxRateCards from '../components/fx-rate-cards'; // Import the client component
import { constants } from './utils/constants';

// Fetch data on the server side̥̥̥̥̥̥̥̥ ̥
const fetchExchangeRates = async () => {

  const host = headers().get('x-forwarded-host') || '';
  const hostname = host.includes("localhost") ? "http://localhost:3000" : `https://${host}`
  console.log("Hostname", hostname);

  try {
    console.log("Fetching exchange rates from next apis");

    // Get the cookies
    const cookieStore = cookies();
    const cookie = cookieStore.getAll();

    const headers = {
      cookie: cookie.map(({ name, value }) => `${name}=${value}`).join('; '),
    }

    const requestOptions: RequestInit = {
      next: {
        tags: ['fxRates'],
      }
    };
    console.log("env", constants.env);
    if (constants.env !== 'production') {
      requestOptions.headers = headers;
    }

    const [latestRateResponse, latestDeeMoneyRateResponse, latestWesternUnionRateResponse] = await Promise.all([
      fetch(hostname + '/api/fetchFx?' + new URLSearchParams({ source: 'latest' }), requestOptions),
      fetch(hostname + '/api/fetchFx?' + new URLSearchParams({ source: 'deeMoney' }), requestOptions),
      fetch(hostname + '/api/fetchFx?' + new URLSearchParams({ source: 'westernUnion' }), requestOptions)
    ]);

    const [latestRateData, latestDeeMoneyRateData, latestWesternUnionRateData] = await Promise.all([
      latestRateResponse.json(),
      latestDeeMoneyRateResponse.json(),
      latestWesternUnionRateResponse.json(),
    ]);

    const allRates = [{
      label: "Latest",
      details: { fxRate: latestRateData.fxRate, timestamp: latestRateData.timestamp },
    },
    {
      label: "DeeMoney",
      details: { fxRate: latestDeeMoneyRateData.fxRate, timestamp: latestDeeMoneyRateData.timestamp },
    },
    {
      label: "Western Union",
      details: { fxRate: latestWesternUnionRateData.fxRate, timestamp: latestWesternUnionRateData.timestamp },
    }];

    const roundedOffRates = allRates.map(({ label, details }) => ({
      label,
      details: {
        fxRate: parseFloat(details?.fxRate.toFixed(4)),
        timestamp: details?.timestamp
      }
    }));

    const sortedRates = roundedOffRates.filter(({ details }) => details !== null).sort((a, b) => (b.details?.fxRate ?? 0) - (a.details?.fxRate ?? 0));

    return sortedRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return [];
  }
};

const fetchChartData = async () => {

  const host = headers().get('x-forwarded-host') || '';
  const hostname = host.includes("localhost") ? "http://localhost:3000" : `https://${host}`
  console.log("Hostname", hostname);

  try {
    console.log("Fetching chart data from next apis");

    // Get the cookies
    const cookieStore = cookies();
    const cookie = cookieStore.getAll();

    const headers = {
      cookie: cookie.map(({ name, value }) => `${name}=${value}`).join('; '),
    }

    const requestOptions: RequestInit = {
      next: {
        tags: ['fxRates'],
      }
    };
    if (constants.env !== 'production') {
      requestOptions.headers = headers;
    }

    const lookbackInHours: number = 2;

    const chartData = await fetch(hostname + '/api/fetchChartData?' + new URLSearchParams({ lookbackInHours: lookbackInHours.toString() }), requestOptions);
    const chartDataJson = await chartData.json();

    return chartDataJson;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }

}

// Server Component
const Page: React.FC = async () => {

  const [exchangeRates, chartData] = await Promise.all([fetchExchangeRates(), fetchChartData()]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Exchange Rates THB/INR</h1>
        <ModeToggle /> {/* Aligns the toggle to the right */}
      </div>
      {/* Pass fetched data to the client component */}
      <FxRateCards exchangeRates={JSON.parse(JSON.stringify(exchangeRates))} />

      {/* Insert the MultiLineChart component below the cards */}
      <div className="my-8 max-w-2xl mx-auto">
        <MultiLineChart chartData={JSON.parse(JSON.stringify(chartData))} />
      </div>
    </div>
  );
};

export default Page;
