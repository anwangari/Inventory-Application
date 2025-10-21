// ============================================
// FILE: server/scripts/populatedb.js
// ============================================
// ============================================
// FILE: server/scripts/populate.js
// ============================================
const pool = require('../config/database');

const sampleCategories = [
  { name: 'Electronics', description: 'Electronic devices, components, and accessories' },
  { name: 'Furniture', description: 'Office and home furniture items' },
  { name: 'Stationery', description: 'Office supplies, paper products, and writing materials' },
  { name: 'Computer Hardware', description: 'Computer parts, peripherals, and accessories' },
  { name: 'Kitchen Appliances', description: 'Kitchen equipment and appliances' },
  { name: 'Cleaning Supplies', description: 'Cleaning products and maintenance supplies' },
  { name: 'Safety Equipment', description: 'Safety gear and protective equipment' },
  { name: 'Tools', description: 'Hand tools, power tools, and equipment' }
];

const sampleSuppliers = [
  {
    name: 'Tech Supplies Inc',
    contact_person: 'John Anderson',
    email: 'john.anderson@techsupplies.com',
    phone: '+1-555-0101',
    address: '123 Technology Drive, Silicon Valley, CA 94025'
  },
  {
    name: 'Office Depot Solutions',
    contact_person: 'Sarah Johnson',
    email: 'sarah.j@officedepot.com',
    phone: '+1-555-0102',
    address: '456 Business Park, New York, NY 10001'
  },
  {
    name: 'Global Electronics Ltd',
    contact_person: 'Michael Chen',
    email: 'mchen@globalelectronics.com',
    phone: '+1-555-0103',
    address: '789 Industrial Blvd, Austin, TX 73301'
  },
  {
    name: 'Furniture Masters Co',
    contact_person: 'Emily Davis',
    email: 'emily.davis@furnituremasters.com',
    phone: '+1-555-0104',
    address: '321 Warehouse Street, Chicago, IL 60601'
  },
  {
    name: 'Premium Stationery Supply',
    contact_person: 'Robert Wilson',
    email: 'rwilson@premiumstationery.com',
    phone: '+1-555-0105',
    address: '654 Commerce Ave, Boston, MA 02101'
  },
  {
    name: 'Hardware Hub International',
    contact_person: 'Lisa Martinez',
    email: 'lisa.m@hardwarehub.com',
    phone: '+1-555-0106',
    address: '987 Trade Center, Seattle, WA 98101'
  }
];

