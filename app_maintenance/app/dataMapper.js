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

  async editIncident(form) {
    debug(form);
    const query = {
      text: `UPDATE incident
      SET nature = $1, technician = $2, attraction_id = $3, end_date = $4
      WHERE incident.id=$5
      RETURNING *`,
      values: [form.nature, form.technician, Number(form.attraction_id), form.end_date, Number(form.id)],
    };
    const data = (await dataBase.query(query)).rows[0];
    if (!data) {
      throw new ApiError('No data found for editIncident POST', 500);
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
