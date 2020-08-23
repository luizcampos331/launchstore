const express = require('express');
const routes = express.Router();

//Controllers
const OrderController = require('../app/controllers/OrderController.js');

// Middlewares
const { onlyUsers } = require('../app/middlewares/session');

// Routes
routes.get('/', onlyUsers, OrderController.index)
routes.get('/sales', onlyUsers, OrderController.sales)
routes.get('/:id', onlyUsers, OrderController.show)
routes.post('/', onlyUsers, OrderController.post)
routes.post('/:id/:action', onlyUsers, OrderController.update)

module.exports = routes;