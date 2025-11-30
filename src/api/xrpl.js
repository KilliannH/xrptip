import api from './client';

export const xrplAPI = {
  /**
   * Vérifier une transaction XRPL
   * @param {string} tipId - ID du tip
   * @param {string} txHash - Hash de la transaction
   * @returns {Promise}
   */
  verifyTransaction: (tipId, txHash) => {
    return api.post('/xrpl/verify-transaction', {
      tipId,
      txHash
    });
  },

  /**
   * Synchroniser les transactions d'un créateur
   * @param {string} username - Username du créateur
   * @param {number} limit - Nombre de transactions à récupérer
   * @returns {Promise}
   */
  syncTransactions: (username, limit = 50) => {
    return api.post(`/xrpl/sync/${username}`, {}, {
      params: { limit }
    });
  },

  /**
   * Obtenir le solde XRP d'un créateur
   * @param {string} username - Username du créateur
   * @returns {Promise}
   */
  getBalance: (username) => {
    return api.get(`/xrpl/balance/${username}`);
  },

  /**
   * Valider une adresse XRP
   * @param {string} address - Adresse XRP à valider
   * @returns {Promise}
   */
  validateAddress: (address) => {
    return api.post('/xrpl/validate-address', { address });
  },
};