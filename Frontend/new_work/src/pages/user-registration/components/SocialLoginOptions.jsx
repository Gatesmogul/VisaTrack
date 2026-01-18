import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLoginOptions = () => {
  const socialProviders = [
    { name: 'Google', icon: 'Mail', color: 'var(--color-error)' },
    { name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
    { name: 'Apple', icon: 'Apple', color: 'var(--color-foreground)' }
  ];

  const handleSocialLogin = (provider) => {
    console.log(`Social login with ${provider}`);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {socialProviders?.map((provider) => (
          <Button
            key={provider?.name}
            variant="outline"
            onClick={() => handleSocialLogin(provider?.name)}
            className="w-full"
          >
            <Icon name={provider?.icon} size={18} color={provider?.color} />
            <span className="ml-2">{provider?.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SocialLoginOptions;