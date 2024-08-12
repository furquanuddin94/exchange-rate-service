import React from 'react';
import ExchangeRatesList from '../components/ExchangeRatesList'; // Import the client component
import { ExchangeRateInfo } from './common/model/ExchangeRateInfo';
import { headers, cookies } from 'next/headers';

export const fetchCache = 'force-no-store'

// Fetch data on the server side̥̥̥̥̥̥̥̥ ̥
const fetchExchangeRates = async () => {

  //const hostname = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  //  ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
  //  : 'http://localhost:3000';

  const hostname = headers().get('x-forwarded-host')
  console.log("Hostname", hostname);

  try {
    console.log("Fetching exchange rates from next apis");

    // Get the cookies
    const cookieStore = cookies();
    const cookie = cookieStore.getAll();

    const headers = {
      cookie: cookie.map(({ name, value }) => `${name}=${value}`).join('; '),
    }

    console.log("headers", headers);

    const [latestRateResponse, latestDeeMoneyRateResponse, latestWesternUnionRateResponse] = await Promise.all([
      fetch(hostname + '/api/getLatestRates', { headers }),
      fetch(hostname + '/api/getLatestDeeMoneyRates', { headers }),
      fetch(hostname + '/api/getLatestWesternUnionRates', { headers })
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
