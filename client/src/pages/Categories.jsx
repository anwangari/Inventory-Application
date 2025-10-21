// ============================================
// FILE: client/src/pages/Categories.jsx
// ============================================
import { useState, useEffect } from 'react';
import { categoriesAPI, productsAPI } from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import Card from '../components/common/Card';
import CategoryModal from '../components/modals/CategoryModal';
import DeleteModal from '../components/modals/DeleteModal';
import ViewCategoryModal from '../components/modals/ViewCategoryModal';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(query.toLowerCase()) ||
      category.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };
  
  const handleAdd = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  
  const handleView = (category) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };
  
  const handleDelete = (category) => {
    const productCount = products.filter(p => p.category_id === category.id).length;
    if (productCount > 0) {
      alert(`Cannot delete category. It has ${productCount} product(s) assigned. Please reassign or delete those products first.`);
      return;
    }
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  const handleSave = async (categoryData) => {
    try {
      if (modalMode === 'add') {
        await categoriesAPI.create(categoryData);
      } else {
        await categoriesAPI.update(selectedCategory.id, categoryData);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await categoriesAPI.delete(selectedCategory.id);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };
  
  const getCategoryStats = (categoryId) => {
    const categoryProducts = products.filter(p => p.category_id === categoryId);
    return {
      productCount: categoryProducts.length,
      totalValue: categoryProducts.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0),
      totalQuantity: categoryProducts.reduce((sum, p) => sum + p.quantity, 0)
    };
  };
  
  const columns = [
    { key: 'name', label: 'Category Name', width: '250px' },
    { 
      key: 'description', 
      label: 'Description', 
      width: 'auto',
      render: (value) => value || <span style={{ color: 'var(--text-tertiary)' }}>No description</span>
    },
    { 
      key: 'product_count', 
      label: 'Products', 
      width: '120px',
      render: (value, row) => {
        const stats = getCategoryStats(row.id);
        return (
          <span className={stats.productCount === 0 ? 'text-muted' : 'text-bold'}>
            {stats.productCount}
          </span>
        );
      }
    },
    { 
      key: 'total_value', 
      label: 'Total Value', 
      width: '150px',
      render: (value, row) => {
        const stats = getCategoryStats(row.id);
        return `$${stats.totalValue.toFixed(2)}`;
      }
    },
    { 
      key: 'created_at', 
      label: 'Created', 
      width: '180px',
      render: (value) => new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
  ];
  
  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }
  
  const totalProducts = products.length;
  const totalCategoryValue = products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0);
  const categoriesWithProducts = categories.filter(c => products.some(p => p.category_id === c.id)).length;
  const emptyCategories = categories.length - categoriesWithProducts;
  
  return (
    <div className="categories-page">
      <div className="page-header">
        <SearchBar onSearch={handleSearch} placeholder="Search categories..." />
        <Button onClick={handleAdd}>+ Add Category</Button>
      </div>
      
      <div className="stats-grid">
        <Card
          title="Total Categories"
          value={categories.length}
          icon="🏷️"
          className="card-blue"
        />
        <Card
          title="Categories in Use"
          value={categoriesWithProducts}
          icon="✅"
          className="card-green"
        />
        <Card
          title="Empty Categories"
          value={emptyCategories}
          icon="📋"
          className="card-purple"
        />
        <Card
          title="Total Products"
          value={totalProducts}
          icon="📦"
          className="card-orange"
        />
        <Card
          title="Total Inventory Value"
          value={`$${totalCategoryValue.toFixed(2)}`}
          icon="💰"
          className="card-teal"
        />
      </div>
      
      <Table
        columns={columns}
        data={filteredCategories}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        mode={modalMode}
      />
      
      <ViewCategoryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        category={selectedCategory}
        products={products.filter(p => p.category_id === selectedCategory?.id)}
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCategory?.name}
        itemType="category"
      />
    </div>
  );
};

export default Categories;