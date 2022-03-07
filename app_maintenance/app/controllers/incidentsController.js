const debug = require('debug')('incidentsController');
const dataMapper = require('../dataMapper');

module.exports = {
  getAllIncidents: async (_req, res, next) => {
    const incidents = await dataMapper.getAllIncidents();
    debug('getAllIncidents called');
    if (incidents) {
      res.render('home', { incidents });
    } else {
      next();
    }
  },
  getIncidentById: async (req, res, next) => {
    const incident = await dataMapper.getIncidentById(req.params.id);
    debug('getIncidentById called');
    if (incident) {
      res.render('incident', { incident });
    } else {
      next();
    }
  },
  getOpenIncident: async (_req, res, next) => {
    const attractions = await dataMapper.getAllAttractions();
    debug('getOpenIncident called');
    if (attractions) {
      res.render('open_incident', { attractions });
    } else {
      next();
    }
  },
  PostNewIncident: async (req, res, next) => {
    console.log(req.body);
    const newIncident = await dataMapper.newIncident(req.body);
    debug('PostNewIncident called');
    if (newIncident) {
      debug(newIncident.id);
      res.redirect(`/incident/${newIncident.id}`);
    } else {
      next();
    }
  },
};
