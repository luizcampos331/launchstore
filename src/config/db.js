const { Pool } = require('pg');

module.exports = new Pool({
  user: 'luiz',
  password: '',
  host: 'localhost',
  database: 'launchstore'
});