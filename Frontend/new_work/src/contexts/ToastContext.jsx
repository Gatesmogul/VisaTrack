import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ message, type = 'default', duration = 3500 }) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };
    setToasts((t) => [toast, ...t]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col-reverse gap-3">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-xs w-full rounded-md p-3 shadow-elevation-4 text-sm text-white ${
            t.type === 'success' ? 'bg-success' : t.type === 'error' ? 'bg-error' : 'bg-primary'
          }`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
