"use client"; // Ensures the component is client-side only

import React, { createContext, useEffect, useState } from 'react';

interface CurrencyContextType {
  fromCurrency: string;
  setFromCurrency: (value: string) => void;
  toCurrency: string;
  setToCurrency: (value: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  fromCurrency: 'THB',
  setFromCurrency: () => {},
  toCurrency: 'INR',
  setToCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fromCurrency, setFromCurrency] = useState<string>('THB');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [isClient, setIsClient] = useState(false);

  // Detect if the code is running on the client side
  useEffect(() => {
    setIsClient(true);

    const storedFromCurrency = localStorage.getItem('fromCurrency');
    const storedToCurrency = localStorage.getItem('toCurrency');

    if (storedFromCurrency) setFromCurrency(storedFromCurrency);
    if (storedToCurrency) setToCurrency(storedToCurrency);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('fromCurrency', fromCurrency);
    }
  }, [fromCurrency, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('toCurrency', toCurrency);
    }
  }, [toCurrency, isClient]);

  if (!isClient) {
    // Don't render anything until the component is mounted on the client
    return null;
  }

  return (
    <CurrencyContext.Provider value={{ fromCurrency, setFromCurrency, toCurrency, setToCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
