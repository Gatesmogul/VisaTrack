import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ToastProvider } from './contexts/ToastContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CommunityProvider } from './contexts/CommunityContext';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <NotificationsProvider>
            <CommunityProvider>
              <App />
            </CommunityProvider>
          </NotificationsProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
