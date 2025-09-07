import React, { useState, useEffect } from 'react';
import { Menu, X, Settings as SettingsIcon } from 'lucide-react';
import { Wheel } from './components/Wheel';
import { Rules } from './components/Rules';
import { Legal } from './components/Legal';
import { PrizeModal } from './components/PrizeModal';
import { Dashboard } from './components/Admin/Dashboard';
import { Login } from './components/Admin/Login';
import { useAuth } from './hooks/useAuth';
import { StatsManager } from './utils/statsManager';
import { AppConfig, Prize } from './types';
import { useConfig } from './context/ConfigContext';

type ViewType = 'game' | 'rules' | 'legal' | 'admin';

function App() {
  const { config, updateConfig } = useConfig();
  const [currentView, setCurrentView] = useState<ViewType>('game');
  const [menuOpen, setMenuOpen] = useState(false);
  const [winningPrize, setWinningPrize] = useState<Prize | null>(null);
  const { isAuthenticated, loading, login, logout } = useAuth();
  const statsManager = StatsManager.getInstance();

  const activeTheme = config.themes.find(t => t.id === config.activeTheme);

  useEffect(() => {
    if (activeTheme) {
      document.documentElement.style.setProperty('--primary-color', activeTheme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', activeTheme.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', activeTheme.accentColor);
      document.documentElement.style.setProperty('--bg-color', activeTheme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', activeTheme.textColor);

      document.body.style.backgroundColor = activeTheme.backgroundColor;
      document.body.style.color = activeTheme.textColor;
    }
  }, [activeTheme]);

  const handleResult = (prizeId: string) => {
    const prize = config.prizes.find(p => p.id === prizeId);
    if (prize) {
      setWinningPrize(prize);

      const newStats = statsManager.updateDailyStats(config.stats, 'spin');
      newStats.prizeDistribution = {
        ...newStats.prizeDistribution,
        [prize.label]: (newStats.prizeDistribution[prize.label] || 0) + 1
      };

      updateConfig(prev => ({ ...prev, stats: newStats }));
    }
  };

  const handleStatsUpdate = (type: 'spin' | 'review') => {
    if (type === 'review') {
      const newStats = statsManager.updateDailyStats(config.stats, 'review');
      updateConfig(prev => ({ ...prev, stats: newStats }));
    }
  };

  const handleReviewClick = () => {
    console.log('🎯 App - handleReviewClick - URL utilisée:', config.gameSettings.googleReviewUrl);
    handleStatsUpdate('review');
    window.open(config.gameSettings.googleReviewUrl, '_blank');
  };

  const handleActionButtonClick = (url: string) => {
    console.log('🎯 App - handleActionButtonClick - URL utilisée:', url);
    window.open(url, '_blank');
  };

  const handleUpdateConfig = (newConfig: AppConfig) => {
    try {
      console.log('💾 Saving configuration...');
      updateConfig(newConfig);
      console.log('✅ Configuration saved successfully');
    } catch (error) {
      console.error('❌ Error saving configuration:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const menuItems = [
    { id: 'game' as ViewType, label: 'Jouer', icon: '🎮' },
    { id: 'rules' as ViewType, label: 'Règles du jeu', icon: '📋' },
    { id: 'legal' as ViewType, label: 'Mentions légales', icon: '📄' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return <Login onLogin={login} />;
    }
    return (
      <Dashboard
        config={config}
        onUpdateConfig={handleUpdateConfig}
        onLogout={() => {
          logout();
          setCurrentView('game');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: activeTheme?.backgroundColor }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setCurrentView('game')}
              className="text-xl font-bold text-green-600"
            >
              Arb' Aventure
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('admin')}
                className="text-gray-600 hover:text-gray-800"
                title="Administration"
              >
                <SettingsIcon size={20} />
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-600 hover:text-gray-800 md:hidden"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <nav className="hidden md:flex space-x-6">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`text-sm font-medium transition-colors ${
                      currentView === item.id
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="px-4 py-2 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'game' && (
          <Wheel onResult={handleResult} onStatsUpdate={handleStatsUpdate} />
        )}
      </main>

      {/* Modals */}
      {currentView === 'rules' && (
        <Rules
          texts={config.texts}
          onClose={() => setCurrentView('game')}
        />
      )}

      {currentView === 'legal' && (
        <Legal
          texts={config.texts}
          onClose={() => setCurrentView('game')}
        />
      )}

      {winningPrize && (
        <PrizeModal
          prize={winningPrize}
          texts={config.texts}
          gameSettings={config.gameSettings}
          onClose={() => setWinningPrize(null)}
          onReviewClick={handleReviewClick}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>© 2025 Arb' Aventure. Tous droits réservés.</p>
            <div className="space-x-4">
              <button
                onClick={() => setCurrentView('rules')}
                className="hover:text-gray-800"
              >
                Règles
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentView('legal')}
                className="hover:text-gray-800"
              >
                Mentions légales
              </button>
              {config.texts.actionButtons
                .filter(btn => btn.isActive && btn.id !== 'google-review')
                .map(button => (
                  <React.Fragment key={button.id}>
                    <span>•</span>
                    <button
                      onClick={() => handleActionButtonClick(button.url)}
                      className="hover:text-gray-800"
                    >
                      {button.text}
                    </button>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
