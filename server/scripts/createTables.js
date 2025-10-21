// ============================================
// FILE: server/scripts/createTables.js
// ============================================
const pool = require('../config/database');

const createTablesSQL = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- Drop existing function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10, 2) NOT NULL,
    reorder_level INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_suppliers_name ON suppliers(name);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
`;

async function createTables() {
  console.log('🔧 Creating database tables...\n');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('📋 Executing SQL statements...');
    await client.query(createTablesSQL);
    
    await client.query('COMMIT');
    
    console.log('\n✅ Database tables created successfully!');
    console.log('\n📊 Created tables:');
    console.log('   - categories');
    console.log('   - suppliers');
    console.log('   - products');
    
    console.log('\n🔗 Foreign key relationships established');
    console.log('\n📇 Indexes created for performance optimization');
    console.log('\n⚡ Triggers configured for automatic timestamp updates');
    
    console.log('\n💡 Next steps:');
    console.log('   - Run "npm run db:populate" to add sample data');
    console.log('   - Or start adding your own data through the application');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error creating tables:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to create tables:', error);
    process.exit(1);
  });