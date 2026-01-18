import React, { useState, useMemo, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useCurrency } from '../../../contexts/CurrencyContext';

const DEFAULT_ESTIMATES = {
  accommodation: 100, // per day USD
  food: 30, // per day
  transport: 50, // per destination
  visaFee: 100 // per destination
};

const CostEstimatorModal = ({ isOpen, onClose, trips = [] }) => {
  const { currency, convert } = useCurrency();
  const [selectedTripId, setSelectedTripId] = useState(trips?.[0]?.id || null);
  const [nights, setNights] = useState(7);
  const [estimates, setEstimates] = useState(DEFAULT_ESTIMATES);

  useEffect(() => {
    if (trips?.[0]) setSelectedTripId(trips[0].id);
  }, [trips]);

  const selectedTrip = useMemo(() => trips?.find((t) => t?.id === selectedTripId), [trips, selectedTripId]);

  const computeTotals = () => {
    if (!selectedTrip) return { totalUSD: 0, perDestination: [] };
    const days = nights;
    let totalUSD = 0;
    const perDestination = (selectedTrip.destinations || []).map((d) => {
      const visa = estimates.visaFee || 0;
      const transport = estimates.transport || 0;
      const accommodation = (estimates.accommodation || 0) * days;
      const food = (estimates.food || 0) * days;
      const subtotal = visa + transport + accommodation + food;
      totalUSD += subtotal;
      return { country: d.country, subtotal, breakdown: { visa, transport, accommodation, food } };
    });
    return { totalUSD, perDestination };
  };

  const { totalUSD, perDestination } = computeTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-400 flex items-start justify-center bg-black/40 pt-16">
      <div className="w-full max-w-3xl bg-card border border-border rounded-lg shadow-elevation-12 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calculator" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-medium">Cost Estimator</h3>
            <span className="text-sm text-muted-foreground">Estimate trip costs and convert to your currency ({currency?.symbol} {currency?.code})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Select trip</label>
              <select className="w-full border border-input rounded px-3 py-2" value={selectedTripId || ''} onChange={(e) => setSelectedTripId(Number(e.target.value))}>
                {trips?.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.departureDate}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of nights</label>
              <input type="number" min={1} value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full border border-input rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Accommodation (per night USD)</label>
              <input type="number" value={estimates.accommodation} onChange={(e) => setEstimates((p) => ({ ...p, accommodation: Number(e.target.value) }))} className="w-full border border-input rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Food (per day USD)</label>
              <input type="number" value={estimates.food} onChange={(e) => setEstimates((p) => ({ ...p, food: Number(e.target.value) }))} className="w-full border border-input rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transport (per destination USD)</label>
              <input type="number" value={estimates.transport} onChange={(e) => setEstimates((p) => ({ ...p, transport: Number(e.target.value) }))} className="w-full border border-input rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visa fee (per destination USD)</label>
              <input type="number" value={estimates.visaFee} onChange={(e) => setEstimates((p) => ({ ...p, visaFee: Number(e.target.value) }))} className="w-full border border-input rounded px-3 py-2" />
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="font-medium mb-2">Estimated breakdown</h4>
            {perDestination?.map((d) => (
              <div key={d.country} className="flex items-center justify-between p-2 border-b">
                <div>
                  <div className="font-medium">{d.country}</div>
                  <div className="text-xs text-muted-foreground">{d.breakdown.accommodation.toFixed(2)} + {d.breakdown.food.toFixed(2)} + {d.breakdown.transport.toFixed(2)} + {d.breakdown.visa.toFixed(2)} USD</div>
                </div>
                <div className="text-right font-medium">{currency?.symbol}{convert(d.subtotal)}</div>
              </div>
            ))}

            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-muted-foreground">Total (approx)</div>
              <div className="font-semibold text-lg">{currency?.symbol}{convert(totalUSD)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimatorModal;
