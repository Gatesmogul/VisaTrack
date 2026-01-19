import React from 'react';
import Icon from '../../../components/AppIcon';

const VisaStatusCard = ({ type, title, description, details, icon, color }) => {
  const colorClasses = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    error: 'bg-error/10 text-error border-error/20',
    primary: 'bg-primary/10 text-primary border-primary/20'
  };

  const iconBgClasses = {
    success: 'bg-success/20',
    warning: 'bg-warning/20',
    error: 'bg-error/20',
    primary: 'bg-primary/20'
  };

  const iconColorMap = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    primary: 'var(--color-primary)'
  };

  return (
    <div className={`border rounded-lg p-4 md:p-6 ${colorClasses?.[color]}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClasses?.[color]}`}>
          <Icon name={icon} size={24} color={iconColorMap?.[color]} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-2">{title}</h3>
          <p className="text-sm md:text-base opacity-90 mb-4">{description}</p>
          {details && details?.length > 0 && (
            <ul className="space-y-2">
              {details?.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Icon name="Check" size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaStatusCard;