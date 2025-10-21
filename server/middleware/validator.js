// ============================================
// FILE: server/middleware/validator.js
// ============================================
const validateProduct = (req, res, next) => {
    const { name, sku, category_id, supplier_id, quantity, unit_price } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Product name is required');
    }
    
    if (!sku || sku.trim().length === 0) {
      errors.push('SKU is required');
    }
    
    if (!category_id) {
      errors.push('Category is required');
    }
    
    if (!supplier_id) {
      errors.push('Supplier is required');
    }
    
    if (quantity === undefined || quantity === null) {
      errors.push('Quantity is required');
    } else if (isNaN(quantity) || quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }
    
    if (!unit_price) {
      errors.push('Unit price is required');
    } else if (isNaN(unit_price) || unit_price <= 0) {
      errors.push('Unit price must be greater than 0');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    next();
  };
  
  const validateCategory = (req, res, next) => {
    const { name } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Category name is required');
    }
    
    if (name && name.length > 100) {
      errors.push('Category name must be less than 100 characters');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    next();
  };
  
  const validateSupplier = (req, res, next) => {
    const { name, email } = req.body;
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Supplier name is required');
    }
    
    if (name && name.length > 200) {
      errors.push('Supplier name must be less than 200 characters');
    }
    
    if (email && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    next();
  };
  
  module.exports = {
    validateProduct,
    validateCategory,
    validateSupplier
  };