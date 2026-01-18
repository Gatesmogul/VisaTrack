import React from 'react';
import Icon from '../../../components/AppIcon';

const DeadlineAlert = ({ deadline }) => {
  const getUrgencyStyles = (urgency) => {
    const styles = {
      'critical': {
        bg: 'bg-error/10',
        border: 'border-error/20',
        icon: 'text-error',
        text: 'text-error'
      },
      'high': {
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        icon: 'text-warning',
        text: 'text-warning'
      },
      'medium': {
        bg: 'bg-accent/10',
        border: 'border-accent/20',
        icon: 'text-accent',
        text: 'text-accent'
      }
    };
    return styles?.[urgency] || styles?.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (dateString) => {
    const target = new Date(dateString);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const styles = getUrgencyStyles(deadline?.urgency);
  const daysRemaining = getDaysRemaining(deadline?.date);

  return (
    <div className={`p-3 md:p-4 border rounded-lg ${styles?.bg} ${styles?.border}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-card flex-shrink-0 ${styles?.icon}`}>
          <Icon name={deadline?.icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-1">
            <h4 className="text-sm md:text-base font-medium text-foreground truncate">{deadline?.title}</h4>
            <span className={`text-xs md:text-sm font-semibold whitespace-nowrap ${styles?.text}`}>
              {daysRemaining} days left
            </span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">{deadline?.description}</p>
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} className="flex-shrink-0" />
            <span>{formatDate(deadline?.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlineAlert;