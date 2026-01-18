import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as mockLogin } from '../utils/mockAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const login = async ({ email, password }, remember = false) => {
    const res = await mockLogin({ email, password });
    setUser(res.user);
    setToken(res.token);
    try {
      const store = { user: res.user, token: res.token };
      if (remember) {
        localStorage.setItem('auth', JSON.stringify(store));
      } else {
        sessionStorage.setItem('auth', JSON.stringify(store));
      }
    } catch (e) {
      // ignore
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try { localStorage.removeItem('auth'); sessionStorage.removeItem('auth'); } catch (e) {}
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      try {
        const rawLocal = localStorage.getItem('auth');
        const rawSession = sessionStorage.getItem('auth');
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          parsed.user = next;
          localStorage.setItem('auth', JSON.stringify(parsed));
        } else if (rawSession) {
          const parsed = JSON.parse(rawSession);
          parsed.user = next;
          sessionStorage.setItem('auth', JSON.stringify(parsed));
        } else {
          // default to local
          localStorage.setItem('auth', JSON.stringify({ user: next, token }));
        }
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const register = async ({ name, email, password, phone, passports } , remember = true) => {
    // Create a mock user and persist to a simple users list in localStorage
    try {
      const rawUsers = localStorage.getItem('users');
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      if (users.find((u) => u.email === email)) {
        throw new Error('An account with this email already exists');
      }
      const newUser = {
        id: Date.now().toString(36),
        name: name || '',
        email,
        password,
        phone: phone || '',
        passports: passports || []
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const token = 'mock-token-' + Date.now();
      setUser({ id: newUser.id, name: newUser.name, email: newUser.email, passports: newUser.passports });
      setToken(token);

      try {
        const store = { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token };
        if (remember) {
          localStorage.setItem('auth', JSON.stringify(store));
        } else {
          sessionStorage.setItem('auth', JSON.stringify(store));
        }
      } catch (e) {
        // ignore
      }

      return { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token };
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateProfile, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
