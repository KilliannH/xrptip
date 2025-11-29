import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  // Vérifier si l'utilisateur est connecté
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.register({ email, password });
      
      // Sauvegarder le token
      localStorage.setItem('token', response.token);
      
      // Mettre à jour l'utilisateur
      setUser(response.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
      return { success: false, error: err.message };
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      // Sauvegarder le token
      localStorage.setItem('token', response.token);
      
      // Mettre à jour l'utilisateur
      setUser(response.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
      return { success: false, error: err.message };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Toujours nettoyer le state local
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await authAPI.updatePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du mot de passe');
      return { success: false, error: err.message };
    }
  };

  // Demander la réinitialisation du mot de passe
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors de la demande de réinitialisation');
      return { success: false, error: err.message };
    }
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (resetToken, newPassword) => {
    try {
      setError(null);
      const response = await authAPI.resetPassword(resetToken, newPassword);
      
      // Auto-login après reset
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation');
      return { success: false, error: err.message };
    }
  };

  // Lier un profil créateur
  const linkCreator = async (creatorId) => {
    try {
      setError(null);
      const response = await authAPI.linkCreator(creatorId);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Erreur lors du lien du profil');
      return { success: false, error: err.message };
    }
  };

  // Rafraîchir les données de l'utilisateur
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isCreator: user?.role === 'creator',
    register,
    login,
    logout,
    updatePassword,
    forgotPassword,
    resetPassword,
    linkCreator,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};