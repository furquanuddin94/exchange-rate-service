// fx-rate-cards.tsx
'use client';

import React, { useEffect, useState, useContext } from 'react';
import { Card, CardTitle, CardDescription } from '../../components/ui/card';
import { CurrencyContext } from './CurrencyContext';
import { ClipLoader } from 'react-spinners';

// Define the shape of the exchange rate data
interface ExchangeRateProps {
  source: string;
  displayName: string;
  range: string | null;
  fees: string | null;
  fetchedAt: number;
  fxRate: number;
  fromCurrency: string;
  toCurrency: string;
}

// Define the FxRateCard component
const FxRateCard: React.FC<ExchangeRateProps> = ({ displayName, range, fees, fetchedAt, fxRate, fromCurrency, toCurrency }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");

  // Calculate the elapsed time since the data was fetched
  useEffect(() => {
    if (fetchedAt) {
      const calculateElapsedTime = () => {
        const now = Date.now();
        const elapsedTime = Math.round((now - fetchedAt) / 1000);

        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        const time = (minutes > 0 ? `${minutes}m ` : "") + `${seconds}s`;
        setTimeElapsed(time);
      };

      calculateElapsedTime();

      // Update the elapsed time every second
      const interval = setInterval(calculateElapsedTime, 1000);
      return () => clearInterval(interval);
    }
  }, [fetchedAt]);

  // If fxRate is null, return null
  if (fxRate === null) {
    return null;
  }

  // Render the FxRateCard component
  return (
    <Card className="w-full max-w-sm">
      <div className="grid grid-cols-[1.5fr,1fr] gap-x-4 p-6">
        <CardTitle className="text-2xl font-semibold self-start">{displayName}</CardTitle>
        <div className="space-y-1 text-right">
          {range && (
            <CardDescription className="text-xs">Range: {range}</CardDescription>
          )}
          {fees && (
            <CardDescription className="text-xs">Fees: {fees}</CardDescription>
          )}
        </div>
        <div className="col-span-2 mt-6 space-y-2">
          {fxRate && (
            <p className="text-lg font-medium">
              1 {fromCurrency} = {fxRate.toFixed(4)} {toCurrency}
            </p>
          )}
          {timeElapsed !== "" && (
            <p className="text-xs text-muted-foreground">
              Last fetched: <span className="font-light">{timeElapsed} ago</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Define the FxRateCards component
const FxRateCards: React.FC = () => {
  const { fromCurrency, toCurrency } = useContext(CurrencyContext);
  const [fxRates, setFxRates] = useState<ExchangeRateProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the latest exchange rates
  useEffect(() => {
    const fetchFxRates = async () => {
      try {
        setLoading(true);
        console.log('Fetching fresh rates');
        const response = await fetch(`/api/fx-rates/latest?from=${fromCurrency}&to=${toCurrency}`, {
          next: { revalidate: 300 }  // 5 minutes
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.data.map((rate: any) => ({
          ...rate,
          fromCurrency,
          toCurrency,
        }));
        setFxRates(formattedData);
      } catch (error) {
        console.error('Error fetching fx rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFxRates();
  }, [fromCurrency, toCurrency]);


  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-1 md:col-span-2 flex justify-center items-center py-20">
            <ClipLoader size={50} color="var(--foreground)" />
          </div>
        ) : fxRates.length > 0 ? (
          fxRates.map((fxRate, index) => (
            <FxRateCard key={index} {...fxRate} />
          ))
        ) : (
          <p>No exchange rates available.</p>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Note: Exchange rates may vary based on transaction amount. The displayed rates are indicative and may not reflect all possible ranges for these currencies.
      </p>
    </div>
  );
}

// Export the FxRateCards component
export default FxRateCards; 