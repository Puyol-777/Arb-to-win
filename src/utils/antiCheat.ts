import { generateDeviceFingerprint, hashWithSalt } from './deviceFingerprint';

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
  
  canPlay(playLimit: 'once' | 'daily'): { allowed: boolean; reason?: string } {
  }
  canPlay(playLimit: 'once' | 'daily' | 'unlimited'): { allowed: boolean; reason?: string } {
    if (playLimit === 'unlimited') {
      return { allowed: true };
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
  
  private async logToServer(data: any): Promise<void> {
    // In a real implementation, this would send to your backend
    console.log('Logging play to server:', data);
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