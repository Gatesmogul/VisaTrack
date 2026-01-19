import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationProgress = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Personal Info', icon: 'User' },
    { number: 2, label: 'Passport Details', icon: 'FileText' },
    { number: 3, label: 'Travel Preferences', icon: 'Settings' }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {steps?.map((step) => (
          <div key={step?.number} className="flex flex-col items-center gap-2 bg-background px-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step?.number < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step?.number === currentStep
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step?.number < currentStep ? (
                <Icon name="Check" size={20} />
              ) : (
                <Icon name={step?.icon} size={20} />
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                step?.number <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step?.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationProgress;