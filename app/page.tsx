import React from 'react';
import ExchangeRatesList from '../components/ExchangeRatesList'; // Import the client component
import { ExchangeRateInfo } from './common/model/ExchangeRateInfo';
import { cookies, headers } from 'next/headers';

export const fetchCache = 'force-no-store'

// Fetch data on the server side̥̥̥̥̥̥̥̥ ̥
const fetchExchangeRates = async () => {

  const hostname = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
    : 'http://localhost:3000';

  console.log("Hostname", hostname);

  try {
    console.log("Fetching exchange rates from next apis");

    // Get the cookies
    const cookieStore = cookies();
    const cookie = cookieStore.get('_vercel_jwt');

    console.log("cookie", cookie?.name, cookie?.value);


    const [latestRateResponse, latestDeeMoneyRateResponse, latestWesternUnionRateResponse] = await Promise.all([
      fetch(hostname + '/api/getLatestRates', { credentials: "include" }),
      fetch(hostname + '/api/getLatestDeeMoneyRates', { credentials: "include" }),
      fetch(hostname + '/api/getLatestWesternUnionRates', { credentials: "include" })
    ]);

    console.log("latest", await latestRateResponse.text());
    console.log("latestDeeMoney", await latestDeeMoneyRateResponse.text());
    console.log("latestWesternUnion", await latestWesternUnionRateResponse.text());

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
