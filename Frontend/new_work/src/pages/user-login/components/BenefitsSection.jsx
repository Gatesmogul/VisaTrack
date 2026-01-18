import React from 'react';
import Icon from '../../../components/AppIcon';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: 'Search',
      title: 'Instant Visa Lookup',
      description: 'Get visa requirements for 195+ countries in seconds based on your passport',
      color: 'var(--color-primary)'
    },
    {
      icon: 'Bell',
      title: 'Smart Deadline Tracking',
      description: 'Never miss application deadlines with automated reminders and alerts',
      color: 'var(--color-accent)'
    },
    {
      icon: 'Globe',
      title: 'Multi-Country Planning',
      description: 'Coordinate visa applications for complex multi-destination trips',
      color: 'var(--color-success)'
    },
    {
      icon: 'FileText',
      title: 'Document Management',
      description: 'Store and organize all visa documents in one secure location',
      color: 'var(--color-warning)'
    }
  ];

  const stats = [
    { value: '195+', label: 'Countries Covered' },
    { value: '50K+', label: 'Active Travelers' },
    { value: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 md:p-8 border border-border">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
          Why Choose VisaTrack?
        </h2>
        <div className="space-y-4 md:space-y-5">
          {benefits?.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${benefit?.color}15` }}
              >
                <Icon name={benefit?.icon} size={20} color={benefit?.color} />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
                  {benefit?.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {benefit?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4 md:mb-6 text-center">
          Trusted by Travelers Worldwide
        </h3>
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-1 md:mb-2">
                {stat?.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Star" size={20} color="var(--color-accent)" />
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base text-foreground italic leading-relaxed mb-2">
              "VisaTrack saved my European business trip! The multi-country planning feature helped me coordinate visas for 5 countries without any stress."
            </p>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              — Sarah Chen, Business Consultant
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="Shield" size={16} />
          <span>Bank-level Security</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Icon name="CheckCircle" size={16} />
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;