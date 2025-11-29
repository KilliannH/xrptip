import api from './client';

export const authAPI = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} data - { email, password }
   * @returns {Promise}
   */
  register: (data) => {
    return api.post('/auth/register', data);
  },

  /**
   * Connexion
   * @param {Object} credentials - { email, password }
   * @returns {Promise}
   */
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  /**
   * Déconnexion
   * @returns {Promise}
   */
  logout: () => {
    return api.post('/auth/logout');
  },

  /**
   * Obtenir l'utilisateur connecté
   * @returns {Promise}
   */
  getMe: () => {
    return api.get('/auth/me');
  },

  /**
   * Mettre à jour le mot de passe
   * @param {Object} data - { currentPassword, newPassword }
   * @returns {Promise}
   */
  updatePassword: (data) => {
    return api.put('/auth/update-password', data);
  },

  /**
   * Demander la réinitialisation du mot de passe
   * @param {string} email
   * @returns {Promise}
   */
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Réinitialiser le mot de passe
   * @param {string} resetToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  resetPassword: (resetToken, newPassword) => {
    return api.put(`/auth/reset-password/${resetToken}`, { newPassword });
  },

  /**
   * Lier un profil créateur à l'utilisateur
   * @param {string} creatorId
   * @returns {Promise}
   */
  linkCreator: (creatorId) => {
    return api.put(`/auth/link-creator/${creatorId}`);
  },
};