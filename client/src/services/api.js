// ============================================
// FILE: client/src/services/api.js
// ============================================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products`);
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
  
  getLowStock: async () => {
    const response = await fetch(`${API_URL}/products/low-stock`);
    return handleResponse(response);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/suppliers`);
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/suppliers/${id}`);
    return handleResponse(response);
  },
  
  create: async (data) => {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};