
// ============================================
// FILE: server/routes/productRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validator');

router.get('/', ProductController.getAllProducts);
router.get('/low-stock', ProductController.getLowStockProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', validateProduct, ProductController.createProduct);
router.put('/:id', validateProduct, ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;