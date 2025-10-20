// ============================================
// FILE: client/src/pages/Products.jsx
// ============================================
import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, suppliersAPI } from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import ProductModal from '../components/modals/ProductModal';
import DeleteModal from '../components/modals/DeleteModal';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        suppliersAPI.getAll(),
      ]);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase()) ||
      product.category_name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  
  const handleAdd = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  const handleSave = async (productData) => {
    try {
      if (modalMode === 'add') {
        await productsAPI.create(productData);
      } else {
        await productsAPI.update(selectedProduct.id, productData);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await productsAPI.delete(selectedProduct.id);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };
  
  const columns = [
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'name', label: 'Name', width: 'auto' },
    { key: 'category_name', label: 'Category', width: '150px' },
    { key: 'supplier_name', label: 'Supplier', width: '150px' },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      width: '100px',
      render: (value, row) => (
        <span className={value <= row.reorder_level ? 'low-stock' : ''}>
          {value}
        </span>
      )
    },
    { 
      key: 'unit_price', 
      label: 'Price', 
      width: '100px',
      render: (value) => `$${parseFloat(value).toFixed(2)}`
    },
    { 
      key: 'status', 
      label: 'Status', 
      width: '100px',
      render: (value) => (
        <span className={`status-badge status-${value}`}>
          {value}
        </span>
      )
    },
  ];
  
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }
  
  return (
    <div className="products-page">
      <div className="page-header">
        <SearchBar onSearch={handleSearch} placeholder="Search products..." />
        <Button onClick={handleAdd}>+ Add Product</Button>
      </div>
      
      <div className="products-stats">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-label">Low Stock</span>
          <span className="stat-value">
            {products.filter(p => p.quantity <= p.reorder_level).length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">
            ${products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0).toFixed(2)}
          </span>
        </div>
      </div>
      
      <Table
        columns={columns}
        data={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
        mode={modalMode}
        categories={categories}
        suppliers={suppliers}
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedProduct?.name}
        itemType="product"
      />
    </div>
  );
};

export default Products;