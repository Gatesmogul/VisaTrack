import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProfileSettings from '../index';
import AuthContext from '../../../contexts/AuthContext';
import NotificationsContext from '../../../contexts/NotificationsContext';
import ToastContext from '../../../contexts/ToastContext';

describe('ProfileSettings integration', () => {
  test('managing passports triggers updateProfile with passports', async () => {
    const updateProfile = vi.fn();
    const user = { name: 'Test', email: 't@example.com', passports: [] };

    const notificationsCtx = {
      notifications: [],
      preferences: {},
      updatePreferences: vi.fn(),
      clearAll: vi.fn(),
    };

    const toastCtx = { showToast: vi.fn() };

    render(
      <AuthContext.Provider value={{ user, updateProfile, logout: vi.fn() }}>
        <NotificationsContext.Provider value={notificationsCtx}>
          <ToastContext.Provider value={toastCtx}>
            <ProfileSettings />
          </ToastContext.Provider>
        </NotificationsContext.Provider>
      </AuthContext.Provider>
    );

    // open modal
    await userEvent.click(screen.getByRole('button', { name: /Manage passports/i }));

    // add passport via modal
    await userEvent.type(screen.getByLabelText(/Country/i), 'Kenya');
    await userEvent.type(screen.getByLabelText(/Passport Number/i), 'K1234567');
    await userEvent.type(screen.getByLabelText(/Expiry date/i), '2028-11-11');
    await userEvent.click(screen.getByRole('button', { name: /Add passport/i }));

    // save passports
    await userEvent.click(screen.getByRole('button', { name: /Save passports/i }));

    await waitFor(() => expect(updateProfile).toHaveBeenCalled());
    const updated = updateProfile.mock.calls[0][0];
    expect(updated.passports).toBeDefined();
    expect(updated.passports[0].country).toBe('Kenya');
  });
});