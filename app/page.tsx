import React from 'react';
import ExchangeRatesList from '../components/ExchangeRatesList'; // Import the client component
import { ExchangeRateInfo } from './common/model/ExchangeRateInfo';
import { GET as getLatestDeeMoneyRates } from './api/getLatestDeeMoneyRates/route';
import { GET as getLatestWesternUnionRates } from './api/getLatestWesternUnionRates/route';
import { GET as getLatestRates } from './api/getLatestRates/route';


// Fetch data on the server side
const fetchExchangeRates = async () => {

  try {
    console.log("Fetching exchange rates from next apis");
    const [latestRateResponse, latestDeeMoneyRateResponse, latestWesternUnionRateResponse] = await Promise.all([
      getLatestDeeMoneyRates(),
      getLatestRates(),
      getLatestWesternUnionRates()
    ]);

    const [latestRateData, latestDeeMoneyRateData, latestWesternUnionRateData] = await Promise.all([
      latestRateResponse.json(),
      latestDeeMoneyRateResponse.json(),
      latestWesternUnionRateResponse.json(),
    ]);

    const allRates = [{
      label: "Latest",
      details: new ExchangeRateInfo(latestRateData.value, new Date(latestRateData.fetchedAt)),
    },
    {
      label: "DeeMoney",
      details: new ExchangeRateInfo(latestDeeMoneyRateData.value, new Date(latestDeeMoneyRateData.fetchedAt)),
    },
    {
      label: "Western Union",
      details: new ExchangeRateInfo(latestWesternUnionRateData.value, new Date(latestWesternUnionRateData.fetchedAt)),
    }];

    const allRatesSorted = allRates.filter(({ details }) => details !== null).sort((a, b) => (b.details?.value ?? 0) - (a.details?.value ?? 0));

    return allRatesSorted;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return [];
  }
};

// Server Component
const Page: React.FC = async () => {
  const exchangeRates = await fetchExchangeRates();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Exchange Rates THB/INR</h1>
      {/* Pass fetched data to the client component */}
      <ExchangeRatesList exchangeRates={JSON.parse(JSON.stringify(exchangeRates))} />
    </div>
  );
};

export default Page;
