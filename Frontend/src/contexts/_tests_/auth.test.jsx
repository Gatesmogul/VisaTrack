import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { describe, it, expect } from 'vitest';

describe('AuthContext.register', () => {
  it('registers and persists new user to localStorage', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    // ensure clean state
    localStorage.removeItem('users');
    localStorage.removeItem('auth');

    await act(async () => {
      const res = await result.current.register({ name: 'Test User', email: 't@example.com', password: 'Password1' }, true);
      expect(res.user.email).toBe('t@example.com');
    });

    const rawUsers = JSON.parse(localStorage.getItem('users'));
    expect(Array.isArray(rawUsers)).toBeTruthy();
    expect(rawUsers.find((u) => u.email === 't@example.com')).toBeTruthy();

    const rawAuth = JSON.parse(localStorage.getItem('auth'));
    expect(rawAuth).toBeTruthy();
    expect(rawAuth.user.email).toBe('t@example.com');
  });
});
