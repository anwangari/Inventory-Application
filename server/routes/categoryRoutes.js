// ============================================
// FILE: server/routes/categoryRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validator');

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', validateCategory, CategoryController.createCategory);
router.put('/:id', validateCategory, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;