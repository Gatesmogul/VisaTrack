import React, { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status }) => {
  if (status === 'impossible') return <span className="text-xs text-error bg-error/10 px-2 py-0.5 rounded">Impossible</span>;
  if (status === 'marginal') return <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded">At risk</span>;
  return <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded">Feasible</span>;
};

const FullTimelineModal = ({ isOpen, onClose, assessments = [] }) => {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState({});

  const filtered = useMemo(() => {
    if (filter === 'all') return assessments;
    return assessments.filter((a) => a.status === filter);
  }, [assessments, filter]);

  const exportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(assessments, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visatrack-timeline-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-400 flex items-start justify-center bg-black/40 pt-16">
      <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-elevation-12 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-medium">Full Timeline & Feasibility</h3>
            <span className="text-sm text-muted-foreground">({assessments?.length || 0} trips)</span>
          </div>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-input rounded px-2 py-1">
              <option value="all">All</option>
              <option value="feasible">Feasible</option>
              <option value="marginal">At risk</option>
              <option value="impossible">Impossible</option>
            </select>
            <Button variant="outline" onClick={exportJSON}>Export JSON</Button>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
          {filtered?.length === 0 ? (
            <div className="text-sm text-muted-foreground">No trips match the selected filter.</div>
          ) : (
            filtered.map((t) => (
              <div key={t.tripId} className="border border-border rounded p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{t.tripName}</h4>
                    <StatusBadge status={t.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setExpanded((s) => ({ ...s, [t.tripId]: !s[t.tripId] }))}>
                      {expanded[t.tripId] ? 'Hide details' : 'View details'}
                    </Button>
                  </div>
                </div>

                {expanded[t.tripId] && (
                  <div className="mt-3">
                    <div className="text-sm text-muted-foreground mb-2">Per-destination assessment</div>
                    <div className="space-y-2">
                      {t.perDestination.map((p) => (
                        <div key={p.country} className="flex items-start justify-between gap-4 p-2 border rounded">
                          <div>
                            <div className="font-medium">{p.country}</div>
                            <div className="text-xs text-muted-foreground">{p.reason}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default FullTimelineModal;
