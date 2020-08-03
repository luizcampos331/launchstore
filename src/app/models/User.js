const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
  async findOne(filters) {
    let query = 'SELECT * FROM users';

    Object.keys(filters).map(key => {
      // WHERE | OR
      query = `${query} ${key}` // SELECT * FROM users WHERE ... OR ...

      Object.keys(filters[key]).map(field => {
        // email | cpf_cnpj
        query = `${query} ${field} = '${filters[key][field]}'` // SELECT * FROM users WHERE email = '...' OR cpf_cnpj = '...'
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },

  async create(data) {
    try {
      const query = `
        INSERT INTO users (
          name,
          email,
          password,
          cpf_cnpj,
          cep,
          address
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

      //hash of password
      const passwordHash = await hash(data.password, 8);
      
      const values = [
        data.name,
        data.email,
        passwordHash,
        data.cpf_cnpj.replace(/\D/g, ''),
        data.cep.replace(/\D/g, ''),
        data.address
      ]

      const results = await db.query(query, values);
      return results.rows[0].id;
    } catch(error) {
      console.log(error);
    }
  }
}