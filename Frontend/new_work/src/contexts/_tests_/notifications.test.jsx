import React from 'react';
import { render, act } from '@testing-library/react';
import { NotificationsProvider, useNotifications } from '../NotificationsContext';

const TestConsumer = ({ onReady }) => {
  const ctx = useNotifications();
  React.useEffect(() => {
    if (onReady) onReady(ctx);
  }, [ctx]);
  return null;
};

describe('Notifications subscriptions', () => {
  test('subscribe toggles and policy-update event creates notification for subscribed country', () => {
    let ctxRef = null;
    render(
      <NotificationsProvider>
        <TestConsumer onReady={(ctx) => { ctxRef = ctx; }} />
      </NotificationsProvider>
    );

    act(() => {
      ctxRef.subscribeToCountry('Thailand');
    });

    expect(ctxRef.preferences.subscribedCountries).toContain('thailand');

    act(() => {
      // dispatch a policy-update event
      window.dispatchEvent(new CustomEvent('policy-update', { detail: { country: 'Thailand', title: 'Test Change', description: 'Details' } }));
    });

    // newly added notification should appear
    expect(ctxRef.notifications.some(n => n.type === 'policy' && n.message.includes('Test Change'))).toBe(true);
  });
});