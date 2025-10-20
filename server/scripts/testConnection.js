// ============================================
// FILE: server/scripts/testConnection.js
// ============================================
const pool = require('../config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    
    // Test database version
    const versionResult = await client.query('SELECT version()');
    console.log(`📊 PostgreSQL Version: ${versionResult.rows[0].version.split(',')[0]}`);
    
    // Check if tables exist
    console.log('\n📋 Checking tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const requiredTables = ['categories', 'suppliers', 'products'];
    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    requiredTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ Table '${table}' exists`);
      } else {
        console.log(`  ❌ Table '${table}' is missing!`);
      }
    });
    
    // Count records in each table
    if (existingTables.length > 0) {
      console.log('\n📊 Record counts:');
      for (const table of requiredTables) {
        if (existingTables.includes(table)) {
          const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
          console.log(`  ${table}: ${countResult.rows[0].count} records`);
        }
      }
    }
    
    // Test foreign key relationships
    console.log('\n🔗 Checking foreign key constraints...');
    const fkResult = await client.query(`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      ORDER BY tc.table_name
    `);
    
    if (fkResult.rows.length > 0) {
      fkResult.rows.forEach(fk => {
        console.log(`  ✅ ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('  ⚠️  No foreign key constraints found');
    }
    
    // Test indexes
    console.log('\n📇 Checking indexes...');
    const indexResult = await client.query(`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('products', 'categories', 'suppliers')
      ORDER BY tablename, indexname
    `);
    
    if (indexResult.rows.length > 0) {
      indexResult.rows.forEach(idx => {
        console.log(`  ✅ ${idx.indexname} on ${idx.tablename}`);
      });
    }
    
    client.release();
    
    console.log('\n✅ Database connection test completed successfully!');
    console.log('\n💡 Tips:');
    console.log('   - Run "npm run db:populate" to add sample data');
    console.log('   - Run "npm run dev" to start the development server');
    
  } catch (error) {
    console.error('\n❌ Database connection test failed!');
    console.error('\nError details:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Make sure PostgreSQL is running');
      console.error('   2. Check if the port in .env matches your PostgreSQL port');
      console.error('   3. Verify your database credentials in .env');
    } else if (error.code === '3D000') {
      console.error('\n💡 The database does not exist. Create it with:');
      console.error('   psql -U postgres -c "CREATE DATABASE inventory_db;"');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your username and password in .env');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabaseConnection();