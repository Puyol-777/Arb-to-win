import React, { useState } from 'react';
import { Theme } from '../../types';

interface ThemeManagementProps {
  themes: Theme[];
  activeTheme: string;
  onUpdateThemes: (themes: Theme[]) => void;
  onSetActiveTheme: (themeId: string) => void;
}

export function ThemeManagement({ themes, activeTheme, onUpdateThemes, onSetActiveTheme }: ThemeManagementProps) {
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const handleUpdateTheme = (updatedTheme: Theme) => {
    const updatedThemes = themes.map(t => 
      t.id === updatedTheme.id ? updatedTheme : t
    );
    onUpdateThemes(updatedThemes);
    setEditingTheme(null);
  };

  const handleAddTheme = () => {
    const newTheme: Theme = {
      id: Date.now().toString(),
      name: 'Nouveau thème',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      backgroundColor: '#F8FAFC',
      textColor: '#1F2937'
    };
    onUpdateThemes([...themes, newTheme]);
    setEditingTheme(newTheme);
  };

  const handleDeleteTheme = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) {
      onUpdateThemes(themes.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gestion des Thèmes</h3>
        <button
          onClick={handleAddTheme}
          className="btn-primary"
        >
          Nouveau thème
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Thème actif</label>
        <select
          value={activeTheme}
          onChange={(e) => onSetActiveTheme(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs"
        >
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>{theme.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{theme.name}</h4>
                {theme.id === activeTheme && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Actif
                  </span>
                )}
              </div>
              
              <div className="space-x-2">
                <button
                  onClick={() => setEditingTheme(theme)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Modifier
                </button>
                {theme.id !== activeTheme && (
                  <button
                    onClick={() => handleDeleteTheme(theme.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div
                  style={{ '--color': theme.primaryColor }}
                  className="w-6 h-6 rounded border bg-[var(--color)]"
                />
                <span className="text-sm">Primaire: {theme.primaryColor}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div
                  style={{ '--color': theme.secondaryColor }}
                  className="w-6 h-6 rounded border bg-[var(--color)]"
                />
                <span className="text-sm">Secondaire: {theme.secondaryColor}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div
                  style={{ '--color': theme.accentColor }}
                  className="w-6 h-6 rounded border bg-[var(--color)]"
                />
                <span className="text-sm">Accent: {theme.accentColor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Modifier le thème</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={editingTheme.name}
                  onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Couleur primaire</label>
                <input
                  type="color"
                  value={editingTheme.primaryColor}
                  onChange={(e) => setEditingTheme({ ...editingTheme, primaryColor: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Couleur secondaire</label>
                <input
                  type="color"
                  value={editingTheme.secondaryColor}
                  onChange={(e) => setEditingTheme({ ...editingTheme, secondaryColor: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Couleur d'accent</label>
                <input
                  type="color"
                  value={editingTheme.accentColor}
                  onChange={(e) => setEditingTheme({ ...editingTheme, accentColor: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Arrière-plan</label>
                <input
                  type="color"
                  value={editingTheme.backgroundColor}
                  onChange={(e) => setEditingTheme({ ...editingTheme, backgroundColor: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Texte</label>
                <input
                  type="color"
                  value={editingTheme.textColor}
                  onChange={(e) => setEditingTheme({ ...editingTheme, textColor: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingTheme(null)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdateTheme(editingTheme)}
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