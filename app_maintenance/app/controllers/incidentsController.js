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
};
