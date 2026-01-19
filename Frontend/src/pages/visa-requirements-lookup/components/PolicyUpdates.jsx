import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNotifications } from '../../../contexts/NotificationsContext';
import ManageSubscriptionsModal from '../../../components/ui/ManageSubscriptionsModal';

const PolicyUpdates = ({ updates }) => {
  const getUpdateTypeColor = (type) => {
    const colors = {
      'new': 'success',
      'change': 'warning',
      'alert': 'error'
    };
    return colors?.[type] || 'primary';
  };

  const getUpdateTypeIcon = (type) => {
    const icons = {
      'new': 'Plus',
      'change': 'RefreshCw',
      'alert': 'AlertTriangle'
    };
    return icons?.[type] || 'Info';
  };

  const [showManage, setShowManage] = useState(false);
  const { isSubscribed, toggleCountrySubscription } = useNotifications();

  const publishUpdate = (update) => {
    window.dispatchEvent(new CustomEvent('policy-update', { detail: update }));
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-2">
      <div className="bg-muted px-4 md:px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Bell" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-heading font-semibold text-foreground">Recent Policy Updates</h3>
          </div>
          <Button variant="ghost" size="sm" iconName="Settings" onClick={() => setShowManage(true)}>
            Manage Alerts
          </Button>
        </div>
      </div>
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {updates?.map((update, index) => (
          <div key={index} className="p-4 md:p-6 hover:bg-muted/30 transition-smooth">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-${getUpdateTypeColor(update?.type)}/10`}>
                <Icon
                  name={getUpdateTypeIcon(update?.type)}
                  size={20}
                  color={`var(--color-${getUpdateTypeColor(update?.type)})`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-medium text-foreground">{update?.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{update?.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{update?.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{update?.country}</span>

                  <div className="ml-2 flex items-center gap-2">
                    <Button size="sm" variant={isSubscribed(update?.country) ? 'destructive' : 'outline'} onClick={() => toggleCountrySubscription(update?.country)}>
                      {isSubscribed(update?.country) ? 'Unsubscribe' : 'Subscribe'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => publishUpdate(update)}>Simulate</Button>
                  </div>

                  {update?.urgent && (
                    <span className="text-xs px-2 py-1 bg-error/10 text-error rounded-full font-medium">Urgent</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ManageSubscriptionsModal isOpen={showManage} onClose={() => setShowManage(false)} />
    </div>
  );
};

export default PolicyUpdates;