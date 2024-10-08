import React, { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import FxRateCards from './components/fx-rate-cards';
import MultiLineChart from './components/multi-line-chart';
import CurrencySelector from './components/currency-selector';
import { Analytics } from "@vercel/analytics/react";
import { CurrencyProvider } from '@/app/components/CurrencyContext';
import { envConstants } from '@/app/libs/config';

const hostname = envConstants.url;

let commonHeaders: HeadersInit = {};
if (envConstants.protectionBypass) {
  commonHeaders = { 'x-vercel-protection-bypass': envConstants.protectionBypass };
  console.log("Protection bypass enabled");
} else {
  console.log("Protection bypass disabled");
}

// Fetch data on the client side
const fetchAllFxRates = async () => {
  try {
    console.log("Fetching all fx rates");
    const response = await fetch(hostname + '/api/fx-rates', { headers: commonHeaders });
    const chartData = await response.json();
    return chartData;
  } catch (error: any) {
    console.error('Error fetching chart data:', error);
    return [];
  }
};

const Page: React.FC = async() => {

  const allRates = await fetchAllFxRates();

  return (
    <CurrencyProvider>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">FX Rates</h1>
          <ModeToggle /> {/* Aligns the toggle to the right */}
        </div>

        {/* Flex container for the cards and chart */}
        <div className="flex flex-col md:flex-row">
          {/* FxRateCards on the left */}
          <div className="w-full md:w-3/5 mb-4 md:mb-0 md:pr-4">
            {/* Currency Selector */}
            <CurrencySelector /> 
            <FxRateCards />
          </div>

          {/* MultiLineChart on the right */}
          <div className="w-full md:w-2/5 md:pl-4">
            {allRates && (
              <MultiLineChart allSourceData={allRates} />
            )}
          </div>
        </div>
        <Analytics />
      </div>
    </CurrencyProvider>
  );
};

export default Page;
