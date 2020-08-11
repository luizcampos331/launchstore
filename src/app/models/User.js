const db = require('../../config/db');
const { hash } = require('bcryptjs');
const fs = require('fs')
const Product = require('./Product')

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
  },

  async update(id, fields) {
    try {
      let query = 'UPDATE users SET'

      Object.keys(fields).map((key, index, array) => {
        if((index + 1) < array.length) {
          query = `${query}
            ${key} = '${fields[key]}',
          `
        } else {
          //last iteration
          query = `${query}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `
        }
      })
  
      await db.query(query)
  
      return
    } catch(error) {
      console.log(error);
    }
  },

  async delete(id) {
    //pegar todos os produtos do usuários
    let results = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
    const products = results.rows

    //pegar todas as imagens do usuário
    const allFilesPromise = products.map(product => Product.files(product.id))
    
    let promiseResults = await Promise.all(allFilesPromise)
    
    //Remover o usuário
    await db.query('DELETE FROM users WHERE id = $1', [id])

    //remover as imagens da pasta public
    promiseResults.map(results => {
      results.rows.map(file => {
        try {
          fs.unlinkSync(file.path)
        } catch(error) {
          console.error(error)
        }
      })
    })
  }
}