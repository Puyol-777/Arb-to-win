import { AppConfig } from '../types';
import { cloudSync } from './cloudSync';

const defaultConfig: AppConfig = {
  prizes: [
    {
      id: '1',
      label: '☕ 1 Café',
      description: 'Un délicieux café offert',
      icon: '☕',
      color: '#8B4513',
      probability: 30,
      isActive: true
    },
    {
      id: '2',
      label: '1 Quick Jump',
      description: 'Une session de Quick Jump',
      icon: '⚡',
      color: '#FF6B35',
      probability: 25,
      isActive: true
    },
    {
      id: '3',
      label: '🌲 1 Pass Journée Accrobranche',
      description: 'Un pass pour une journée d\'accrobranche',
      icon: '🌲',
      color: '#228B22',
      probability: 20,
      isActive: true
    },
    {
      id: '4',
      label: '☕ 1 Café',
      description: 'Un autre délicieux café offert',
      icon: '☕',
      color: '#D2691E',
      probability: 10,
      isActive: true
    },
    {
      id: '5',
      label: '🍭 1 Sucette',
      description: 'Une sucette colorée',
      icon: '🍭',
      color: '#FF1493',
      probability: 10,
      isActive: true
    },
    {
      id: '6',
      label: '🧊 1 Petit Granita',
      description: 'Un rafraîchissant petit granita',
      icon: '🧊',
      color: '#00CED1',
      probability: 5,
      isActive: true
    }
  ],
  themes: [
    {
      id: 'nature',
      name: 'Nature',
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      accentColor: '#34D399',
      backgroundColor: '#F0FDF4',
      textColor: '#1F2937'
    },
    {
      id: 'paques',
      name: 'Pâques',
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      accentColor: '#FCD34D',
      backgroundColor: '#FFFBEB',
      textColor: '#1F2937'
    },
    {
      id: 'halloween',
      name: 'Halloween',
      primaryColor: '#F97316',
      secondaryColor: '#EA580C',
      accentColor: '#FB923C',
      backgroundColor: '#1F2937',
      textColor: '#F9FAFB'
    },
    {
      id: 'pirate',
      name: 'Pirate',
      primaryColor: '#7C2D12',
      secondaryColor: '#92400E',
      accentColor: '#A16207',
      backgroundColor: '#FEF3C7',
      textColor: '#1F2937'
    }
  ],
  activeTheme: 'nature',
  gameSettings: {
    playLimit: 'unlimited',
    resetAllowed: true,
    googleReviewUrl: 'https://g.page/r/your-business-id/review',
    enableHaptics: true,
    enableSound: true
  },
  texts: {
    title: 'Arb\' Aventure',
    titleFont: 'Fredoka',
    titleSize: 32,
    titleColor: '#1F2937',
    subtitle: 'Tournez la roue et gagnez des prix !',
    subtitleFont: 'Arial',
    subtitleSize: 16,
    subtitleColor: '#6B7280',
    spinButton: '🎯 Tourner la roue',
    spinButtonFont: 'Arial',
    spinButtonSize: 18,
    spinButtonColor: '#FFFFFF',
    congratulations: 'Félicitations !',
    congratulationsFont: 'Fredoka',
    congratulationsSize: 24,
    congratulationsColor: '#1F2937',
    alreadyPlayed: 'Vous avez déjà tenté votre chance ! 🎉 Merci de votre participation.',
    rulesTitle: 'Règles du jeu',
    rulesContent: `
      <h3>Comment jouer ?</h3>
      <ol>
        <li>Cliquez sur "Tourner la roue"</li>
        <li>Attendez que la roue s'arrête</li>
        <li>Découvrez votre gain !</li>
        <li>Réclamez votre prix au comptoir</li>
      </ol>
      <h3>Conditions</h3>
      <ul>
        <li>Une seule tentative par personne</li>
        <li>Les gains sont à récupérer le jour même</li>
        <li>Jeu réservé aux visiteurs du parc</li>
      </ul>
    `,
    legalTitle: 'Mentions légales',
    legalContent: `
      <h3>Éditeur</h3>
      <p>Arb' Aventure<br>
      Adresse du parc<br>
      Téléphone: XX XX XX XX XX</p>
      
      <h3>Données personnelles</h3>
      <p>Aucune donnée personnelle n'est collectée par ce jeu.</p>
      
      <h3>Cookies</h3>
      <p>Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement du jeu.</p>
    `,
    claimPrize: 'Récupérer mon gain',
    leaveReview: 'Laisser un avis',
    shareResult: 'Partager mon gain',
    actionButtons: [
      {
        id: 'google-review',
        text: '⭐⭐⭐⭐⭐ Laisser un avis',
        color: '#FFFFFF',
        backgroundColor: '#FCD34D',
        url: 'https://g.page/r/CRCJmvBKQJJREAE/review',
        isActive: true
      },
      {
        id: 'website',
        text: 'Notre site web',
        color: '#FFFFFF',
        backgroundColor: '#3B82F6',
        url: 'https://www.arb-aventure.com',
        isActive: true
      }
    ]
  },
  stats: {
    totalSpins: 0,
    dailySpins: 0,
    reviewClicks: 0,
    prizeDistribution: {},
    lastReset: new Date().toISOString(),
    dailyHistory: []
  }
};

