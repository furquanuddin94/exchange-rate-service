// components/CurrencySelector.tsx
"use client"; // This makes the component a client-side component

import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const currencyList = ['USD', 'EUR', 'INR', 'THB', 'GBP', 'JPY'];

  // Callback to handle currency selection
  const handleCurrencySelect = (fromCurrency: string, toCurrency: string) => {
    console.log(`Selected From: ${fromCurrency}, To: ${toCurrency}`);
    // Update your state or trigger a data refresh as needed
  };

export default function CurrencySelector() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    handleCurrencySelect(value, toCurrency);
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
    handleCurrencySelect(fromCurrency, value);
  };

  const CurrencySelect = ({ label, value, onChange }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{label}</span>
      <Select onValueChange={onChange} defaultValue={value}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label} Currency`} />
        </SelectTrigger>
        <SelectContent>
          {currencyList.map(currency => (
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
      <CurrencySelect
        label="From"
        value={fromCurrency}
        onChange={handleFromCurrencyChange}
      />
      <CurrencySelect
        label="To"
        value={toCurrency}
        onChange={handleToCurrencyChange}
      />
    </div>
  );
  
  
  
}
