const express = require('express');

const ProductController = require('./app/controllers/ProductController');

const routes = express.Router();

routes.get('/', function(req, res) {
  return res.render('layout.njk');
});

// === PRODUCTS ===
// GETs
routes.get('/products/create', ProductController.create);
routes.get('/products/:id/edit', ProductController.edit);
// Others
routes.post('/products', ProductController.post);
routes.put('/products', ProductController.put);
routes.delete('/products', ProductController.delete);

// Alias
routes.get('/ads/create', function(req, res) {
  return res.redirect('/products/create')
})

module.exports = routes;