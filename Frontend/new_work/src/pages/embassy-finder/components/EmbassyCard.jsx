import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmbassyCard = ({ embassy, isSelected, onSelect, onGetDirections }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'text-success bg-success/10';
      case 'closed':
        return 'text-error bg-error/10';
      case 'closing-soon':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Open Now';
      case 'closed':
        return 'Closed';
      case 'closing-soon':
        return 'Closing Soon';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      className={`bg-card rounded-lg shadow-elevation-2 overflow-hidden transition-smooth cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-elevation-3'
      }`}
      onClick={() => onSelect(embassy)}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={embassy?.flag}
              alt={embassy?.flagAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1 line-clamp-2">
              {embassy?.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(embassy?.status)}`}>
                {getStatusText(embassy?.status)}
              </span>
              {embassy?.distance && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon name="MapPin" size={12} />
                  {embassy?.distance} km away
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2 text-sm text-foreground">
            <Icon name="MapPin" size={16} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
            <span className="line-clamp-2">{embassy?.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Icon name="Phone" size={16} className="flex-shrink-0 text-muted-foreground" />
            <a href={`tel:${embassy?.phone}`} className="hover:text-primary transition-smooth" onClick={(e) => e?.stopPropagation()}>
              {embassy?.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Icon name="Clock" size={16} className="flex-shrink-0 text-muted-foreground" />
            <span>{embassy?.hours}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 mb-3 pt-3 border-t border-border">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Available Services</h4>
              <div className="flex flex-wrap gap-2">
                {embassy?.services?.map((service, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Processing Time</h4>
              <p className="text-sm text-muted-foreground">{embassy?.processingTime}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                {embassy?.paymentMethods?.map((method, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-muted text-foreground rounded"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {embassy?.appointmentRequired && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                <Icon name="AlertCircle" size={16} className="flex-shrink-0 mt-0.5 text-warning" />
                <p className="text-sm text-warning">Appointment required for visa services</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Icon name="Star" size={16} color="var(--color-accent)" />
              <span className="text-sm font-medium text-foreground">{embassy?.rating}</span>
              <span className="text-sm text-muted-foreground">({embassy?.reviewCount} reviews)</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => {
              e?.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            {isExpanded ? 'Less Info' : 'More Info'}
          </Button>
          <Button
            variant="default"
            size="sm"
            fullWidth
            onClick={(e) => {
              e?.stopPropagation();
              onGetDirections(embassy);
            }}
            iconName="Navigation"
            iconPosition="left"
          >
            Directions
          </Button>
        </div>

        {embassy?.verified && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <Icon name="ShieldCheck" size={16} color="var(--color-success)" />
            <span className="text-xs text-success font-medium">Government Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbassyCard;