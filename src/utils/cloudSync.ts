// Système de synchronisation cloud simple
interface CloudConfig {
  id: string;
  config: any;
  timestamp: number;
  version: number;
}

const CLOUD_STORAGE_KEY = 'roue_cloud_config';
const SYNC_ENDPOINT = 'https://api.jsonbin.io/v3/b'; // Service gratuit pour demo

export class CloudSyncManager {
  private syncInterval: number | null = null;
  private lastSyncTime = 0;
  private isOnline = navigator.onLine;

  constructor() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.startSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.stopSync();
    });

    // Démarrer la synchronisation si en ligne
    if (this.isOnline) {
      this.startSync();
    }
  }

  startSync() {
    if (this.syncInterval) return;
    
    console.log('🌐 Démarrage de la synchronisation cloud');
    
    // Synchroniser immédiatement
    this.syncFromCloud();
    
    // Puis toutes les 5 secondes
    this.syncInterval = window.setInterval(() => {
      this.syncFromCloud();
    }, 5000);
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🌐 Arrêt de la synchronisation cloud');
    }
  }

  async saveToCloud(config: any): Promise<boolean> {
    if (!this.isOnline) {
      console.log('📱 Hors ligne - sauvegarde locale uniquement');
      return false;
    }

    try {
      const cloudConfig: CloudConfig = {
        id: 'roue-config',
        config,
        timestamp: Date.now(),
        version: Date.now()
      };

      // Simuler une sauvegarde cloud avec localStorage partagé
      // En production, ceci serait remplacé par un vrai service cloud
      const cloudData = JSON.stringify(cloudConfig);
      
      // Utiliser sessionStorage comme "cloud" temporaire pour la démo
      sessionStorage.setItem('shared_roue_config', cloudData);
      
      // Déclencher un événement pour notifier les autres onglets
      localStorage.setItem('cloud_sync_trigger', Date.now().toString());
      
      console.log('☁️ Configuration sauvegardée dans le cloud');
      return true;
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde cloud:', error);
      return false;
    }
  }

  async syncFromCloud(): Promise<boolean> {
    if (!this.isOnline) return false;

    try {
      // Récupérer depuis le "cloud" (sessionStorage pour la démo)
      const cloudData = sessionStorage.getItem('shared_roue_config');
      
      if (!cloudData) {
        console.log('☁️ Aucune configuration cloud trouvée');
        return false;
      }

      const cloudConfig: CloudConfig = JSON.parse(cloudData);
      
      // Vérifier si c'est plus récent que notre version locale
      const localConfig = localStorage.getItem('roue_config');
      let shouldUpdate = true;
      
      if (localConfig) {
        const local = JSON.parse(localConfig);
        const localTimestamp = local._version || 0;
        
        if (cloudConfig.timestamp <= localTimestamp) {
          shouldUpdate = false;
        }
      }

      if (shouldUpdate && cloudConfig.timestamp > this.lastSyncTime) {
        console.log('☁️ Mise à jour depuis le cloud détectée');
        
        // Sauvegarder la nouvelle configuration localement
        const configWithMeta = {
          ...cloudConfig.config,
          _version: cloudConfig.timestamp,
          _cloudSync: true,
          _lastCloudSync: new Date().toISOString()
        };
        
        localStorage.setItem('roue_config', JSON.stringify(configWithMeta));
        
        // Déclencher les événements de mise à jour
        localStorage.setItem('config_update_trigger', cloudConfig.timestamp.toString());
        localStorage.setItem('last_config_update', cloudConfig.timestamp.toString());
        
        window.dispatchEvent(new CustomEvent('configUpdated', { 
          detail: { timestamp: cloudConfig.timestamp, config: configWithMeta, source: 'cloud' } 
        }));
        
        window.dispatchEvent(new CustomEvent('forceConfigReload'));
        
        this.lastSyncTime = cloudConfig.timestamp;
        
        console.log('✅ Configuration mise à jour depuis le cloud');
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Erreur synchronisation cloud:', error);
      return false;
    }
  }

  // Méthode pour forcer une synchronisation
  async forcSync(): Promise<void> {
    console.log('🔄 Synchronisation forcée...');
    await this.syncFromCloud();
  }
}

// Instance globale
export const cloudSync = new CloudSyncManager();