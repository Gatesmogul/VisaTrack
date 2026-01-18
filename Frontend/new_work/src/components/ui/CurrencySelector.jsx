import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import Icon from '../AppIcon';

const CurrencySelector = () => {
  const { currency, available, setCurrencyByCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted flex items-center gap-2">
        <span className="font-medium">{currency?.symbol} {currency?.code}</span>
        <Icon name="ChevronDown" size={12} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-popover border border-border rounded-lg shadow-elevation-4 z-200">
          <div className="p-2">
            {available.map((c) => (
              <button key={c.code} onClick={() => { setCurrencyByCode(c.code); setOpen(false); }} className="w-full text-left px-2 py-2 hover:bg-muted rounded">
                <span className="font-medium">{c.symbol} {c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
