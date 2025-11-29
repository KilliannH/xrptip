import api from './client';

export const tipsAPI = {
  /**
   * Create a new tip
   * @param {Object} data - Tip data
   * @returns {Promise}
   */
  create: (data) => {
    return api.post('/tips', data);
  },

  /**
   * Get tips for a creator
   * @param {string} username
   * @param {Object} params - Query parameters (page, limit, status)
   * @returns {Promise}
   */
  getByCreator: (username, params = {}) => {
    return api.get(`/tips/creator/${username}`, { params });
  },

  /**
   * Get tip statistics for a creator
   * @param {string} username
   * @returns {Promise}
   */
  getStats: (username) => {
    return api.get(`/tips/stats/${username}`);
  },

  /**
   * Confirm a tip with transaction hash
   * @param {string} tipId
   * @param {Object} data - Transaction data (transactionHash, ledgerIndex)
   * @returns {Promise}
   */
  confirm: (tipId, data) => {
    return api.put(`/tips/${tipId}/confirm`, data);
  },
};