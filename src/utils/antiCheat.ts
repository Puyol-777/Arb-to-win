import { generateDeviceFingerprint, hashWithSalt } from './deviceFingerprint';
import logger from './logger';

const STORAGE_KEYS = {
  LAST_PLAY: 'roue_last_play',
  DEVICE_ID: 'roue_device_id',
  PLAY_COUNT: 'roue_play_count'
};

export class AntiCheatSystem {
  private deviceId: string;
  
  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
  }
  
  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    
    if (!deviceId) {
      const fingerprint = generateDeviceFingerprint();
      deviceId = hashWithSalt(fingerprint);
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
      
      // Also set a cookie as backup
      document.cookie = `roue_device=${deviceId}; max-age=31536000; path=/; SameSite=Strict`;
    }
    
    return deviceId;
  }
// ---- Types & Store abstractions ----
export type PlayLimit = 'once' | 'daily' | 'unlimited';

export interface CanPlayResult {
  allowed: boolean;
  reason?: string;
}

export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export class InMemoryStore implements KeyValueStore {
  private map = new Map<string, string>();
  get(key: string) { return this.map.get(key) ?? null; }
  set(key: string, value: string) { this.map.set(key, value); }
  remove(key: string) { this.map.delete(key); }
}

/** Optionnel : wrapper localStorage (navigateur) */
export class LocalStorageStore implements KeyValueStore {
  constructor(private prefix = 'playLimiter') {}
  private k(key: string) { return `${this.prefix}:${key}`; }
  get(key: string) { try { return window.localStorage.getItem(this.k(key)); } catch { return null; } }
  set(key: string, value: string) { try { window.localStorage.setItem(this.k(key), value); } catch {} }
  remove(key: string) { try { window.localStorage.removeItem(this.k(key)); } catch {} }
}

// ---- Utilitaire principal ----
export class PlayLimiter {
  private playedOnceKey: string;
  private lastPlayedDateKey: string;

  constructor(
    /**
     * baseKey identifie l'entité (ex: userId, équipe, appareil, scénario de jeu, etc.)
     * Combinez-le si besoin (ex: `${userId}:${scenarioId}`)
     */
    private baseKey: string,
    private store: KeyValueStore = new InMemoryStore()
  ) {
    this.playedOnceKey = `${this.baseKey}:playedOnce`;
    this.lastPlayedDateKey = `${this.baseKey}:lastPlayedDate`;
  }

  // --- Surcharges ---
  canPlay(playLimit: 'once' | 'daily'): CanPlayResult;
  canPlay(playLimit: 'once' | 'daily' | 'unlimited'): CanPlayResult {
    if (playLimit === 'unlimited') {
      return { allowed: true };
    }

    if (playLimit === 'once') {
      const played = this.store.get(this.playedOnceKey) === 'true';
      if (played) {
        return { allowed: false, reason: 'Limite "once" atteinte : déjà joué.' };
      }
      return { allowed: true };
    }

    // 'daily'
    const lastPlayedDate = this.store.get(this.lastPlayedDateKey);
    const today = this.todayLocalISO(); // ex: "2025-09-07"
    if (lastPlayedDate === today) {
      return { allowed: false, reason: 'Limite "daily" atteinte : déjà joué aujourd’hui.' };
    }
    return { allowed: true };
  }

  /**
   * À appeler lorsque la partie démarre, pour poser l’état.
   * Idempotent côté "once" (pose le flag), "daily" (pose la date du jour).
   */
  recordPlay(): void {
    this.store.set(this.playedOnceKey, 'true');
    this.store.set(this.lastPlayedDateKey, this.todayLocalISO());
  }

  /**
   * Pratique : vérifie et enregistre en un seul appel.
   */
  checkAndRecord(playLimit: PlayLimit): CanPlayResult {
    const res = this.canPlay(playLimit);
    if (res.allowed) {
      this.recordPlay();
    }
    return res;
  }

  /** Outils */
  reset(): void {
    this.store.remove(this.playedOnceKey);
    this.store.remove(this.lastPlayedDateKey);
  }

  /**
   * Retourne la date locale au format YYYY-MM-DD (jour civil, reset à minuit local)
   */
  private todayLocalISO(): string {
    // Utilise le fuseau local de l'environnement JS
    const now = new Date();
    // Format ISO court sans heure : "YYYY-MM-DD"
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

// ---- Exemples d’utilisation ----

// Exemple 1 : par utilisateur + scénario, avec InMemoryStore
const memoryStore = new InMemoryStore();
const limiterUser42ScenarioA = new PlayLimiter('user:42:scenario:A', memoryStore);

const check1 = limiterUser42ScenarioA.canPlay('once');
// -> { allowed: true }
if (check1.allowed) {
  limiterUser42ScenarioA.recordPlay();
}
// Un 2e essai "once" renverra false
const check2 = limiterUser42ScenarioA.canPlay('once');
// -> { allowed: false, reason: 'Limite "once" atteinte : déjà joué.' }

// Exemple 2 : "daily" avec enregistrement atomique
const limiterDaily = new PlayLimiter('team:blue:quiz:daily', memoryStore);
const attempt = limiterDaily.checkAndRecord('daily');
// -> Si première fois du jour: { allowed: true } et l’état est posé automatiquement
// -> Sinon : { allowed: false, reason: 'Limite "daily"...' }

// Exemple 3 (navigateur) : persistance locale
// const limiterBrowser = new PlayLimiter('user:42:scenario:A', new LocalStorageStore('myApp'));

    }
    
    const lastPlay = localStorage.getItem(STORAGE_KEYS.LAST_PLAY);
    const playCount = parseInt(localStorage.getItem(STORAGE_KEYS.PLAY_COUNT) || '0');
    
    if (playLimit === 'once' && playCount > 0) {
      return {
        allowed: false,
        reason: 'Vous avez déjà tenté votre chance ! 🎉 Merci de votre participation.'
      };
    }
    
    if (playLimit === 'daily' && lastPlay) {
      const lastPlayDate = new Date(lastPlay);
      const now = new Date();
      const hoursSinceLastPlay = (now.getTime() - lastPlayDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastPlay < 24) {
        const hoursLeft = Math.ceil(24 - hoursSinceLastPlay);
        return {
          allowed: false,
          reason: `Vous avez déjà joué aujourd'hui ! Revenez dans ${hoursLeft}h.`
        };
      }
    }
    
    return { allowed: true };
  }
  
  recordPlay(): void {
    const now = new Date().toISOString();
    const playCount = parseInt(localStorage.getItem(STORAGE_KEYS.PLAY_COUNT) || '0') + 1;
    
    localStorage.setItem(STORAGE_KEYS.LAST_PLAY, now);
    localStorage.setItem(STORAGE_KEYS.PLAY_COUNT, playCount.toString());
    
    // Log to server (simulated)
    this.logToServer({
      deviceId: this.deviceId,
      timestamp: now,
      playCount
    });
  }
  
    private async logToServer(data: Record<string, unknown>): Promise<void> {
    // In a real implementation, this would send to your backend
    logger.log('Logging play to server:', data);
  }
  
  resetDevice(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear cookies
    document.cookie = 'roue_device=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  }
  
  getDeviceId(): string {
    return this.deviceId;
  }
}
