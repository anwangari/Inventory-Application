// ============================================
// FILE: server/models/supplierModel.js
// ============================================
const pool = require('../config/database');

class SupplierModel {
  static async findAll() {
    const query = 'SELECT * FROM suppliers ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM suppliers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(supplierData) {
    const { name, contact_person, email, phone, address } = supplierData;
    const query = `
      INSERT INTO suppliers (name, contact_person, email, phone, address)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const result = await pool.query(query, [name, contact_person, email, phone, address]);
    return result.rows[0];
  }

  static async update(id, supplierData) {
    const { name, contact_person, email, phone, address } = supplierData;
    const query = `
      UPDATE suppliers
      SET name = $1, contact_person = $2, email = $3, phone = $4, address = $5
      WHERE id = $6 RETURNING *
    `;
    const result = await pool.query(query, [name, contact_person, email, phone, address, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM suppliers WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = SupplierModel;