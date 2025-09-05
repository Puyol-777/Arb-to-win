import React, { useState } from 'react';
import { GameSettings, AppTexts, ActionButton } from '../../types';

const AVAILABLE_FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Fredoka', label: 'Fredoka (Fun)' },
  { value: 'Kalam', label: 'Kalam (Handwritten)' },
  { value: 'Creepster', label: 'Creepster (Halloween)' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Bookman', label: 'Bookman' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Lucida Console', label: 'Lucida Console' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'Calibri', label: 'Calibri' },
  { value: 'Cambria', label: 'Cambria' },
  { value: 'Century Gothic', label: 'Century Gothic' },
  { value: 'Franklin Gothic Medium', label: 'Franklin Gothic Medium' },
  { value: 'Lucida Sans Unicode', label: 'Lucida Sans Unicode' },
  { value: 'MS Sans Serif', label: 'MS Sans Serif' },
  { value: 'Optima', label: 'Optima' },
  { value: 'Futura', label: 'Futura' },
  { value: 'Avenir', label: 'Avenir' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Ubuntu', label: 'Ubuntu' }
];

interface SettingsProps {
  gameSettings: GameSettings;
  texts: AppTexts;
  onUpdateSettings: (settings: GameSettings) => void;
  onUpdateTexts: (texts: AppTexts) => void;
}