export function getStoredConfig(): AppConfig {
  try {
    const stored = localStorage.getItem('roue_config');
    if (stored) {
      const config = JSON.parse(stored);
      console.log('📖 Chargement config - URLs:', {
        googleReviewUrl: config.gameSettings?.googleReviewUrl,
        actionButtons: config.texts?.actionButtons?.map(btn => ({ id: btn.id, url: btn.url }))
      });
      
      // Merge with default config to ensure all properties exist
      const mergedConfig = {
        ...defaultConfig,
        ...config,
        prizes: config.prizes || defaultConfig.prizes,
        themes: config.themes || defaultConfig.themes,
        texts: {
          ...defaultConfig.texts,
          ...config.texts,
          actionButtons: config.texts?.actionButtons || defaultConfig.texts.actionButtons
        },
        gameSettings: {
          ...defaultConfig.gameSettings,
          ...config.gameSettings
        },
        stats: {
          ...defaultConfig.stats,
          ...config.stats
        },
        stats: {
          ...defaultConfig.stats,
          ...config.stats,
          dailyHistory: config.stats?.dailyHistory || []
        }
      };
      
      console.log('📖 Config finale - URLs:', {
        googleReviewUrl: mergedConfig.gameSettings.googleReviewUrl,
        actionButtons: mergedConfig.texts.actionButtons.map(btn => ({ id: btn.id, url: btn.url }))
      });
      
      return mergedConfig;
    }
  } catch (error) {
    console.error('Error loading stored config:', error);
  }
  return defaultConfig;
}

export function saveConfig(config: AppConfig): void {
  try {
    const timestamp = Date.now();
    console.log('💾 Sauvegarde config - URLs:', {
      googleReviewUrl: config.gameSettings.googleReviewUrl,
      actionButtons: config.texts.actionButtons.map(btn => ({ id: btn.id, url: btn.url }))
    });
    
    const configWithVersion = {
      ...config,
      _version: timestamp,
      _lastUpdate: new Date().toISOString(),
      _cacheKey: `config_${timestamp}`
    };
    
    // Sauvegarder la configuration principale
    localStorage.setItem('roue_config', JSON.stringify(configWithVersion));
    
    // Sauvegarder avec une clé unique pour le versioning
    const configKey = `roue_config_${timestamp}`;
    localStorage.setItem(configKey, JSON.stringify(configWithVersion));
    localStorage.setItem('roue_config_current', configKey);
    
    // Trigger pour forcer la synchronisation
    localStorage.setItem('config_update_trigger', timestamp.toString());
    localStorage.setItem('last_config_update', timestamp.toString());
    localStorage.setItem('force_reload_trigger', timestamp.toString());
    
    // Sauvegarder dans le cloud pour synchronisation multi-appareils
    cloudSync.saveToCloud(configWithVersion).then(success => {
      if (success) {
        console.log('☁️ Configuration synchronisée sur tous les appareils');
      }
    });
    
    // Nettoyer les anciennes versions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('roue_config_') && key !== configKey && key !== 'roue_config_current') {
        localStorage.removeItem(key);
      }
    }
    
    // Déclencher les événements de synchronisation
    window.dispatchEvent(new CustomEvent('configUpdated', { 
      detail: { timestamp, config: configWithVersion } 
    }));
    
    // Forcer la synchronisation sur mobile
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('forceConfigReload'));
      window.dispatchEvent(new CustomEvent('configChanged', { 
        detail: { config: configWithVersion, timestamp } 
      }));
    }, 100);
    
  } catch (error) {
    console.error('Error saving config:', error);
    throw error; // Propager l'erreur pour que l'UI puisse la gérer
  }
}

export function resetConfig(): void {
  // Supprimer toutes les configurations
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('roue_config') || key === 'config_update_trigger')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}