const sampleProducts = [
  // Electronics
  { name: 'Wireless Mouse', sku: 'ELEC-001', description: 'Ergonomic wireless mouse with USB receiver', category: 'Electronics', supplier: 'Tech Supplies Inc', quantity: 45, unit_price: 29.99, reorder_level: 15 },
  { name: 'USB Keyboard', sku: 'ELEC-002', description: 'Full-size mechanical keyboard', category: 'Electronics', supplier: 'Global Electronics Ltd', quantity: 32, unit_price: 59.99, reorder_level: 10 },
  { name: 'Webcam HD', sku: 'ELEC-003', description: '1080p HD webcam with microphone', category: 'Electronics', supplier: 'Tech Supplies Inc', quantity: 8, unit_price: 89.99, reorder_level: 10 },
  { name: 'USB-C Cable', sku: 'ELEC-004', description: '6ft USB-C charging cable', category: 'Electronics', supplier: 'Global Electronics Ltd', quantity: 150, unit_price: 12.99, reorder_level: 30 },
  
  // Computer Hardware
  { name: 'SSD 1TB', sku: 'COMP-001', description: 'Solid State Drive 1TB SATA', category: 'Computer Hardware', supplier: 'Hardware Hub International', quantity: 25, unit_price: 129.99, reorder_level: 8 },
  { name: 'RAM 16GB DDR4', sku: 'COMP-002', description: '16GB DDR4 Memory Module', category: 'Computer Hardware', supplier: 'Tech Supplies Inc', quantity: 18, unit_price: 79.99, reorder_level: 12 },
  { name: 'HDMI Cable 10ft', sku: 'COMP-003', description: '10ft HDMI 2.0 cable', category: 'Computer Hardware', supplier: 'Hardware Hub International', quantity: 55, unit_price: 15.99, reorder_level: 20 },
  { name: 'External Hard Drive 2TB', sku: 'COMP-004', description: 'Portable 2TB external HDD', category: 'Computer Hardware', supplier: 'Global Electronics Ltd', quantity: 12, unit_price: 89.99, reorder_level: 8 },
  
  // Furniture
  { name: 'Office Chair Executive', sku: 'FURN-001', description: 'Ergonomic executive office chair with lumbar support', category: 'Furniture', supplier: 'Furniture Masters Co', quantity: 15, unit_price: 299.99, reorder_level: 5 },
  { name: 'Standing Desk', sku: 'FURN-002', description: 'Adjustable height standing desk 60x30', category: 'Furniture', supplier: 'Furniture Masters Co', quantity: 8, unit_price: 449.99, reorder_level: 3 },
  { name: 'File Cabinet 3-Drawer', sku: 'FURN-003', description: 'Metal file cabinet with lock', category: 'Furniture', supplier: 'Office Depot Solutions', quantity: 12, unit_price: 189.99, reorder_level: 4 },
  { name: 'Bookshelf 5-Tier', sku: 'FURN-004', description: 'Wooden bookshelf 5 tiers', category: 'Furniture', supplier: 'Furniture Masters Co', quantity: 6, unit_price: 129.99, reorder_level: 3 },
  
  // Stationery
  { name: 'Printer Paper A4 Ream', sku: 'STAT-001', description: 'White A4 printer paper 500 sheets', category: 'Stationery', supplier: 'Premium Stationery Supply', quantity: 200, unit_price: 6.99, reorder_level: 50 },
  { name: 'Ballpoint Pens Box', sku: 'STAT-002', description: 'Blue ballpoint pens pack of 50', category: 'Stationery', supplier: 'Office Depot Solutions', quantity: 85, unit_price: 12.99, reorder_level: 20 },
  { name: 'Spiral Notebook A4', sku: 'STAT-003', description: 'A4 spiral bound notebook 200 pages', category: 'Stationery', supplier: 'Premium Stationery Supply', quantity: 120, unit_price: 4.99, reorder_level: 30 },
  { name: 'Sticky Notes Pack', sku: 'STAT-004', description: 'Colorful sticky notes 12 pads', category: 'Stationery', supplier: 'Office Depot Solutions', quantity: 75, unit_price: 8.99, reorder_level: 25 },
  { name: 'Highlighters Set', sku: 'STAT-005', description: 'Fluorescent highlighters 6 colors', category: 'Stationery', supplier: 'Premium Stationery Supply', quantity: 90, unit_price: 7.99, reorder_level: 20 },
  
  // Kitchen Appliances
  { name: 'Coffee Maker', sku: 'KITCH-001', description: '12-cup programmable coffee maker', category: 'Kitchen Appliances', supplier: 'Office Depot Solutions', quantity: 5, unit_price: 79.99, reorder_level: 3 },
  { name: 'Microwave Oven', sku: 'KITCH-002', description: '1000W microwave oven', category: 'Kitchen Appliances', supplier: 'Global Electronics Ltd', quantity: 4, unit_price: 149.99, reorder_level: 2 },
  { name: 'Water Dispenser', sku: 'KITCH-003', description: 'Hot and cold water dispenser', category: 'Kitchen Appliances', supplier: 'Office Depot Solutions', quantity: 3, unit_price: 199.99, reorder_level: 2 },
  
  // Cleaning Supplies
  { name: 'Disinfectant Spray', sku: 'CLEAN-001', description: 'Multi-surface disinfectant spray 32oz', category: 'Cleaning Supplies', supplier: 'Office Depot Solutions', quantity: 65, unit_price: 8.99, reorder_level: 20 },
  { name: 'Paper Towels Roll', sku: 'CLEAN-002', description: 'Paper towels 12 rolls pack', category: 'Cleaning Supplies', supplier: 'Premium Stationery Supply', quantity: 45, unit_price: 15.99, reorder_level: 15 },
  { name: 'Trash Bags Large', sku: 'CLEAN-003', description: 'Heavy duty trash bags 50 count', category: 'Cleaning Supplies', supplier: 'Office Depot Solutions', quantity: 35, unit_price: 12.99, reorder_level: 10 },
  
  // Safety Equipment
  { name: 'First Aid Kit', sku: 'SAFE-001', description: 'Complete first aid kit 100 pieces', category: 'Safety Equipment', supplier: 'Hardware Hub International', quantity: 10, unit_price: 34.99, reorder_level: 5 },
  { name: 'Fire Extinguisher', sku: 'SAFE-002', description: '5lb ABC fire extinguisher', category: 'Safety Equipment', supplier: 'Hardware Hub International', quantity: 8, unit_price: 45.99, reorder_level: 3 },
  { name: 'Safety Goggles', sku: 'SAFE-003', description: 'Clear safety goggles ANSI certified', category: 'Safety Equipment', supplier: 'Hardware Hub International', quantity: 25, unit_price: 9.99, reorder_level: 10 },
  
  // Tools
  { name: 'Screwdriver Set', sku: 'TOOL-001', description: 'Professional screwdriver set 20 pieces', category: 'Tools', supplier: 'Hardware Hub International', quantity: 18, unit_price: 39.99, reorder_level: 8 },
  { name: 'Cordless Drill', sku: 'TOOL-002', description: '20V cordless drill with battery', category: 'Tools', supplier: 'Hardware Hub International', quantity: 6, unit_price: 129.99, reorder_level: 3 },
  { name: 'Tool Box', sku: 'TOOL-003', description: 'Heavy duty tool box with compartments', category: 'Tools', supplier: 'Hardware Hub International', quantity: 12, unit_price: 49.99, reorder_level: 5 }
];