export function Settings({ gameSettings, texts, onUpdateSettings, onUpdateTexts }: SettingsProps) {
  const [editingTexts, setEditingTexts] = useState(false);
  const [tempTexts, setTempTexts] = useState(texts);
  const [editingLegal, setEditingLegal] = useState(false);
  const [editingRules, setEditingRules] = useState(false);
  const [editingButtons, setEditingButtons] = useState(false);
  const [tempLegalContent, setTempLegalContent] = useState(texts.legalContent);
  const [tempRulesContent, setTempRulesContent] = useState(texts.rulesContent);
  const [tempButtons, setTempButtons] = useState(texts.actionButtons);

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    console.log('🔧 Settings - Modification:', key, '=', value);
    onUpdateSettings({
      ...gameSettings,
      [key]: value
    });
  };

  const handleSaveTexts = () => {
    try {
      console.log('💾 Saving texts...');
      onUpdateTexts(tempTexts);
      setEditingTexts(false);
      
      // Notification de succès avec style mobile-friendly
      const notification = document.createElement('div');
      notification.innerHTML = '✅ Textes synchronisés sur tous les appareils !';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-size: 16px;
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error saving texts:', error);
      alert('Erreur lors de la sauvegarde des textes. Veuillez réessayer.');
    }
  };

  const handleSaveLegal = () => {
    try {
      onUpdateTexts({ ...texts, legalContent: tempLegalContent });
      setEditingLegal(false);
      
      const notification = document.createElement('div');
      notification.innerHTML = '✅ Mentions légales synchronisées !';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
      
    } catch (error) {
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleSaveRules = () => {
    try {
      onUpdateTexts({ ...texts, rulesContent: tempRulesContent });
      setEditingRules(false);
      
      const notification = document.createElement('div');
      notification.innerHTML = '✅ Règles synchronisées sur tous les appareils !';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
      
    } catch (error) {
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleSaveButtons = () => {
    try {
      console.log('💾 Sauvegarde boutons - URLs:', tempButtons.map(btn => ({ id: btn.id, url: btn.url })));
      onUpdateTexts({ ...texts, actionButtons: tempButtons });
      setEditingButtons(false);
      
      const notification = document.createElement('div');
      notification.innerHTML = '✅ Boutons synchronisés sur tous les appareils !';
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
      
    } catch (error) {
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleAddButton = () => {
    const newButton: ActionButton = {
      id: Date.now().toString(),
      text: 'Nouveau bouton',
      color: '#FFFFFF',
      backgroundColor: '#3B82F6',
      url: 'https://example.com',
      isActive: true
    };
    setTempButtons([...tempButtons, newButton]);
  };

  const handleUpdateButton = (id: string, updates: Partial<ActionButton>) => {
    setTempButtons(tempButtons.map(btn => 
      btn.id === id ? { ...btn, ...updates } : btn
    ));
  };

  const handleDeleteButton = (id: string) => {
    setTempButtons(tempButtons.filter(btn => btn.id !== id));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Paramètres</h3>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border space-y-6">
        <h4 className="text-lg font-semibold">Limites de jeu</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Restriction de jeu</label>
            <select
              value={gameSettings.playLimit}
              onChange={(e) => handleSettingChange('playLimit', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="once">Une fois par appareil</option>
              <option value="daily">Une fois par 24h</option>
              <option value="unlimited">Pas de limite</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableHaptics"
              checked={gameSettings.enableHaptics}
              onChange={(e) => handleSettingChange('enableHaptics', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="enableHaptics" className="text-sm">
              Activer les vibrations (si supporté)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableSound"
              checked={gameSettings.enableSound}
              onChange={(e) => handleSettingChange('enableSound', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="enableSound" className="text-sm">
              Activer les sons
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border space-y-4">
        <h4 className="text-lg font-semibold">Configuration Google</h4>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            URL Google Reviews
          </label>
          <input
            type="url"
            value={gameSettings.googleReviewUrl}
            onChange={(e) => handleSettingChange('googleReviewUrl', e.target.value)}
            placeholder="https://g.page/r/your-business-id/review"
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Remplacez 'your-business-id' par l'ID de votre établissement Google
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Mentions légales</h4>
          <button
            onClick={() => setEditingLegal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Modifier
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded max-h-32 overflow-y-auto">
          <div 
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: texts.legalContent }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Règles du jeu</h4>
          <button
            onClick={() => setEditingRules(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Modifier
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded max-h-32 overflow-y-auto">
          <div 
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: texts.rulesContent }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Boutons d'actions généraux</h4>
          <button
            onClick={() => setEditingButtons(true)}
            className="btn-primary"
          >
            Gérer les boutons généraux
          </button>
        </div>
        
        <div className="space-y-3">
          {texts.actionButtons.map(button => (
            <div key={button.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <button
                  style={{ '--btn-bg': button.backgroundColor, '--btn-color': button.color }}
                  className="px-4 py-2 rounded font-medium bg-[var(--btn-bg)] text-[var(--btn-color)]"
                  disabled
                >
                  {button.text}
                </button>
                <span className="text-sm text-gray-600">{button.url}</span>
              </div>
              <span className={`text-sm ${button.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {button.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Page Félicitations - Boutons d'actions</h4>
          <button
            onClick={() => setEditingButtons(true)}
            className="btn-primary"
          >
            Gérer les boutons félicitations
          </button>
        </div>
        
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Information :</strong> Ces boutons apparaissent uniquement dans la modal de félicitations après avoir gagné un prix.
          </p>
        </div>
        
        <div className="space-y-3">
          {texts.actionButtons.map(button => (
            <div key={button.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <button
                  style={{ '--btn-bg': button.backgroundColor, '--btn-color': button.color }}
                  className="px-4 py-2 rounded font-medium bg-[var(--btn-bg)] text-[var(--btn-color)]"
                  disabled
                >
                  {button.text}
                </button>
                <span className="text-sm text-gray-600 max-w-xs truncate">{button.url}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${button.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {button.isActive ? 'Actif' : 'Inactif'}
                </span>
                <button
                  onClick={() => {
                    setTempButtons(texts.actionButtons);
                    setEditingButtons(true);
                  }}
                  className="text-purple-500 hover:text-purple-700 text-sm"
                >
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Textes de l'application</h4>
          <button
            onClick={() => setEditingTexts(true)}
            className="btn-primary"
          >
            Modifier les textes
          </button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className="font-medium">Titre de la page de jeu:</span>
            <p
              className="text-gray-600 font-[var(--title-font)] text-[length:var(--title-size)] text-[var(--title-color)]"
              style={{
                '--title-font': texts.titleFont,
                '--title-size': `${texts.titleSize}px`,
                '--title-color': texts.titleColor
              }}
            >
              {texts.title}
            </p>
          </div>
          <div>
            <span className="font-medium">Sous-titre:</span>
            <p
              className="text-gray-600 font-[var(--subtitle-font)] text-[length:var(--subtitle-size)] text-[var(--subtitle-color)]"
              style={{
                '--subtitle-font': texts.subtitleFont,
                '--subtitle-size': `${texts.subtitleSize}px`,
                '--subtitle-color': texts.subtitleColor
              }}
            >
              {texts.subtitle}
            </p>
          </div>
          <div>
            <span className="font-medium">Bouton tourner:</span>
            <p
              className="text-gray-600 font-[var(--spin-font)] text-[length:var(--spin-size)] text-[var(--spin-color)]"
              style={{
                '--spin-font': texts.spinButtonFont,
                '--spin-size': `${texts.spinButtonSize}px`,
                '--spin-color': texts.spinButtonColor
              }}
            >
              {texts.spinButton}
            </p>
          </div>
          <div>
            <span className="font-medium">Félicitations:</span>
            <p
              className="text-gray-600 font-[var(--congrats-font)] text-[length:var(--congrats-size)] text-[var(--congrats-color)]"
              style={{
                '--congrats-font': texts.congratulationsFont,
                '--congrats-size': `${texts.congratulationsSize}px`,
                '--congrats-color': texts.congratulationsColor
              }}
            >
              {texts.congratulations}
            </p>
          </div>
        </div>
      </div>

      {editingTexts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Modifier les textes</h4>
            
            <div className="space-y-4">
              {/* Titre */}
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-3">Titre de la page de jeu</h5>
                <div className="bg-blue-50 p-3 rounded mb-3">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Note :</strong> Ce titre apparaît uniquement sur la page de jeu. Le titre "Arb' Aventure" en haut à gauche reste fixe.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Texte</label>
                  <input
                    type="text"
                    value={tempTexts.title}
                    onChange={(e) => setTempTexts({ ...tempTexts, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Police</label>
                    <select
                      value={tempTexts.titleFont}
                      onChange={(e) => setTempTexts({ ...tempTexts, titleFont: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      {AVAILABLE_FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="72"
                      value={tempTexts.titleSize}
                      onChange={(e) => setTempTexts({ ...tempTexts, titleSize: parseInt(e.target.value) || 24 })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur</label>
                    <input
                      type="color"
                      value={tempTexts.titleColor}
                      onChange={(e) => setTempTexts({ ...tempTexts, titleColor: e.target.value })}
                      className="w-full border rounded px-3 py-2 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Sous-titre */}
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-3">Sous-titre</h5>
                <div>
                  <label className="block text-sm font-medium mb-1">Texte</label>
                  <input
                    type="text"
                    value={tempTexts.subtitle}
                    onChange={(e) => setTempTexts({ ...tempTexts, subtitle: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Police</label>
                    <select
                      value={tempTexts.subtitleFont}
                      onChange={(e) => setTempTexts({ ...tempTexts, subtitleFont: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      {AVAILABLE_FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="48"
                      value={tempTexts.subtitleSize}
                      onChange={(e) => setTempTexts({ ...tempTexts, subtitleSize: parseInt(e.target.value) || 16 })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur</label>
                    <input
                      type="color"
                      value={tempTexts.subtitleColor}
                      onChange={(e) => setTempTexts({ ...tempTexts, subtitleColor: e.target.value })}
                      className="w-full border rounded px-3 py-2 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton tourner */}
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-3">Bouton tourner</h5>
                <div>
                  <label className="block text-sm font-medium mb-1">Texte</label>
                  <input
                    type="text"
                    value={tempTexts.spinButton}
                    onChange={(e) => setTempTexts({ ...tempTexts, spinButton: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Police</label>
                    <select
                      value={tempTexts.spinButtonFont}
                      onChange={(e) => setTempTexts({ ...tempTexts, spinButtonFont: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      {AVAILABLE_FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="32"
                      value={tempTexts.spinButtonSize}
                      onChange={(e) => setTempTexts({ ...tempTexts, spinButtonSize: parseInt(e.target.value) || 18 })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur</label>
                    <input
                      type="color"
                      value={tempTexts.spinButtonColor}
                      onChange={(e) => setTempTexts({ ...tempTexts, spinButtonColor: e.target.value })}
                      className="w-full border rounded px-3 py-2 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Félicitations */}
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-3">Félicitations</h5>
                <div>
                  <label className="block text-sm font-medium mb-1">Texte</label>
                  <input
                    type="text"
                    value={tempTexts.congratulations}
                    onChange={(e) => setTempTexts({ ...tempTexts, congratulations: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Police</label>
                    <select
                      value={tempTexts.congratulationsFont}
                      onChange={(e) => setTempTexts({ ...tempTexts, congratulationsFont: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      {AVAILABLE_FONTS.map(font => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Taille (px)</label>
                    <input
                      type="number"
                      min="12"
                      max="48"
                      value={tempTexts.congratulationsSize}
                      onChange={(e) => setTempTexts({ ...tempTexts, congratulationsSize: parseInt(e.target.value) || 24 })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Couleur</label>
                    <input
                      type="color"
                      value={tempTexts.congratulationsColor}
                      onChange={(e) => setTempTexts({ ...tempTexts, congratulationsColor: e.target.value })}
                      className="w-full border rounded px-3 py-2 h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingTexts(false);
                  setTempTexts(texts);
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTexts}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingLegal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Modifier les mentions légales</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={texts.legalTitle}
                  onChange={(e) => onUpdateTexts({ ...texts, legalTitle: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contenu (HTML autorisé)</label>
                <textarea
                  value={tempLegalContent}
                  onChange={(e) => setTempLegalContent(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-64 font-mono text-sm"
                  placeholder="Utilisez du HTML pour formater le contenu..."
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h5 className="font-medium mb-2">Aperçu:</h5>
                <div 
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: tempLegalContent }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingLegal(false);
                  setTempLegalContent(texts.legalContent);
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveLegal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Modifier les règles du jeu</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={texts.rulesTitle}
                  onChange={(e) => onUpdateTexts({ ...texts, rulesTitle: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contenu (HTML autorisé)</label>
                <textarea
                  value={tempRulesContent}
                  onChange={(e) => setTempRulesContent(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-64 font-mono text-sm"
                  placeholder="Utilisez du HTML pour formater le contenu..."
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h5 className="font-medium mb-2">Aperçu:</h5>
                <div 
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: tempRulesContent }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingRules(false);
                  setTempRulesContent(texts.rulesContent);
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveRules}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingButtons && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Gérer les boutons d'actions - Page Félicitations</h4>
              <button
                onClick={handleAddButton}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ajouter un bouton
              </button>
            </div>
            
            <div className="bg-purple-50 p-3 rounded mb-4">
              <p className="text-sm text-purple-800">
                <strong>📱 Aperçu :</strong> Ces boutons apparaîtront dans la modal de félicitations après qu'un utilisateur ait gagné un prix.
              </p>
            </div>
            
            <div className="space-y-4">
              {tempButtons.map((button, index) => (
                <div key={button.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-800">
                      Bouton #{index + 1}
                      {button.id === 'google-review' && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Bouton Avis Google
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={button.isActive}
                          onChange={(e) => handleUpdateButton(button.id, { isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">
                          {button.isActive ? '✅ Actif' : '❌ Inactif'}
                        </span>
                      </label>
                      
                      <button
                        onClick={() => handleDeleteButton(button.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Texte du bouton</label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => handleUpdateButton(button.id, { text: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: ⭐⭐⭐⭐⭐ Laisser un avis"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">URL de redirection</label>
                      <input
                        type="url"
                        value={button.url}
                        onChange={(e) => handleUpdateButton(button.id, { url: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Couleur du texte</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={button.color}
                          onChange={(e) => handleUpdateButton(button.id, { color: e.target.value })}
                          className="w-16 h-10 border rounded"
                        />
                        <input
                          type="text"
                          value={button.color}
                          onChange={(e) => handleUpdateButton(button.id, { color: e.target.value })}
                          className="flex-1 border rounded px-3 py-2 font-mono text-sm"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Couleur de fond</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={button.backgroundColor}
                          onChange={(e) => handleUpdateButton(button.id, { backgroundColor: e.target.value })}
                          className="w-16 h-10 border rounded"
                        />
                        <input
                          type="text"
                          value={button.backgroundColor}
                          onChange={(e) => handleUpdateButton(button.id, { backgroundColor: e.target.value })}
                          className="flex-1 border rounded px-3 py-2 font-mono text-sm"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Aperçu du bouton :</span>
                      <button
                        style={{ '--btn-bg': button.backgroundColor, '--btn-color': button.color }}
                        className="px-4 py-2 rounded font-medium shadow-sm bg-[var(--btn-bg)] text-[var(--btn-color)]"
                        disabled
                      >
                        {button.text}
                      </button>
                    </div>
                    {button.id === 'google-review' && (
                      <p className="text-xs text-gray-600 mt-2">
                        ℹ️ Ce bouton aura un affichage spécial avec sous-texte dans la modal
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingButtons(false);
                  setTempButtons(texts.actionButtons);
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveButtons}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}