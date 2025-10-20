// ============================================
// FILE: server/controllers/supplierController.js
// ============================================
const SupplierModel = require('../models/supplierModel');

class SupplierController {
  static async getAllSuppliers(req, res) {
    try {
      const suppliers = await SupplierModel.findAll();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSupplierById(req, res) {
    try {
      const supplier = await SupplierModel.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createSupplier(req, res) {
    try {
      const supplier = await SupplierModel.create(req.body);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateSupplier(req, res) {
    try {
      const supplier = await SupplierModel.update(req.params.id, req.body);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSupplier(req, res) {
    try {
      const supplier = await SupplierModel.delete(req.params.id);
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SupplierController;