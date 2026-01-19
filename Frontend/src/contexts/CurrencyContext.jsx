import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);
const STORAGE_KEY = 'visatrack.currency';

const DEFAULT = { code: 'USD', symbol: '$', rate: 1 };

const RATES = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
  NGN: { code: 'NGN', symbol: '₦', rate: 1500 },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67 }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT;
    } catch (e) {
      return DEFAULT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currency));
    } catch (e) {}
  }, [currency]);

  const setCurrencyByCode = (code) => {
    const c = RATES[code] || DEFAULT;
    setCurrency(c);
  };

  const convert = (amountUSD) => {
    if (amountUSD == null) return null;
    return Number((amountUSD * (currency?.rate || 1)).toFixed(2));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyByCode, convert, available: Object.keys(RATES).map(k => RATES[k]) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export default CurrencyContext;
