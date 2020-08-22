const LoadProductService = require('../service/LoadProductService')

module.exports = {
  async index(req, res) {
    try {
      const allProducts = await LoadProductService.load('products')
      
      const products = allProducts
      .filter((product, index) => index > 2 ? false : true) // Filter para pegar somente 3 produtos

      return res.render('home/index.njk', { products });
      
    } catch(error) {
      console.log(error);
    }
  }
}