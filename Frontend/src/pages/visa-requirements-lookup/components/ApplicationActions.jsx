import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationActions = ({ destination, visaType, appointmentRequired = false, onBook }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Start Application',
      icon: 'FileText',
      variant: 'default',
      onClick: () => navigate('/application-tracking')
    },
    {
      label: 'Find Embassy',
      icon: 'MapPin',
      variant: 'outline',
      onClick: () => navigate('/embassy-finder')
    },
    {
      label: 'View Checklist',
      icon: 'CheckSquare',
      variant: 'outline',
      onClick: () => {}
    },
    {
      label: 'Calculate Costs',
      icon: 'Calculator',
      variant: 'outline',
      onClick: () => {}
    }
  ];

  if (appointmentRequired && onBook) {
    actions.unshift({ label: 'Book Appointment', icon: 'Calendar', variant: 'default', onClick: onBook });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Get started with your visa application</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            onClick={action?.onClick}
            fullWidth
          >
            {action?.label}
          </Button>
        ))}
      </div>
      <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Application Timeline</p>
            <p className="text-sm text-muted-foreground">
              We recommend starting your {visaType} application at least 45 days before your departure date to account for processing time and potential delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationActions;