const client = require('../config/db');

module.exports = {
  async findByTicket(ticket) {
    const result = await client.query('SELECT * FROM visitor WHERE ticket = $1', [ticket]);

    if (result.rowCount === 0) {
      return undefined;
    }

    return result.rows[0];
  },
};
