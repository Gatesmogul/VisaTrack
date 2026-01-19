import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import visaRules from '../../data/visaRules';
import { useNotifications } from '../../contexts/NotificationsContext';

const ManageSubscriptionsModal = ({ isOpen, onClose }) => {
  const { subscribeToCountry, unsubscribeFromCountry, isSubscribed } = useNotifications();

  if (!isOpen) return null;

  const countries = visaRules.map((r) => ({ code: r.code, name: r.country }));

  return (
    <div className="fixed inset-0 z-500 flex items-start justify-center bg-black/40 pt-16">
      <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-elevation-12 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Bell" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-medium">Manage Policy Subscriptions</h3>
            <span className="text-sm text-muted-foreground">Choose countries you want to receive policy alerts for</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {countries.map((c) => (
            <div key={c.code} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.code}</div>
              </div>
              <div>
                {isSubscribed(c.name) ? (
                  <Button variant="destructive" size="sm" onClick={() => unsubscribeFromCountry(c.name)}>Unsubscribe</Button>
                ) : (
                  <Button variant="default" size="sm" onClick={() => subscribeToCountry(c.name)}>Subscribe</Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionsModal;