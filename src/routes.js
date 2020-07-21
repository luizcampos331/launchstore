const express = require('express');
const multer = require('./app/middlewares/multer');

const ProductController = require('./app/controllers/ProductController');

const routes = express.Router();

routes.get('/', function(req, res) {
  return res.render('layout.njk');
});

// === PRODUCTS ===
// GETs
routes.get('/products/create', ProductController.create);
routes.get('/products/:id', ProductController.show)
routes.get('/products/:id/edit', ProductController.edit);
// Others
routes.post('/products', multer.array('photos', 6), ProductController.post); // Caso seja passado via formulário arquivos, usar multer
routes.put('/products', multer.array('photos', 6), ProductController.put);
routes.delete('/products', ProductController.delete);

// Alias
routes.get('/ads/create', function(req, res) {
  return res.redirect('/products/create')
})

module.exports = routes;