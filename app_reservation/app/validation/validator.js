const debug = require('debug')('Validator:log');
const { ApiError } = require('../helpers/errorHandler');

/**
 * Générateur de middleware pour la validation
 * d'un objet d'un des propriété de la requête
 * @param {string} prop - Nom de la propriété de l'objet request à valider
 * @param {Joi.object} schema - Le schema de validation du module Joi
 * @returns {Function} -
 * Renvoi un middleware pour express qui valide
 * le corp de la requête en utilisant le schema passé en paramètre.
 * Renvoi une erreur 400 si la validation échoue.
 */
module.exports = (prop, schema) => async (request, _, next) => {
  try {
    // la "value" on s'en fiche on la récupère pas
    // request['body'] == request.body
    debug(request[prop]);
    await schema.validateAsync(request[prop]);
    next();
  } catch (error) {
    // Je dois afficher l'erreur à l'utilisateur
    // STATUS HTTP pour une erreur de saise : 400
    // On réabille l'erreur en suivant notre propre normalisation
    next(new ApiError(error.details[0].message, { statusCode: 400 }));
  }
};
