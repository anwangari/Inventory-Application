// ============================================
// FILE: client/src/components/modals/ViewSupplierModal.jsx
// ============================================
import Modal from '../common/Modal';
import '../../styles/ViewModal.css';

const ViewSupplierModal = ({ isOpen, onClose, supplier, products }) => {
  if (!supplier) return null;
  
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.reorder_level);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supplier Details" size="large">
      <div className="view-modal-content">
        {/* Supplier Information */}
        <div className="view-section">
          <h4 className="view-section-title">Supplier Information</h4>
          <div className="view-info-grid">
            <div className="view-info-item">
              <span className="view-label">Company Name:</span>
              <span className="view-value">{supplier.name}</span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Contact Person:</span>
              <span className="view-value">{supplier.contact_person || 'Not provided'}</span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Email:</span>
              <span className="view-value">
                {supplier.email ? (
                  <a href={`mailto:${supplier.email}`} className="view-link">{supplier.email}</a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Phone:</span>
              <span className="view-value">
                {supplier.phone ? (
                  <a href={`tel:${supplier.phone}`} className="view-link">{supplier.phone}</a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>
            <div className="view-info-item full-width">
              <span className="view-label">Address:</span>
              <span className="view-value">{supplier.address || 'Not provided'}</span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Added:</span>
              <span className="view-value">
                {new Date(supplier.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Last Updated:</span>
              <span className="view-value">
                {new Date(supplier.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="view-section">
          <h4 className="view-section-title">Supply Statistics</h4>
          <div className="view-stats-grid">
            <div className="view-stat-card">
              <span className="view-stat-label">Products Supplied</span>
              <span className="view-stat-value">{products.length}</span>
            </div>
            <div className="view-stat-card">
              <span className="view-stat-label">Total Units</span>
              <span className="view-stat-value">{totalQuantity}</span>
            </div>
            <div className="view-stat-card">
              <span className="view-stat-label">Total Value</span>
              <span className="view-stat-value">${totalValue.toFixed(2)}</span>
            </div>
            <div className="view-stat-card warning">
              <span className="view-stat-label">Low Stock Items</span>
              <span className="view-stat-value">{lowStockProducts.length}</span>
            </div>
          </div>
        </div>
        
        {/* Products List */}
        <div className="view-section">
          <h4 className="view-section-title">Supplied Products ({products.length})</h4>
          {products.length > 0 ? (
            <div className="view-products-list">
              {products.map((product) => (
                <div key={product.id} className="view-product-item">
                  <div className="view-product-main">
                    <div className="view-product-info">
                      <span className="view-product-name">{product.name}</span>
                      <div className="view-product-meta">
                        <span className="view-product-sku">SKU: {product.sku}</span>
                        <span className="view-product-category">
                          {product.category_name}
                        </span>
                      </div>
                    </div>
                    <div className="view-product-details">
                      <span className="view-product-quantity">
                        Qty: <strong>{product.quantity}</strong>
                        {product.quantity <= product.reorder_level && (
                          <span className="low-stock-badge">Low Stock</span>
                        )}
                      </span>
                      <span className="view-product-price">${parseFloat(product.unit_price).toFixed(2)}</span>
                      <span className="view-product-total">
                        Total: ${(product.quantity * parseFloat(product.unit_price)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="view-empty">
              <p>No products from this supplier yet.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewSupplierModal;