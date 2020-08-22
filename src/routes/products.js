const express = require('express');
const multer = require('../app/middlewares/multer');

const routes = express.Router();

// Controllers
const ProductController = require('../app/controllers/ProductController');
const SearchController = require('../app/controllers/SearchController');

// Validators
const ProductValidator = require('../app/validators/Product')

// Middlewares
const { onlyUsers } = require('../app/middlewares/session')

// === PRODUCTS ===
// Search
routes.get('/search', SearchController.index);
// GETs
routes.get('/create', onlyUsers, ProductController.create);
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit);
// Others
routes.post('/', onlyUsers, multer.array('photos', 6), ProductValidator.post, ProductController.post); // Caso seja passado via formulário arquivos, usar multer
routes.put('/', onlyUsers, multer.array('photos', 6), ProductValidator.put, ProductController.put);
routes.delete('/', onlyUsers, ProductController.delete);

module.exports = routes;