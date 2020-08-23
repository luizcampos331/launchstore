const { unlinkSync } = require('fs')

const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');
const LoadProductService = require('../service/LoadProductService');

module.exports = {
  async create(req, res) {
    try {
      const categories = await Category.findAll()
  
      return res.render('products/create', { categories });
      
    } catch (error) {
      console.error(error);
    }
  },

  async post(req, res) {
    try {      
      // === Disrupt req.body
      let { category_id, name, description, 
        old_price, price, quantity, status } = req.body

      // === Format Price
      price = price.replace(/\D/g,'')

      // === Create Product
      const product_id = await Product.create({
        category_id, 
        user_id: req.session.userId,
        name, 
        description, 
        old_price: old_price || price, 
        price, 
        quantity, 
        status: status || 1
      })
  
      // === Create Files
      if(req.files.length != 0) {
        //Guarda na variável filesPromises um array de promessas, no caso a inserção da imagem no banco
        const filesPromise = req.files.map(file => 
          File.create({ name: file.filename, path: file.path, product_id }));
        //Espera a criação do arquivo para seguir em frente
        await Promise.all(filesPromise);
      }
  
      // === End
      return res.redirect(`/products/${product_id}`);
      
    } catch (error) {
      console.error(error)
    }
  },

  async show(req, res) {
    try {
      const product = await LoadProductService.load('product', {
        where: {
          id: req.params.id
        }
      })
  
      return res.render('products/show', { product });
      
    } catch (error) {
      console.error(error)
    }
  },
 
  async edit(req, res) {
    try {
      const product = await LoadProductService.load('product', {
        where: {
          id: req.params.id
        }
      })

      if(!product) return res.send('Product not found')
      
      // === Select Categories
      const categories = await Category.findAll();
  
      // === End
      return res.render('products/edit', { product, categories });
      
    } catch (error) {
      console.error(error)
    }
  },

  async put(req, res) {
    try {  
      //Verifico se existem imagens para serem cadastradas
      if(req.files.length != 0) { 
        const newFilesPromise = req.files.map(file => 
          File.create({name: file.filename, path: file.path, product_id: req.body.id}));
  
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

        // === Select Files
        const filesPromise = removedFiles.map(id => File.find(id));
        const files = await Promise.all(filesPromise)

        // === Delete Files
        //Crio um array de promessas de exclusão das imagens
        const removedFilesPromise = removedFiles.map(id => File.delete(id));
        //Aguarda a criação do arquivo para seguir em frente
        await Promise.all(removedFilesPromise);

        // === Unlink Files
        files.map(file => {
          try {
            unlinkSync(file.path)
          } catch (error) {
            console.error(error)
          }
        })
      }
  
      req.body.price = req.body.price.replace(/\D/g, '');
      req.body.old_price = req.body.old_price.replace(/\D/g, '');
  
      if(req.body.old_price != req.body.price) {
        const oldProduct = await Product.find(req.body.id);
        req.body.old_price = oldProduct.price;
      }
  
      await Product.update(req.body.id, {
        category_id: req.body.category_id,
        name: req.body.name,
        description: req.body.description,
        old_price: req.body.old_price,
        price: req.body.price,
        quantity: req.body.quantity,
        status: req.body.status
      });
  
      return res.redirect(`/products/${req.body.id}`);  
      
    } catch (error) {
      console.error(error)
    }
  },

  async delete(req, res) {
    try {
      const files = await Product.files(req.body.id)

      await Product.delete(req.body.id);

      files.map(file => {
        try {
          unlinkSync(file.path)
        } catch (error) {
          console.error(error)
        }
      })

      return res.render('products/create.njk', {
        success: 'Produto deletado com sucesso!'
      });
    } catch(error) {
      console.error(error);
    }
  }
}