/**
 * On implémente notre propre type d'erreur.
 * Cela s'appelle une exception
 * On en profite pour lui permettre de prendre
 * une information supplémentaire : un code de status HTTP
 * Les instance transporteront cette info avec elles
 * et elle pourra être exploité ultérieurment
 * @typedef {object} ApiError
 * @property {string} status - Status
 * @property {number} statusCode - HTTP Status code
 * @property {string} message - Error message
 */
module.exports = class ApiError extends Error {
  constructor(message, infos) {
    super(message);
    this.infos = infos;
  }
};
