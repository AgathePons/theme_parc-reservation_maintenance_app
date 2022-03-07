const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PGURL,
});

module.exports = pool;
