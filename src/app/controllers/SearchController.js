const Product = require('../models/Product');
const LoadProductService = require('../service/LoadProductService');

module.exports = {
  async index(req, res) {
    try {
      let { filter, category } = req.query;

      if(!filter || filter.toLowerCase() == 'toda a loja') filter = null

      // === Select Products Search
      let products = await Product.search({filter, category});

      // === Format Products
      const productsPromise = products.map(LoadProductService.format)

      products = await Promise.all(productsPromise)

      // === Infos Search
      const search = {
        term: filter || 'Toda a loja',
        total: products.length
      }

      // === Treatment of Categories
      const categories = products.map(product => ({
        id: product.category_id,
        name: product.category_name
      })).reduce((categoriesFiltered, category) => { //Reduce = só coloca mais uma categoria se ela ainda não existe
        const found = categoriesFiltered.some(cat => cat.id == category.id); // Some = Procura no array se tem igual

        if(!found) categoriesFiltered.push(category);

        return categoriesFiltered
      }, []);

      // === End
      return res.render('search/index.njk', { products, search, categories });
      
    } catch(error) {
      console.log(error);
    }
  }
}