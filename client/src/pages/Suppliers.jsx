// ============================================
// FILE: client/src/pages/Suppliers.jsx
// ============================================
import { useState, useEffect } from 'react';
import { suppliersAPI, productsAPI } from '../services/api';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import Card from '../components/common/Card';
import SupplierModal from '../components/modals/SupplierModal';
import DeleteModal from '../components/modals/DeleteModal';
import ViewSupplierModal from '../components/modals/ViewSupplierModal';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [suppliersData, productsData] = await Promise.all([
        suppliersAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setSuppliers(suppliersData);
      setFilteredSuppliers(suppliersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(query.toLowerCase()) ||
      supplier.contact_person?.toLowerCase().includes(query.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(query.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };
  
  const handleAdd = () => {
    setModalMode('add');
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (supplier) => {
    setModalMode('edit');
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };
  
  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };
  
  const handleDelete = (supplier) => {
    const productCount = products.filter(p => p.supplier_id === supplier.id).length;
    if (productCount > 0) {
      alert(`Cannot delete supplier. They supply ${productCount} product(s). Please reassign or delete those products first.`);
      return;
    }
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };
  
  const handleSave = async (supplierData) => {
    try {
      if (modalMode === 'add') {
        await suppliersAPI.create(supplierData);
      } else {
        await suppliersAPI.update(selectedSupplier.id, supplierData);
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
      throw error;
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      await suppliersAPI.delete(selectedSupplier.id);
      await fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Failed to delete supplier');
    }
  };
  
  const getSupplierStats = (supplierId) => {
    const supplierProducts = products.filter(p => p.supplier_id === supplierId);
    return {
      productCount: supplierProducts.length,
      totalValue: supplierProducts.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0),
      totalQuantity: supplierProducts.reduce((sum, p) => sum + p.quantity, 0)
    };
  };
  
  const columns = [
    { key: 'name', label: 'Supplier Name', width: '200px' },
    { 
      key: 'contact_person', 
      label: 'Contact Person', 
      width: '180px',
      render: (value) => value || <span style={{ color: 'var(--text-tertiary)' }}>-</span>
    },
    { 
      key: 'email', 
      label: 'Email', 
      width: '220px',
      render: (value) => value || <span style={{ color: 'var(--text-tertiary)' }}>-</span>
    },
    { 
      key: 'phone', 
      label: 'Phone', 
      width: '140px',
      render: (value) => value || <span style={{ color: 'var(--text-tertiary)' }}>-</span>
    },
    { 
      key: 'id', 
      label: 'Products', 
      width: '100px',
      render: (value) => {
        const stats = getSupplierStats(value);
        return (
          <span className={stats.productCount === 0 ? 'text-muted' : 'text-bold'}>
            {stats.productCount}
          </span>
        );
      }
    },
    { 
      key: 'id', 
      label: 'Total Value', 
      width: '140px',
      render: (value) => {
        const stats = getSupplierStats(value);
        return `$${stats.totalValue.toFixed(2)}`;
      }
    },
  ];
  
  if (loading) {
    return <div className="loading">Loading suppliers...</div>;
  }
  
  const totalProducts = products.length;
  const totalSupplierValue = products.reduce((sum, p) => sum + (p.quantity * parseFloat(p.unit_price)), 0);
  const suppliersWithProducts = suppliers.filter(s => products.some(p => p.supplier_id === s.id)).length;
  const inactiveSuppliers = suppliers.length - suppliersWithProducts;
  
  return (
    <div className="suppliers-page">
      <div className="page-header">
        <SearchBar onSearch={handleSearch} placeholder="Search suppliers..." />
        <Button onClick={handleAdd}>+ Add Supplier</Button>
      </div>
      
      <div className="stats-grid">
        <Card
          title="Total Suppliers"
          value={suppliers.length}
          icon="🏢"
          className="card-blue"
        />
        <Card
          title="Active Suppliers"
          value={suppliersWithProducts}
          icon="✅"
          className="card-green"
        />
        <Card
          title="Inactive Suppliers"
          value={inactiveSuppliers}
          icon="💤"
          className="card-purple"
        />
        <Card
          title="Total Products"
          value={totalProducts}
          icon="📦"
          className="card-orange"
        />
        <Card
          title="Total Supply Value"
          value={`${totalSupplierValue.toFixed(2)}`}
          icon="💰"
          className="card-teal"
        />
      </div>
      
      <Table
        columns={columns}
        data={filteredSuppliers}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        supplier={selectedSupplier}
        mode={modalMode}
      />
      
      <ViewSupplierModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        supplier={selectedSupplier}
        products={products.filter(p => p.supplier_id === selectedSupplier?.id)}
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={selectedSupplier?.name}
        itemType="supplier"
      />
    </div>
  );
};

export default Suppliers;