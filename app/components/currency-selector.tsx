// components/CurrencySelector.tsx
"use client";

import React, { useContext, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyContext } from './CurrencyContext';
import { supportedCurrencies } from '../libs/config';

const currencyList = Object.keys(supportedCurrencies).sort();

export default function CurrencySelector() {
  const { fromCurrency, toCurrency, setFromCurrency, setToCurrency } = useContext(CurrencyContext);

  // Add useEffect hooks to log when currencies change
  useEffect(() => {
    console.log(`From Currency changed to: ${fromCurrency}`);
  }, [fromCurrency]);

  useEffect(() => {
    console.log(`To Currency changed to: ${toCurrency}`);
  }, [toCurrency]);

  const CurrencySelect = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{label}</span>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label} Currency`}>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencyList.map((currency) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6 mb-4 md:mr-3">
      <CurrencySelect label="From" value={fromCurrency} onChange={setFromCurrency} />
      <CurrencySelect label="To" value={toCurrency} onChange={setToCurrency} />
    </div>
  );
}
