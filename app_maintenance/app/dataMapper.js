const debug = require('debug')('dataMapper');
const dataBase = require('./dataBase');
const ApiError = require('./errors/apiError');

const dataMapper = {
  async getAllIncidents() {
    const query = 'SELECT * FROM incident_with_attraction;';
    const data = (await dataBase.query(query)).rows;
    debug(`> getAllIncidents(): ${query}`);
    if (!data) {
      throw new ApiError('No data found for getAllIncidents', 500);
    }
    return data;
  },

  async getIncidentById(id) {
    const query = {
      text: 'SELECT * FROM incident_with_attraction WHERE id = $1',
      values: [id],
    };
    const data = (await dataBase.query(query)).rows[0];
    debug(`> getIncidentsById(): ${query}`);
    if (!data) {
      throw new ApiError('No data found for getIncidentsById', 500);
    }
    return data;
  },

  async newIncident(form) {
    const query = {
      text: `INSERT INTO incident
      (nature, technician, attraction_id)
      VALUES ($1,$2,$3) RETURNING *`,

      values: [form.nature, form.technician, Number(form.attraction_id)],
    };
    debug(typeof query.values[2]);
    const data = (await dataBase.query(query)).rows[0];
    if (!data) {
      throw new ApiError('No data found for newIncident POST', 500);
    }
    return data;
  },
  async getAllAttractions() {
    const query = 'SELECT * FROM attraction;';
    const data = (await dataBase.query(query)).rows;
    debug(`> getAllAttractions(): ${query}`);
    if (!data) {
      throw new ApiError('No data found for getAllAttractions', 500);
    }
    return data;
  },
};

module.exports = dataMapper;
