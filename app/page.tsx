import { ModeToggle } from '@/components/mode-toggle';
import React from 'react';
import { constants } from './utils/envUtils';
import FxRateCards from './components/fx-rate-cards';
import MultiLineChart from './components/multi-line-chart';

export const dynamic = 'force-dynamic';

const hostname = constants.url;

let commonHeaders = {};
if (constants.protectionBypass) {
  commonHeaders = { 'x-vercel-protection-bypass': constants.protectionBypass };
  console.log("Protection bypass enabled");
} else {
  console.log("Protection bypass disabled");
}


// Fetch data on the server side̥̥̥̥̥̥̥̥ ̥
const fetchLatestFxRates = async () => {
  try {
    console.log("Fetching latest fx rates");

    const latestFxRates = await fetch(hostname + `/api/fx-rates/latest`, { next: { revalidate: 60 }, headers: commonHeaders }).then(response => response.json());

    return latestFxRates;
  } catch (error) {
    console.error('Error fetching fx rates:', error);
    return [];
  }
};

const fetchAllFxRates = async () => {

  try {
    console.log("Fetching all fx rates");

    const chartData = await fetch(hostname + '/api/fx-rates', { next: { revalidate: 60 }, headers: commonHeaders }).then(response => response.json());

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

      {/* Flex container for the cards and chart */}
      <div className="flex flex-col md:flex-row">
        {/* FxRateCards on the left */}
        <div className="w-full md:w-3/5 mb-4 md:mb-0 md:pr-4">
          <FxRateCards exchangeRates={latestRates} />
        </div>

        {/* MultiLineChart on the right */}
        <div className="w-full md:w-2/5 md:pl-4">
          <MultiLineChart allSourceData={allRates} />
        </div>
      </div>
    </div>

  );
};

export default Page;
