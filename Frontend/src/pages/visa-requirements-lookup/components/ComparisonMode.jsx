import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparisonMode = ({ destinations, onRemove, onAddMore }) => {
  const getVisaTypeColor = (type) => {
    const colors = {
      'visa-free': 'success',
      'visa-on-arrival': 'warning',
      'evisa': 'primary',
      'embassy': 'error'
    };
    return colors?.[type] || 'primary';
  };

  const getVisaTypeIcon = (type) => {
    const icons = {
      'visa-free': 'CheckCircle',
      'visa-on-arrival': 'Clock',
      'evisa': 'Globe',
      'embassy': 'Building'
    };
    return icons?.[type] || 'FileText';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-2">
      <div className="bg-muted px-4 md:px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="GitCompare" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-heading font-semibold text-foreground">Compare Destinations</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddMore}
        >
          Add Destination
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-foreground">Country</th>
              <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-foreground">Visa Type</th>
              <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-foreground">Processing</th>
              <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-foreground">Cost</th>
              <th className="px-4 md:px-6 py-3 text-left text-sm font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {destinations?.map((dest, index) => (
              <tr key={index} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{dest?.flag}</span>
                    <span className="font-medium text-foreground">{dest?.name}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      name={getVisaTypeIcon(dest?.visaType)}
                      size={16}
                      color={`var(--color-${getVisaTypeColor(dest?.visaType)})`}
                    />
                    <span className="text-sm text-foreground capitalize">{dest?.visaType?.replace('-', ' ')}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-sm text-foreground">{dest?.processing}</span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{dest?.cost}</span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <button
                    onClick={() => onRemove(index)}
                    className="p-1 hover:bg-error/10 rounded transition-smooth"
                    aria-label="Remove destination"
                  >
                    <Icon name="X" size={16} color="var(--color-error)" />
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

export default ComparisonMode;