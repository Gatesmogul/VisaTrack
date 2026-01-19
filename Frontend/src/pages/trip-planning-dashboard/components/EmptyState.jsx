import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ onCreateTrip }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-8 md:p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Plane" size={40} color="var(--color-primary)" />
        </div>
        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-card-foreground mb-3">
          Start Your Journey
        </h2>
        <p className="text-muted-foreground mb-6 text-sm md:text-base">
          Create your first trip to begin tracking visa requirements, managing applications, and ensuring a smooth travel experience.
        </p>
        <Button onClick={onCreateTrip} size="lg" iconName="Plus" iconPosition="left">
          Create Your First Trip
        </Button>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">What you can do with VisaTrack:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">Track multiple trips simultaneously</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">Get visa requirement updates</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">Receive deadline reminders</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
              <span className="text-sm text-card-foreground">Coordinate multi-country visas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;