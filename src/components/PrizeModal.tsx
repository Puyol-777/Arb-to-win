import React from 'react';
import { Prize, AppTexts, GameSettings } from '../types';
import { Gift, Star, Share2 } from 'lucide-react';

interface PrizeModalProps {
  prize: Prize;
  texts: AppTexts;
  gameSettings: GameSettings;
  onClose: () => void;
  onReviewClick: () => void;
}

export function PrizeModal({ prize, texts, gameSettings, onClose, onReviewClick }: PrizeModalProps) {
  console.log('🎯 PrizeModal - URLs actuelles:', {
    googleReviewUrl: gameSettings.googleReviewUrl,
    actionButtons: texts.actionButtons.map(btn => ({ id: btn.id, url: btn.url }))
  });

  // Force re-render when config changes
  const [configVersion, setConfigVersion] = useState(0);
  
  useEffect(() => {
    const handleConfigUpdate = () => {
      console.log('🎯 PrizeModal: Config update detected');
      setConfigVersion(prev => prev + 1);
    };

    window.addEventListener('configUpdated', handleConfigUpdate);
    window.addEventListener('configChanged', handleConfigUpdate);
    window.addEventListener('forceConfigReload', handleConfigUpdate);
    
    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate);
      window.removeEventListener('configChanged', handleConfigUpdate);
      window.removeEventListener('forceConfigReload', handleConfigUpdate);
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${texts.congratulations} J'ai gagné: ${prize.label}`,
          text: `Je viens de gagner "${prize.label}" chez Arb' Aventure !`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `Je viens de gagner "${prize.label}" chez Arb' Aventure ! ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Lien copié dans le presse-papier !');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <div
            style={{ '--prize-color': prize.color }}
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 bg-[var(--prize-color)]"
          >
            {prize.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
          </h2>
          
          <h2
            style={{
              '--congrats-font': texts.congratulationsFont,
              '--congrats-size': `${texts.congratulationsSize}px`,
              '--congrats-color': texts.congratulationsColor
            }}
            className="font-bold mb-2 font-[var(--congrats-font)] text-[length:var(--congrats-size)] text-[var(--congrats-color)]"
          >
            {texts.congratulations}
          </h2>
          
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {prize.label.replace(prize.icon, '').trim()}
          </h3>
          
          <p className="text-gray-600">
            {prize.description}
          </p>
        </div>
        
        <div className="space-y-3">
          {/* Boutons d'actions personnalisés */}
          {texts.actionButtons.filter(btn => btn.isActive).map(button => (
            <button
              key={button.id}
              onClick={() => {
                if (button.id === 'google-review') {
                  console.log('🎯 Clic Google Review - URL utilisée:', gameSettings.googleReviewUrl);
                  onReviewClick();
                } else {
                  console.log('🎯 Clic bouton action - URL utilisée:', button.url);
                  window.open(button.url, '_blank');
                }
              }}
              style={{
                '--btn-bg': button.backgroundColor,
                '--btn-color': button.color
              }}
              className={`w-full rounded-xl font-semibold transition-colors hover:opacity-90 bg-[var(--btn-bg)] text-[var(--btn-color)] ${
                button.id === 'google-review'
                  ? 'py-4 flex flex-col items-center justify-center space-y-2'
                  : 'py-3'
              }`}
            >
              {button.id === 'google-review' ? (
                <div className="text-center">
                  <div className="font-bold text-base">{button.text}</div>
                  <div className="text-xs mt-1">Vous avez testé la roue ? Super ! Et si vous nous laissiez un avis pour dire ce que vous avez pensé de votre journée ?</div>
                </div>
              ) : (
                button.text
              )}
            </button>
          ))}
          
          {/* Bouton partage masqué
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 size={20} />
            <span>{texts.shareResult}</span>
          </button>
          */}
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}