import React, { useState } from 'react';
import { Prize } from '../../types';
import { Trash2, Edit3, TestTube2 } from 'lucide-react';

interface GainsManagementProps {
  prizes: Prize[];
  onUpdatePrizes: (prizes: Prize[]) => void;
}

export function GainsManagement({ prizes, onUpdatePrizes }: GainsManagementProps) {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [testResults, setTestResults] = useState<string>('');

  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);

  const handleUpdatePrize = (updatedPrize: Prize) => {
    const updatedPrizes = prizes.map(p => 
      p.id === updatedPrize.id ? updatedPrize : p
    );
    onUpdatePrizes(updatedPrizes);
    setEditingPrize(null);
  };

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      label: 'Nouveau prix',
      description: 'Description du prix',
      icon: '🎁',
      color: '#3B82F6',
      probability: 0,
      isActive: true
    };
    onUpdatePrizes([...prizes, newPrize]);
    setEditingPrize(newPrize);
  };

  const handleDeletePrize = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prix ?')) {
      onUpdatePrizes(prizes.filter(p => p.id !== id));
    }
  };

  const runTest = () => {
    const iterations = 1000;
    const results: Record<string, number> = {};
    
    for (let i = 0; i < iterations; i++) {
      let random = Math.random() * totalProbability;
      
      for (const prize of prizes) {
        random -= prize.probability;
        if (random <= 0) {
          results[prize.label] = (results[prize.label] || 0) + 1;
          break;
        }
      }
    }

    const formattedResults = Object.entries(results)
      .map(([label, count]) => `${label}: ${count} (${((count / iterations) * 100).toFixed(1)}%)`)
      .join('\n');
    
    setTestResults(formattedResults);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gestion des Gains</h3>
        <div className="space-x-2">
          <button
            onClick={runTest}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors flex items-center space-x-2"
          >
            <TestTube2 size={16} />
            <span>Test (1000 tirages)</span>
          </button>
          <button
            onClick={handleAddPrize}
            className="btn-primary"
          >
            Ajouter un prix
          </button>
        </div>
      </div>

      <div className="bg-yellow-100 p-3 rounded">
        <p className="text-sm">
          Total des probabilités: {totalProbability}%
          {totalProbability !== 100 && (
            <span className="text-red-600 ml-2">⚠️ Doit être égal à 100%</span>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        {prizes.map((prize) => (
          <div key={prize.id} className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  style={{ '--prize-color': prize.color }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[var(--prize-color)]"
                >
                  {prize.icon}
                </div>
                <div>
                  <h4 className="font-semibold">{prize.label}</h4>
                  <p className="text-sm text-gray-600">{prize.description}</p>
                  <p className="text-sm font-medium">Probabilité: {prize.probability}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={prize.isActive}
                    onChange={(e) => handleUpdatePrize({ ...prize, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Actif</span>
                </label>
                
                <button
                  onClick={() => setEditingPrize(prize)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit3 size={16} />
                </button>
                
                <button
                  onClick={() => handleDeletePrize(prize.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testResults && (
        <div className="bg-gray-100 p-4 rounded">
          <h4 className="font-semibold mb-2">Résultats du test:</h4>
          <pre className="text-sm whitespace-pre-wrap">{testResults}</pre>
        </div>
      )}

      {editingPrize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Modifier le prix</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Libellé</label>
                <input
                  type="text"
                  value={editingPrize.label}
                  onChange={(e) => setEditingPrize({ ...editingPrize, label: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingPrize.description}
                  onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Icône/Emoji</label>
                <input
                  type="text"
                  value={editingPrize.icon}
                  onChange={(e) => setEditingPrize({ ...editingPrize, icon: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Couleur</label>
                <input
                  type="color"
                  value={editingPrize.color}
                  onChange={(e) => setEditingPrize({ ...editingPrize, color: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Probabilité (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingPrize.probability}
                  onChange={(e) => setEditingPrize({ ...editingPrize, probability: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPrize(null)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdatePrize(editingPrize)}
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