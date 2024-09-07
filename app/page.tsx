import { ModeToggle } from '@/components/mode-toggle';
import React from 'react';
import { constants } from './libs/config';
import FxRateCards from './components/fx-rate-cards';
import MultiLineChart from './components/multi-line-chart';
import { Analytics } from "@vercel/analytics/react"

export const revalidate = 600; // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate

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

    const latestFxRates = await fetch(hostname + `/api/fx-rates/latest`, { headers: commonHeaders }).then(response => response.json());

    return latestFxRates;
  } catch (error) {
    console.error('Error fetching fx rates:', error);
    return [];
  }
};

const fetchAllFxRates = async () => {

  try {
    console.log("Fetching all fx rates");

    // apparently the cache is not working as expected on vercel. It revalidates whenever page cache is invalidated.
    const chartData = await fetch(hostname + '/api/fx-rates', { next: { tags: ['fx-rates'], revalidate: 3600 }, headers: commonHeaders }).then(response => response.json());

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
      <Analytics />
    </div>

  );
};

export default Page;
