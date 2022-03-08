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
  getEditIncidentById: async (req, res, next) => {
    const incident = await dataMapper.getIncidentById(req.params.id);
    const attractions = await dataMapper.getAllAttractions();
    debug('patchIncidentById called');
    if (incident) {
      res.render('edit_incident', { incident, attractions });
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
  patchIncidentById: async (req, res, next) => {
    if (req.body.end_date) {
      req.body.end_date = new Date().toLocaleString();
    } else {
      req.body.end_date = null;
    }
    debug(req.body);
    debug('patchIncident');
    const updateIncident = await dataMapper.editIncident(req.body);
    debug('UpdateIncident called');
    if (updateIncident) {
      debug(updateIncident.id);
      res.redirect(`/incident/${updateIncident.id}`);
    } else {
      next();
    }
  },
};
