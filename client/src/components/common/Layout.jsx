// ============================================
// FILE: client/src/components/common/Layout.jsx
// ============================================
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Inventory</h1>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/products" 
            className={`nav-item ${isActive('/products') ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </Link>
          
          <Link 
            to="/categories" 
            className={`nav-item ${isActive('/categories') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏷️</span>
            <span>Categories</span>
          </Link>
          
          <Link 
            to="/suppliers" 
            className={`nav-item ${isActive('/suppliers') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏢</span>
            <span>Suppliers</span>
          </Link>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h2>{getPageTitle(location.pathname)}</h2>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <span>Admin User</span>
            </div>
          </div>
        </header>
        
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

const getPageTitle = (path) => {
  const titles = {
    '/dashboard': 'Dashboard',
    '/products': 'Products',
    '/categories': 'Categories',
    '/suppliers': 'Suppliers',
  };
  return titles[path] || 'Inventory Management';
};

export default Layout;