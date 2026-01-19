import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparisonPanel = ({ embassies, onRemove, onClearAll }) => {
  if (embassies?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Compare Embassies ({embassies?.length})
        </h3>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-foreground">Embassy</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Distance</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Processing</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Rating</th>
              <th className="text-left py-3 px-2 font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {embassies?.map((embassy) => (
              <tr key={embassy?.id} className="border-b border-border last:border-b-0">
                <td className="py-3 px-2">
                  <div className="font-medium text-foreground line-clamp-1">{embassy?.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{embassy?.address}</div>
                </td>
                <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                  {embassy?.distance} km
                </td>
                <td className="py-3 px-2 text-muted-foreground">
                  {embassy?.processingTime}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} color="var(--color-accent)" />
                    <span className="text-foreground font-medium">{embassy?.rating}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => onRemove(embassy?.id)}
                    className="text-error hover:text-error/80 transition-smooth"
                    aria-label="Remove from comparison"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonPanel;