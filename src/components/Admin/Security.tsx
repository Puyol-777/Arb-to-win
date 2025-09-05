import React, { useState } from 'react';
import { Shield, Key, User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SecurityProps {
  onLogout: () => void;
}

export function Security({ onLogout }: SecurityProps) {
  const { updateCredentials, getCurrentCredentials } = useAuth();
  const [currentCredentials, setCurrentCredentials] = useState(getCurrentCredentials());
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangeUsername = () => {
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel' });
      return;
    }

    if (formData.currentPassword !== currentCredentials.password) {
      setMessage({ type: 'error', text: 'Mot de passe actuel incorrect' });
      return;
    }

    if (!formData.newUsername.trim()) {
      setMessage({ type: 'error', text: 'Le nouveau nom d\'utilisateur ne peut pas être vide' });
      return;
    }

    if (formData.newUsername.length < 3) {
      setMessage({ type: 'error', text: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' });
      return;
    }

    const newCredentials = {
      username: formData.newUsername.trim(),
      password: currentCredentials.password
    };

    if (updateCredentials(newCredentials)) {
      setCurrentCredentials(newCredentials);
      setMessage({ type: 'success', text: 'Nom d\'utilisateur modifié avec succès' });
      setShowChangeUsername(false);
      setFormData({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      
      // Déconnexion automatique après 3 secondes
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Déconnexion automatique...' });
        setTimeout(onLogout, 1000);
      }, 2000);
    } else {
      setMessage({ type: 'error', text: 'Erreur lors de la modification' });
    }
  };

  const handleChangePassword = () => {
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel' });
      return;
    }

    if (formData.currentPassword !== currentCredentials.password) {
      setMessage({ type: 'error', text: 'Mot de passe actuel incorrect' });
      return;
    }

    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'Veuillez saisir un nouveau mot de passe' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (formData.newPassword === currentCredentials.password) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit être différent de l\'ancien' });
      return;
    }

    const newCredentials = {
      username: currentCredentials.username,
      password: formData.newPassword
    };

    if (updateCredentials(newCredentials)) {
      setCurrentCredentials(newCredentials);
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setShowChangePassword(false);
      setFormData({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      
      // Déconnexion automatique après 3 secondes
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Déconnexion automatique...' });
        setTimeout(onLogout, 1000);
      }, 2000);
    } else {
      setMessage({ type: 'error', text: 'Erreur lors de la modification' });
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les identifiants par défaut ?\n\nNom d\'utilisateur: admin\nMot de passe: roue2024!\n\nVous serez déconnecté automatiquement.')) {
      const defaultCredentials = {
        username: 'admin',
        password: 'roue2024!'
      };
      
      if (updateCredentials(defaultCredentials)) {
        setCurrentCredentials(defaultCredentials);
        setMessage({ type: 'success', text: 'Identifiants réinitialisés aux valeurs par défaut' });
        
        setTimeout(() => {
          setMessage({ type: 'success', text: 'Déconnexion automatique...' });
          setTimeout(onLogout, 1000);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' });
      }
    }
  };

  const clearAllData = () => {
    if (confirm('⚠️ ATTENTION ⚠️\n\nCette action va supprimer TOUTES les données de l\'application :\n- Configuration des prix\n- Thèmes personnalisés\n- Statistiques\n- Paramètres\n- Identifiants admin\n\nCette action est IRRÉVERSIBLE !\n\nÊtes-vous absolument sûr ?')) {
      if (confirm('Dernière confirmation !\n\nToutes les données seront perdues définitivement.\n\nTaper "SUPPRIMER" pour confirmer') && 
          prompt('Tapez "SUPPRIMER" en majuscules pour confirmer :') === 'SUPPRIMER') {
        
        // Supprimer toutes les données
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('roue_') || key.startsWith('admin_') || key.startsWith('config_'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        alert('✅ Toutes les données ont été supprimées.\n\nLa page va se recharger avec la configuration par défaut.');
        window.location.reload();
      }
    }
  };

  const getSessionInfo = () => {
    const token = localStorage.getItem('roue_auth_token');
    if (token) {
      try {
        const data = JSON.parse(atob(token));
        const loginTime = new Date(data.timestamp);
        const expiryTime = new Date(data.timestamp + (24 * 60 * 60 * 1000));
        return { loginTime, expiryTime, user: data.user };
      } catch {
        return null;
      }
    }
    return null;
  };

  const sessionInfo = getSessionInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold">Sécurité</h3>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Informations de session */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="text-gray-600" size={20} />
          <h4 className="text-lg font-semibold">Session actuelle</h4>
        </div>
        
        {sessionInfo && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Utilisateur connecté :</span>
              <span className="font-medium">{sessionInfo.user}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connexion :</span>
              <span>{sessionInfo.loginTime.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expiration :</span>
              <span>{sessionInfo.expiryTime.toLocaleString('fr-FR')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Gestion des identifiants */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center space-x-2 mb-4">
          <User className="text-gray-600" size={20} />
          <h4 className="text-lg font-semibold">Identifiants administrateur</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Nom d'utilisateur actuel :</span>
              <span className="ml-2 text-blue-600">{currentCredentials.username}</span>
            </div>
            <button
              onClick={() => setShowChangeUsername(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Modifier
            </button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">Mot de passe :</span>
              <span className="ml-2 text-gray-500">••••••••</span>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Actions de sécurité */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center space-x-2 mb-4">
          <Key className="text-gray-600" size={20} />
          <h4 className="text-lg font-semibold">Actions de sécurité</h4>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleResetToDefaults}
            className="w-full bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition-colors"
          >
            🔄 Réinitialiser aux identifiants par défaut
          </button>
          
          <button
            onClick={onLogout}
            className="w-full bg-gray-500 text-white py-3 rounded hover:bg-gray-600 transition-colors"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </div>

      {/* Zone dangereuse */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="text-red-600" size={20} />
          <h4 className="text-lg font-semibold text-red-800">Zone dangereuse</h4>
        </div>
        
        <p className="text-sm text-red-700 mb-4">
          Cette action supprimera définitivement toutes les données de l'application.
        </p>
        
        <button
          onClick={clearAllData}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
        >
          🗑️ Supprimer toutes les données
        </button>
      </div>

      {/* Modals */}
      {showChangeUsername && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Modifier le nom d'utilisateur</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Saisissez votre mot de passe actuel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau nom d'utilisateur</label>
                <input
                  type="text"
                  value={formData.newUsername}
                  onChange={(e) => setFormData({ ...formData, newUsername: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Minimum 3 caractères"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowChangeUsername(false);
                  setFormData({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleChangeUsername}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Modifier le mot de passe</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Saisissez votre mot de passe actuel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Minimum 6 caractères"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Répétez le nouveau mot de passe"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setFormData({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}