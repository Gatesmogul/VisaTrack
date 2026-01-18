import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const signals = [
    {
      icon: 'Shield',
      title: 'Government Verified',
      description: 'All visa data sourced from official government websites and embassies',
      color: 'var(--color-primary)'
    },
    {
      icon: 'Lock',
      title: 'Secure & Private',
      description: 'Your passport and personal data encrypted with bank-level security',
      color: 'var(--color-success)'
    },
    {
      icon: 'Clock',
      title: 'Real-time Updates',
      description: 'Instant notifications when visa policies change for your destinations',
      color: 'var(--color-accent)'
    },
    {
      icon: 'Users',
      title: 'Trusted by 50,000+ Travelers',
      description: 'Join thousands who successfully navigated visa requirements',
      color: 'var(--color-primary)'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Why Choose VisaTrack?
      </h3>
      {signals?.map((signal, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${signal?.color}15` }}
          >
            <Icon name={signal?.icon} size={20} color={signal?.color} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">{signal?.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {signal?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustSignals;