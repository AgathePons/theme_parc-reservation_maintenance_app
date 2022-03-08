const client = require('../config/db');

module.exports = {
  async findAllOpenAttractions() {
    const result = await client.query('SELECT * FROM opened_attraction WHERE "open"=true;');

    if (result.rowCount === 0) {
      return undefined;
    }
    return result.rows;
  },
};
