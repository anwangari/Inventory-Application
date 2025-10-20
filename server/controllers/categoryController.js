// ============================================
// FILE: server/controllers/categoryController.js
// ============================================
const CategoryModel = require('../models/categoryModel');

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const category = await CategoryModel.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const category = await CategoryModel.delete(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;