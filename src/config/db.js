const { Pool } = require('pg');

module.exports = new Pool({
  user: 'luiz',
  password: '',
  host: 'localhost',
  database: 'launchstore'
});

//Caso de erro ao executar o postgreSQL: pg_ctl -D /usr/local/var/postgres start