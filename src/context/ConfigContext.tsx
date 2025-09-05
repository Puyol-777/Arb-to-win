import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppConfig } from '../types';
import { getStoredConfig, saveConfig } from '../utils/config';

interface ConfigContextValue {
  config: AppConfig;
  updateConfig: (config: AppConfig | ((prev: AppConfig) => AppConfig)) => void;
  reloadConfig: () => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => getStoredConfig());
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel('config_channel');
    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === 'configUpdated') {
        setConfig(event.data.payload as AppConfig);
      }
    };
    channelRef.current = channel;
    return () => channel.close();
  }, []);

  const updateConfig = (value: AppConfig | ((prev: AppConfig) => AppConfig)) => {
    setConfig(prev => {
      const next = typeof value === 'function' ? (value as (p: AppConfig) => AppConfig)(prev) : value;
      saveConfig(next);
      channelRef.current?.postMessage({ type: 'configUpdated', payload: next });
      return next;
    });
  };

  const reloadConfig = () => {
    setConfig(getStoredConfig());
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, reloadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

