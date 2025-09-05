import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { cloudSync } from '../../utils/cloudSync';
import { StatsManager } from '../../utils/statsManager';
import logger from '../../utils/logger';
import { GainsManagement } from './GainsManagement';
import { ThemeManagement } from './ThemeManagement';
import { Statistics } from './Statistics';
import { Settings } from './Settings';
import { Security } from './Security';
import { Settings as SettingsIcon, Trophy, Palette, BarChart3, Shield, LogOut } from 'lucide-react';

interface DashboardProps {
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  onLogout: () => void;
}

type TabType = 'gains' | 'themes' | 'stats' | 'settings' | 'security';

export function Dashboard({ config, onUpdateConfig, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gains');
  const [saving, setSaving] = useState(false);
  const statsManager = StatsManager.getInstance();

  const handleUpdateConfig = (updates: Partial<AppConfig>) => {
    setSaving(true);
    try {
      const newConfig = { ...config, ...updates };
      onUpdateConfig(newConfig);
      
      // Notification de succès
      setTimeout(() => {
        setSaving(false);
        
        // Forcer la synchronisation cloud
        cloudSync.saveToCloud(newConfig).then(success => {
          if (success) {
            logger.log('☁️ Modifications synchronisées sur tous les appareils');
          }
        });
        
        // Afficher une notification temporaire
        const notification = document.createElement('div');
        notification.innerHTML = '✅ Modifications sauvegardées et synchronisées !';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          z-index: 9999;
          font-weight: bold;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      }, 500);
      
      } catch {
        setSaving(false);
        alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
    };

    const handleUpdatePrizes = (prizes: unknown[]) => {
      handleUpdateConfig({ prizes });
    };

    const handleUpdateThemes = (themes: unknown[]) => {
      handleUpdateConfig({ themes });
    };

    const handleSetActiveTheme = (activeTheme: string) => {
      handleUpdateConfig({ activeTheme });
    };

    const handleUpdateSettings = (gameSettings: unknown) => {
      logger.log('🔧 Dashboard - Mise à jour settings:', gameSettings);
      handleUpdateConfig({ gameSettings });
    };

    const handleUpdateTexts = (texts: unknown) => {
      logger.log('🔧 Dashboard - Mise à jour texts:', {
        actionButtons: (texts as { actionButtons?: { id: string; url: string }[] }).actionButtons?.map(btn => ({ id: btn.id, url: btn.url }))
      });
      handleUpdateConfig({ texts });
    };

  const handleResetStats = () => {
    const newStats = statsManager.resetStats(config.stats);
    handleUpdateConfig({ stats: newStats });
  };

  const handleExportStats = () => {
    const csvContent = statsManager.exportToCSV(config.stats.dailyHistory);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roue-stats-detailed-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'gains' as TabType, label: 'Gains & Probabilités', icon: Trophy },
    { id: 'themes' as TabType, label: 'Thèmes', icon: Palette },
    { id: 'stats' as TabType, label: 'Statistiques', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Paramètres', icon: SettingsIcon },
    { id: 'security' as TabType, label: 'Sécurité', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administration - Arb' Aventure
              </h1>
              <p className="text-sm text-gray-600">
                Thème actif: {config.themes.find(t => t.id === config.activeTheme)?.name}
                {saving && <span className="ml-2 text-blue-600">💾 Sauvegarde...</span>}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-4 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main>
          {activeTab === 'gains' && (
            <GainsManagement
              prizes={config.prizes}
              onUpdatePrizes={handleUpdatePrizes}
            />
          )}
          
          {activeTab === 'themes' && (
            <ThemeManagement
              themes={config.themes}
              activeTheme={config.activeTheme}
              onUpdateThemes={handleUpdateThemes}
              onSetActiveTheme={handleSetActiveTheme}
            />
          )}
          
          {activeTab === 'stats' && (
            <Statistics
              stats={config.stats}
              onReset={handleResetStats}
              onExport={handleExportStats}
            />
          )}
          
          {activeTab === 'settings' && (
            <Settings
              gameSettings={config.gameSettings}
              texts={config.texts}
              onUpdateSettings={handleUpdateSettings}
              onUpdateTexts={handleUpdateTexts}
            />
          )}
          
          {activeTab === 'security' && (
            <Security onLogout={onLogout} />
          )}
        </main>
      </div>
    </div>
  );
}
