export function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Canvas fingerprinting
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint test 🎲', 2, 2);
  }
  const canvasHash = canvas.toDataURL();
  
  // Collect browser characteristics
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    canvas: canvasHash.slice(-50), // Last 50 chars for brevity
    memory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown',
    touchSupport: 'ontouchstart' in window ? '1' : '0'
  };
  
  // Create hash
  const fingerprintString = JSON.stringify(fingerprint);
  return btoa(fingerprintString).slice(0, 32);
}

export function hashWithSalt(input: string, salt: string = 'roue-cadeaux-2024'): string {
  return btoa(salt + input + salt).slice(0, 16);
}
