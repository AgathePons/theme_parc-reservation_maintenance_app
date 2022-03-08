const Joi = require('joi');

const incident = Joi.object({
    incident_number: Joi.string().min(1).required(),
    event_id: Joi.number().integer().positive().required(),
    nature: Joi.string().min(1).required(),
    technician: Joi.string().min(1).required(),
    comment: Joi.string().allow('').optional()
});

module.exports = incident;