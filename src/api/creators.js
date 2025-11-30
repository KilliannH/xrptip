import api from './client';

export const creatorsAPI = {
  /**
   * Get my creator profile
   * @returns {Promise}
   */
  getMyProfile: () => {
    return api.get('/creators/me/profile');
  },

  /**
   * Get all creators
   * @param {Object} params - Query parameters (page, limit)
   * @returns {Promise}
   */
  getAll: (params = {}) => {
    return api.get('/creators', { params });
  },

  /**
   * Get creator by username
   * @param {string} username
   * @returns {Promise}
   */
  getByUsername: (username) => {
    return api.get(`/creators/${username}`);
  },

  /**
   * Check if username is available
   * @param {string} username
   * @returns {Promise}
   */
  checkUsername: (username) => {
    return api.get(`/creators/check-username/${username}`);
  },

  /**
   * Create a new creator profile
   * @param {Object} data - Creator data
   * @returns {Promise}
   */
  create: (data) => {
    return api.post('/creators', data);
  },

  /**
   * Update creator profile
   * @param {string} username
   * @param {Object} data - Updated creator data
   * @returns {Promise}
   */
  update: (username, data) => {
    return api.put(`/creators/${username}`, data);
  },

  /**
   * Delete creator profile
   * @param {string} username
   * @returns {Promise}
   */
  delete: (username) => {
    return api.delete(`/creators/${username}`);
  },
};