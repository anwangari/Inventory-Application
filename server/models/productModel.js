// ============================================
// FILE: server/models/productModel.js
// ============================================
const pool = require('../config/database');

class ProductModel {
  static async findAll() {
    const query = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level } = productData;
    const query = `
      INSERT INTO products (name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, productData) {
    const { name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level, status } = productData;
    const query = `
      UPDATE products
      SET name = $1, sku = $2, description = $3, category_id = $4, 
          supplier_id = $5, quantity = $6, unit_price = $7, reorder_level = $8, status = $9
      WHERE id = $10
      RETURNING *
    `;
    const values = [name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level, status || 'active', id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findLowStock() {
    const query = `
      SELECT p.*, c.name as category_name, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.quantity <= p.reorder_level
      ORDER BY p.quantity ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = ProductModel;