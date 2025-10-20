// ============================================
// FILE: server/controllers/productController.js
// ============================================
const ProductModel = require('../models/productModel');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await ProductModel.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const product = await ProductModel.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const product = await ProductModel.update(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const product = await ProductModel.delete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLowStockProducts(req, res) {
    try {
      const products = await ProductModel.findLowStock();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;