import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('ve_theme') || 'dark');
  const [backendOnline, setBackendOnline] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  
  // Quick stats cache
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    scheduledAppointments: 0,
    couriersCount: 0,
    employeesCount: 0,
    productsCount: 0
  });

  // Apply theme to html document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ve_theme', theme);
  }, [theme]);

  // Ping backend on mount & periodically
  const pingBackend = async () => {
    setCheckingBackend(true);
    const isUp = await api.checkConnection();
    setBackendOnline(isUp);
    setCheckingBackend(false);
    return isUp;
  };

  useEffect(() => {
    pingBackend();
    const interval = setInterval(pingBackend, 20000);
    return () => clearInterval(interval);
  }, []);

  // Toast notification helper
  const addToast = (type, message, title) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        backendOnline,
        checkingBackend,
        pingBackend,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        stats,
        setStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
