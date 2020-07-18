const db = require('../../config/db');

module.exports = {
  all() {
    //Será retornado como uma promessa, ou seja, ele promete que será executado quando necessário
    return db.query(`
      SELECT * FROM categories
    `);
  }
}