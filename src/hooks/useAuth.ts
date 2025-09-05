import { useState, useEffect } from 'react';

const getStoredCredentials = () => {
  const stored = localStorage.getItem('admin_credentials');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback to default if corrupted
    }
  }
  return {
    username: 'admin',
    password: 'roue2024!'
  };
};

const saveCredentials = (credentials: { username: string; password: string }) => {
  localStorage.setItem('admin_credentials', JSON.stringify(credentials));
};

const AUTH_KEY = 'roue_auth_token';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEY);
    if (token) {
      try {
        const data = JSON.parse(atob(token));
        const isValid = data.timestamp > Date.now() - (24 * 60 * 60 * 1000); // 24h expiry
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const credentials = getStoredCredentials();
    if (username === credentials.username && password === credentials.password) {
      const token = btoa(JSON.stringify({ timestamp: Date.now(), user: username }));
      localStorage.setItem(AUTH_KEY, token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const updateCredentials = (newCredentials: { username: string; password: string }): boolean => {
    try {
      saveCredentials(newCredentials);
      return true;
    } catch {
      return false;
    }
  };

  const getCurrentCredentials = () => {
    return getStoredCredentials();
  };

  return { isAuthenticated, loading, login, logout, updateCredentials, getCurrentCredentials };
}