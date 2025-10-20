// ============================================
// FILE: client/src/components/modals/ProductModal.jsx
// ============================================
import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import '../../styles/Modal.css';

const ProductModal = ({ isOpen, onClose, onSave, product, mode, categories, suppliers }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category_id: '',
    supplier_id: '',
    quantity: 0,
    unit_price: 0,
    reorder_level: 10,
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        category_id: product.category_id || '',
        supplier_id: product.supplier_id || '',
        quantity: product.quantity || 0,
        unit_price: product.unit_price || 0,
        reorder_level: product.reorder_level || 10,
        status: product.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        category_id: '',
        supplier_id: '',
        quantity: 0,
        unit_price: 0,
        reorder_level: 10,
        status: 'active',
      });
    }
    setErrors({});
  }, [product, mode, isOpen]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.unit_price <= 0) newErrors.unit_price = 'Price must be greater than 0';
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Product' : 'Edit Product'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={errors.sku ? 'error' : ''}
            />
            {errors.sku && <span className="error-message">{errors.sku}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={errors.category_id ? 'error' : ''}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="error-message">{errors.category_id}</span>}
          </div>
          
          <div className="form-group">
            <label>Supplier *</label>
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              className={errors.supplier_id ? 'error' : ''}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
            {errors.supplier_id && <span className="error-message">{errors.supplier_id}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className={errors.quantity ? 'error' : ''}
            />
            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
          </div>
          
          <div className="form-group">
            <label>Unit Price *</label>
            <input
              type="number"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.unit_price ? 'error' : ''}
            />
            {errors.unit_price && <span className="error-message">{errors.unit_price}</span>}
          </div>
          
          <div className="form-group">
            <label>Reorder Level</label>
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add Product' : 'Update Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;