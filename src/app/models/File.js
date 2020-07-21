const db = require('../../config/db');
const fs = require('fs');

module.exports = {
  //usar {} no caso de os dados separem tratados antes da passagem para cá
  create({filename, path, product_id}) {
    const query = `
      INSERT INTO files (
        name,
        path,
        product_id
      ) VALUES ($1, $2, $3)
    `;

    const values = [
      filename,
      path,
      product_id,
    ];

    return db.query(query, values);
  },

  async delete(id) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = results.rows[0];
      //Remove o arquivo pelo caminho = path
      fs.unlinkSync(file.path);
      
      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch(error) {
      console.log(error);
    }

  }
}