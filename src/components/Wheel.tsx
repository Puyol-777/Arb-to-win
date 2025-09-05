import React, { useState, useEffect } from 'react';
import { WheelCanvas } from './WheelCanvas';
import { useWheel } from '../hooks/useWheel';
import { Prize, AppTexts, GameSettings } from '../types';
import { AntiCheatSystem } from '../utils/antiCheat';

interface WheelProps {
  prizes: Prize[];
  texts: AppTexts;
  gameSettings: GameSettings;
  onResult: (prizeId: string) => void;
  onStatsUpdate: (type: 'spin' | 'review') => void;
}

const antiCheat = new AntiCheatSystem();

export function Wheel({ prizes, texts, gameSettings, onResult, onStatsUpdate }: WheelProps) {
  const { isSpinning, rotation, spin } = useWheel(prizes);
  const [message, setMessage] = useState<string>('');
  const [canPlay, setCanPlay] = useState(true);
  const [configVersion, setConfigVersion] = useState(0);

  // Surveiller les changements de configuration
  useEffect(() => {
    const checkConfigUpdates = () => {
      console.log('🎯 Wheel: Checking config updates');
      setConfigVersion(prev => prev + 1);
      
      // Vérifier si on peut encore jouer après une mise à jour
      const playCheck = antiCheat.canPlay(gameSettings.playLimit);
      if (!playCheck.allowed && playCheck.reason) {
        setMessage(playCheck.reason);
        setCanPlay(false);
      } else if (playCheck.allowed && !canPlay && !message.includes('erreur')) {
        setMessage('');
        setCanPlay(true);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'config_update_trigger' || e.key === 'last_config_update' || e.key === 'force_reload_trigger') {
        console.log('🎯 Wheel: Storage change detected');
        checkConfigUpdates();
      }
    };

    const handleConfigChanged = () => {
      console.log('🎯 Wheel: Config changed event');
      checkConfigUpdates();
    };

    window.addEventListener('configUpdated', checkConfigUpdates);
    window.addEventListener('forceConfigReload', checkConfigUpdates);
    window.addEventListener('configChanged', handleConfigChanged);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkConfigUpdates);
    window.addEventListener('visibilitychange', checkConfigUpdates);
    
    return () => {
      window.removeEventListener('configUpdated', checkConfigUpdates);
      window.removeEventListener('forceConfigReload', checkConfigUpdates);
      window.removeEventListener('configChanged', handleConfigChanged);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkConfigUpdates);
      window.removeEventListener('visibilitychange', checkConfigUpdates);
    };
  }, [gameSettings.playLimit, canPlay, message]);

  const handleSpin = async () => {
    const playCheck = antiCheat.canPlay(gameSettings.playLimit);
    
    if (!playCheck.allowed) {
      setMessage(playCheck.reason || texts.alreadyPlayed);
      setCanPlay(false);
      return;
    }

    try {
      const result = await spin();
      antiCheat.recordPlay();
      onResult(result.prizeId);
      onStatsUpdate('spin');
      setCanPlay(false);
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleReviewClick = () => {
    console.log('🎯 Wheel - handleReviewClick - URL utilisée:', gameSettings.googleReviewUrl);
    onStatsUpdate('review');
    window.open(gameSettings.googleReviewUrl, '_blank');
  };

  const handleActionButtonClick = (url: string) => {
    console.log('🎯 Wheel - handleActionButtonClick - URL utilisée:', url);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 
          className="font-bold forest-title"
          style={{
            fontFamily: texts.titleFont,
            fontSize: `${texts.titleSize}px`,
            color: texts.titleColor
          }}
        >
          {texts.title}
        </h1>
        <p 
          style={{
            fontFamily: texts.subtitleFont,
            fontSize: `${texts.subtitleSize}px`,
            color: texts.subtitleColor
          }}
        >
          {texts.subtitle}
        </p>
      </div>

      <div className="relative">
        <WheelCanvas 
          prizes={prizes}
          rotation={rotation}
          size={300}
        />
      </div>

      {message && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md max-w-md text-center">
          <p>{message}</p>
        </div>
      )}

      <div className="space-y-4 text-center">
        <button
          onClick={handleSpin}
          disabled={isSpinning || !canPlay}
          style={{
            fontFamily: texts.spinButtonFont,
            fontSize: `${texts.spinButtonSize}px`,
            color: texts.spinButtonColor
          }}
          className={`
            px-8 py-4 rounded-full font-bold transition-all duration-200
            ${isSpinning || !canPlay
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 active:scale-95'
            }
          `}
        >
          {isSpinning ? '🎯 En cours...' : texts.spinButton}
        </button>

        {/* Boutons d'actions personnalisés */}
        {texts.actionButtons.filter(btn => btn.isActive && btn.id !== 'google-review').length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {texts.actionButtons.filter(btn => btn.isActive && btn.id !== 'google-review').map(button => (
              <button
                key={button.id}
                onClick={() => handleActionButtonClick(button.url)}
                style={{
                  backgroundColor: button.backgroundColor,
                  color: button.color
                }}
                className="px-4 py-2 rounded-full font-medium transition-colors hover:opacity-90"
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}