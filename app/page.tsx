import { ModeToggle } from '@/components/mode-toggle';
import { MultiLineChart } from '@/components/multi-line-chart';
import React from 'react';
import FxRateCards from '../components/fx-rate-cards';
import { constants } from './utils/envUtils';
import { sourceConfigs } from './utils/cacheUtils';
export const dynamic = 'force-dynamic';

const hostname = constants.url;

const requestOptions: RequestInit = {
  next: {
    tags: ['fxRates'],
    revalidate: 900
  }
};

if (constants.protectionBypass) {
  requestOptions.headers = { 'x-vercel-protection-bypass': constants.protectionBypass };
}

constants.protectionBypass ? (
  requestOptions.headers = { 'x-vercel-protection-bypass': constants.protectionBypass },
  console.log("Protection bypass enabled")
) : console.log("Protection bypass disabled");

// Fetch data on the server side̥̥̥̥̥̥̥̥ ̥
const fetchLatestFxRates = async () => {
  try {
    console.log("Fetching latest fx rates");

    const latestFxRates = await fetch(hostname + `/api/fx-rates/latest`, requestOptions).then(response => response.json());

    return latestFxRates;
  } catch (error) {
    console.error('Error fetching fx rates:', error);
    return [];
  }
};

const fetchAllFxRates = async () => {

  try {
    console.log("Fetching all fx rates");

    const chartData = await fetch(hostname + '/api/fx-rates', requestOptions).then(response => response.json());

    return chartData;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }

}

// Server Component
const Page: React.FC = async () => {

  const [latestRates, allRates] = await Promise.all([fetchLatestFxRates(), fetchAllFxRates()]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Exchange Rates THB/INR</h1>
        <ModeToggle /> {/* Aligns the toggle to the right */}
      </div>
      {/* Pass fetched data to the client component */}
      <FxRateCards exchangeRates={latestRates} />

      {/* Insert the MultiLineChart component below the cards */}
      <div className="my-8 max-w-2xl mx-auto">
        <MultiLineChart allSourceData={allRates} />
      </div>
    </div>
  );
};

export default Page;
