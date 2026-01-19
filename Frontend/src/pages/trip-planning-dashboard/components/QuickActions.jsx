import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      title: 'Visa Lookup',
      description: 'Check visa requirements for any destination',
      icon: 'Search',
      color: 'primary',
      path: '/visa-requirements-lookup'
    },
    {
      title: 'Track Applications',
      description: 'Monitor your visa application status',
      icon: 'FileText',
      color: 'accent',
      path: '/application-tracking'
    },
    {
      title: 'Find Embassy',
      description: 'Locate nearest embassy or consulate',
      icon: 'MapPin',
      color: 'success',
      path: '/embassy-finder'
    },
    {
      title: 'Cost Estimator',
      description: 'Estimate trip costs and convert to your currency',
      icon: 'Calculator',
      color: 'primary',
      path: null,
      action: 'cost-estimator'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'accent':
        return 'bg-accent/10 text-accent hover:bg-accent/20';
      case 'success':
        return 'bg-success/10 text-success hover:bg-success/20';
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {actions?.map((action, index) => {
        const isButton = action?.action === 'cost-estimator';
        if (isButton) {
          return (
            <button
              key={index}
              onClick={() => typeof onAction === 'function' && onAction(action?.action)}
              className={`p-4 md:p-6 rounded-lg transition-smooth ${getColorClasses(action?.color)} group text-left`}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  <Icon name={action?.icon} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-base md:text-lg mb-1 group-hover:underline">
                    {action?.title}
                  </h3>
                  <p className="text-xs md:text-sm opacity-80 line-clamp-2">{action?.description}</p>
                </div>
                <Icon name="ArrowRight" size={18} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-smooth" />
              </div>
            </button>
          );
        }

        return (
          <Link
            key={index}
            to={action?.path}
            className={`p-4 md:p-6 rounded-lg transition-smooth ${getColorClasses(action?.color)} group`}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0">
                <Icon name={action?.icon} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-base md:text-lg mb-1 group-hover:underline">
                  {action?.title}
                </h3>
                <p className="text-xs md:text-sm opacity-80 line-clamp-2">{action?.description}</p>
              </div>
              <Icon name="ArrowRight" size={18} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;