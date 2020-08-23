const express = require('express');

const users = require('./users');
const products = require('./products');
const cart = require('./cart');
const Orders = require('./Orders');

const HomeController = require('../app/controllers/HomeController');

const routes = express.Router();

routes.get('/', HomeController.index);

routes.use('/users', users);
routes.use('/products', products);
routes.use('/cart', cart);
routes.use('/orders', Orders);

// Alias
routes.get('/ads/create', function(req, res) {
  return res.redirect('/products/create');
});

routes.get('/accounts', function(req, res) {
  return res.redirect('/users/login');
})

module.exports = routes;