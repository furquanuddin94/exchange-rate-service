"use client"; // This ensures the component is client-side only

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

  useEffect(() => {
    const savedFromCurrency = localStorage.getItem('fromCurrency');
    const savedToCurrency = localStorage.getItem('toCurrency');
    
    if (savedFromCurrency) {
      setFromCurrency(savedFromCurrency);
    }
    if (savedToCurrency) {
      setToCurrency(savedToCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fromCurrency', fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    localStorage.setItem('toCurrency', toCurrency);
  }, [toCurrency]);

  return (
    <CurrencyContext.Provider value={{ fromCurrency, setFromCurrency, toCurrency, setToCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
