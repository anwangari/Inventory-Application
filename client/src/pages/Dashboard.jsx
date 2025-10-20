// ============================================
// FILE: client/src/pages/Dashboard.jsx
// ============================================
import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, suppliersAPI } from '../services/api';
import Card from '../components/common/Card';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, categories, suppliers] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        suppliersAPI.getAll(),
      ]);
      
      const lowStock = products.filter(p => p.quantity <= p.reorder_level);
      const totalValue = products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0);
      const recent = products.slice(0, 5);
      
      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        lowStock: lowStock.length,
        totalValue: totalValue.toFixed(2),
      });
      
      setLowStockProducts(lowStock.slice(0, 5));
      setRecentProducts(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <Card
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          className="card-blue"
        />
        <Card
          title="Categories"
          value={stats.totalCategories}
          icon="🏷️"
          className="card-green"
        />
        <Card
          title="Suppliers"
          value={stats.totalSuppliers}
          icon="🏢"
          className="card-purple"
        />
        <Card
          title="Low Stock Items"
          value={stats.lowStock}
          icon="⚠️"
          className="card-orange"
        />
        <Card
          title="Total Inventory Value"
          value={`$${stats.totalValue}`}
          icon="💰"
          className="card-teal"
        />
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <h3>Low Stock Alert</h3>
          {lowStockProducts.length > 0 ? (
            <div className="alert-list">
              {lowStockProducts.map(product => (
                <div key={product.id} className="alert-item">
                  <div className="alert-info">
                    <span className="alert-name">{product.name}</span>
                    <span className="alert-sku">SKU: {product.sku}</span>
                  </div>
                  <div className="alert-quantity">
                    <span className="quantity-badge low">{product.quantity}</span>
                    <span className="reorder-text">Reorder: {product.reorder_level}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">All products are adequately stocked!</p>
          )}
        </div>
        
        <div className="dashboard-section">
          <h3>Recent Products</h3>
          {recentProducts.length > 0 ? (
            <div className="recent-list">
              {recentProducts.map(product => (
                <div key={product.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-name">{product.name}</span>
                    <span className="recent-category">{product.category_name}</span>
                  </div>
                  <div className="recent-details">
                    <span className="recent-price">${parseFloat(product.unit_price).toFixed(2)}</span>
                    <span className="recent-quantity">Qty: {product.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;