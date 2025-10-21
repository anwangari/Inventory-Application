// ============================================
// FILE: server/routes/supplierRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplierController');
const { validateSupplier } = require('../middleware/validator');

router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.post('/', validateSupplier, SupplierController.createSupplier);
router.put('/:id', validateSupplier, SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

module.exports = router;