async function checkAndCreateTables(client) {
  console.log('🔍 Checking if tables exist...');
  
  const tableCheck = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('categories', 'suppliers', 'products')
  `);
  
  const existingTables = tableCheck.rows.map(row => row.table_name);
  const requiredTables = ['categories', 'suppliers', 'products'];
  const missingTables = requiredTables.filter(t => !existingTables.includes(t));
  
  if (missingTables.length > 0) {
    console.log('⚠️  Missing tables detected:', missingTables.join(', '));
    console.log('📋 Creating tables...');
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS suppliers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          contact_person VARCHAR(200),
          email VARCHAR(200),
          phone VARCHAR(50),
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
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

      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
      CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
      CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    
    console.log('✅ Tables created successfully!');
  } else {
    console.log('✅ All tables exist');
  }
}

async function populateDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check and create tables if needed
    await checkAndCreateTables(client);
    
    console.log('\n🗑️  Clearing existing data...');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM categories');
    await client.query('DELETE FROM suppliers');
    await client.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE suppliers_id_seq RESTART WITH 1');
    
    console.log('📦 Inserting categories...');
    const categoryMap = {};
    for (const category of sampleCategories) {
      const result = await client.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name',
        [category.name, category.description]
      );
      categoryMap[result.rows[0].name] = result.rows[0].id;
      console.log(`  ✓ Added category: ${result.rows[0].name}`);
    }
    
    console.log('\n🏢 Inserting suppliers...');
    const supplierMap = {};
    for (const supplier of sampleSuppliers) {
      const result = await client.query(
        'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, name',
        [supplier.name, supplier.contact_person, supplier.email, supplier.phone, supplier.address]
      );
      supplierMap[result.rows[0].name] = result.rows[0].id;
      console.log(`  ✓ Added supplier: ${result.rows[0].name}`);
    }
    
    console.log('\n📦 Inserting products...');
    let productCount = 0;
    for (const product of sampleProducts) {
      const categoryId = categoryMap[product.category];
      const supplierId = supplierMap[product.supplier];
      
      await client.query(
        `INSERT INTO products (name, sku, description, category_id, supplier_id, quantity, unit_price, reorder_level, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          product.name,
          product.sku,
          product.description,
          categoryId,
          supplierId,
          product.quantity,
          product.unit_price,
          product.reorder_level,
          'active'
        ]
      );
      productCount++;
      console.log(`  ✓ Added product: ${product.name} (${product.sku})`);
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ Database populated successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Categories: ${sampleCategories.length}`);
    console.log(`   Suppliers: ${sampleSuppliers.length}`);
    console.log(`   Products: ${productCount}`);
    console.log(`\n🚀 You can now start your server and access the application.`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the population script
populateDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to populate database:', error);
    process.exit(1);
  });