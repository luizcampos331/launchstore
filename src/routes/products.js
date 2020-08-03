const express = require('express');
const multer = require('../app/middlewares/multer');

const routes = express.Router();

const ProductController = require('../app/controllers/ProductController');
const SearchController = require('../app/controllers/SearchController');

// === PRODUCTS ===
// Search
routes.get('/search', SearchController.index);
// GETs
routes.get('/create', ProductController.create);
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit);
// Others
routes.post('/', multer.array('photos', 6), ProductController.post); // Caso seja passado via formulário arquivos, usar multer
routes.put('/', multer.array('photos', 6), ProductController.put);
routes.delete('/', ProductController.delete);

module.exports = routes;