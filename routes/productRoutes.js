const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products with query parameters
router.get('/', productController.getAllProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// GET products by category
router.get('/category/:category', async (req, res) => {
    // You can move this logic to controller too
    req.query.category = req.params.category;
    return productController.getAllProducts(req, res);
});

module.exports = router;