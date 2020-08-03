const Product = require('../models/Product');
const Category = require('../models/Category');
const File = require('../models/File');

const { formatPrice, date } = require('../../lib/utils');

module.exports = {
  // GET - Create
  create(req, res) {
    //Chamando a promessa do Category, depois de "all" finalizado, faça (then)
    //caso de erro no "all" faça (catch)
    Category.all()
    .then(function(results) {
      const categories = results.rows;

      return res.render('products/create.njk', { categories });
    }).catch(function(error) {
      throw new Error(error)
    });
  },

  // POST
  async post(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
      if(req.body[key] == '')
        return res.send('Please, fill all fields');
    }

    //Guardará o resultado em results
    //await será no mesmo estilo do "then", enquanto não terminar o sistema ficará
    //parado nessa linha, sempre que usar await, a function tem que ser "async"
    let results = await Product.create(req.body)
    const productId = results.rows[0].id;

    if(req.files.length != 0) {
      //Guarda na variável filesPromises um array de promessas, no caso a inserção da imagem no banco
      const filesPromise = req.files.map(file => File.create({...file, product_id: productId}));
      //Espera a criação do arquivo para seguir em frente
      await Promise.all(filesPromise);
    }

    return res.redirect(`/products/${productId}`);
  },

  // GET - Show
  async show(req, res) {
    let results = await Product.find(req.params.id);
    const product = results.rows[0];

    if(!product) return res.send('Product not found!');

    const { year, month, day, hour, minute } = date(product.updated_at)

    product.published = {
      day: `${day}/${month}/${year}`,
      hour: `${hour}:${minute}`
    }

    product.oldPrice = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    results = await Product.files(product.id);
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
    }));

    return res.render('products/show.njk', { product, files });
  },
 
  // GET - Edit
  async edit(req, res) {
    let results = await Product.find(req.params.id)
    const product = results.rows[0];

    if(!product) return res.send('Product not found!')

    product.price = formatPrice(product.price);
    product.old_price = formatPrice(product.old_price);
    
    // Get Categories
    results = await Category.all();
    const categories = results.rows;

    // Get Images
    results = await Product.files(product.id)
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
    }));

    return res.render('products/edit.njk', { product, categories, files });
  },

  async put(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
      if(req.body[key] == '' && key != "removed_files")
        return res.send('Please, fill all fields');
    }

    //Verifico se existem imagens para serem cadastradas
    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}));

      await Promise.all(newFilesPromise);
    }

    //Verifico se o input removed_files existe
    if(req.body.removed_files) {
      //Guardo os vlores contidos nele como um array
      const removedFiles = req.body.removed_files.split(',');
      //Guarda o index da ultima posição do array
      const lastIndex = removedFiles.length -1
      //Removo a ultima posição pois não tera nenhum valor guardado
      removedFiles.splice(lastIndex, 1);
      //Crio um array de promessas de exclusão das imagens
      const removedFilesPromise = removedFiles.map(id => File.delete(id));
      //Aguarda a criação do arquivo para seguir em em frente
      await Promise.all(removedFilesPromise);
    }

    req.body.price = req.body.price.replace(/\D/g, '');
    req.body.old_price = req.body.old_price.replace(/\D/g, '');

    const oldProduct = await Product.find(req.body.id);
    
    if(req.body.price != oldProduct.rows[0].price) {
      if(req.body.old_price != req.body.price)
        req.body.old_price = oldProduct.rows[0].price;
    }

    await Product.update(req.body);

    return res.redirect(`/products/${req.body.id}`);  
  },

  async delete(req, res) {
    await Product.delete(req.body.id);

    return res.redirect('products/create');
  }
}