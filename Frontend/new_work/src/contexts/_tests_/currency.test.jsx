import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CurrencyProvider, useCurrency } from '../CurrencyContext';
import { describe, it, expect } from 'vitest';

const wrapper = ({ children }) => <CurrencyProvider>{children}</CurrencyProvider>;

describe('CurrencyContext', () => {
  it('converts USD amounts to selected currency', () => {
    const { result } = renderHook(() => useCurrency(), { wrapper });
    act(() => {
      result.current.setCurrencyByCode('EUR');
    });
    const converted = result.current.convert(100);
    expect(typeof converted).toBe('number');
    expect(converted).toBeCloseTo(92, 0); // using default 0.92 rate
  });
});