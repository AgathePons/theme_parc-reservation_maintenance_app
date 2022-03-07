const debug = require('debug')('dataMapper');
const dataBase = require('./dataBase');
const ApiError = require('./errors/apiError');

const dataMapper = {
  async getAllIncidents() {
    const query = 'SELECT * FROM incident;';
    const data = (await dataBase.query(query)).rows;
    debug(`> getAllIncidents(): ${query}`);
    if (!data) {
      throw new ApiError('No data found for getAllIncidents', 500);
    }
    return data;
  },
};

module.exports = dataMapper;
