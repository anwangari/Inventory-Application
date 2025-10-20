// ============================================
// FILE: client/src/components/modals/ViewCategoryModal.jsx
// ============================================
import Modal from '../common/Modal';
import '../../styles/ViewModal.css';

const ViewCategoryModal = ({ isOpen, onClose, category, products }) => {
  if (!category) return null;
  
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockProducts = products.filter(p => p.quantity <= p.reorder_level);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="large">
      <div className="view-modal-content">
        {/* Category Information */}
        <div className="view-section">
          <h4 className="view-section-title">Category Information</h4>
          <div className="view-info-grid">
            <div className="view-info-item">
              <span className="view-label">Name:</span>
              <span className="view-value">{category.name}</span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Description:</span>
              <span className="view-value">{category.description || 'No description provided'}</span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Created:</span>
              <span className="view-value">
                {new Date(category.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="view-info-item">
              <span className="view-label">Last Updated:</span>
              <span className="view-value">
                {new Date(category.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="view-section">
          <h4 className="view-section-title">Statistics</h4>
          <div className="view-stats-grid">
            <div className="view-stat-card">
              <span className="view-stat-label">Total Products</span>
              <span className="view-stat-value">{products.length}</span>
            </div>
            <div className="view-stat-card">
              <span className="view-stat-label">Total Quantity</span>
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
          <h4 className="view-section-title">Products in this Category ({products.length})</h4>
          {products.length > 0 ? (
            <div className="view-products-list">
              {products.map((product) => (
                <div key={product.id} className="view-product-item">
                  <div className="view-product-main">
                    <div className="view-product-info">
                      <span className="view-product-name">{product.name}</span>
                      <span className="view-product-sku">SKU: {product.sku}</span>
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
              <p>No products in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewCategoryModal;