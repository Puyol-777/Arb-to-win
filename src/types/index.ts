export interface Prize {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  probability: number;
  isActive: boolean;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
}

export interface GameSettings {
  playLimit: 'once' | 'daily' | 'unlimited';
  resetAllowed: boolean;
  googleReviewUrl: string;
  enableHaptics: boolean;
  enableSound: boolean;
}

export interface GameStats {
  totalSpins: number;
  dailySpins: number;
  reviewClicks: number;
  prizeDistribution: Record<string, number>;
  lastReset: string;
  dailyHistory: DailyStats[];
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  spins: number;
  reviewClicks: number;
  conversionRate: number;
}

export interface SpinResult {
  prizeId: string;
  angle: number;
  timestamp: number;
  deviceId: string;
}

export interface AppTexts {
  title: string;
  titleFont: string;
  titleSize: number;
  titleColor: string;
  subtitle: string;
  subtitleFont: string;
  subtitleSize: number;
  subtitleColor: string;
  spinButton: string;
  spinButtonFont: string;
  spinButtonSize: number;
  spinButtonColor: string;
  congratulations: string;
  congratulationsFont: string;
  congratulationsSize: number;
  congratulationsColor: string;
  alreadyPlayed: string;
  rulesTitle: string;
  rulesContent: string;
  legalTitle: string;
  legalContent: string;
  claimPrize: string;
  leaveReview: string;
  shareResult: string;
}

export interface ActionButton {
  id: string;
  text: string;
  color: string;
  backgroundColor: string;
  url: string;
  isActive: boolean;
}

export interface AppTexts {
  title: string;
  titleFont: string;
  titleSize: number;
  titleColor: string;
  subtitle: string;
  subtitleFont: string;
  subtitleSize: number;
  subtitleColor: string;
  spinButton: string;
  spinButtonFont: string;
  spinButtonSize: number;
  spinButtonColor: string;
  congratulations: string;
  congratulationsFont: string;
  congratulationsSize: number;
  congratulationsColor: string;
  alreadyPlayed: string;
  rulesTitle: string;
  rulesContent: string;
  legalTitle: string;
  legalContent: string;
  claimPrize: string;
  leaveReview: string;
  shareResult: string;
  actionButtons: ActionButton[];
}

export interface AppConfig {
  prizes: Prize[];
  themes: Theme[];
  activeTheme: string;
  gameSettings: GameSettings;
  texts: AppTexts;
  stats: GameStats;
}