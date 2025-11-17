require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await pool.query('DELETE FROM transactions');
    await pool.query('DELETE FROM auth_tokens');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const cashierPassword = await bcrypt.hash('cashier123', 10);

    // Insert Users
    console.log('👤 Inserting users...');
    const user1 = await pool.query(
      'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Admin Toko', 'admin@toko.com', adminPassword, 'admin', true]
    );
    const user2 = await pool.query(
      'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Kasir Satu', 'kasir1@toko.com', cashierPassword, 'cashier', true]
    );
    const user3 = await pool.query(
      'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Kasir Dua', 'kasir2@toko.com', cashierPassword, 'cashier', true]
    );

    const adminId = user1.rows[0].id;
    const cashier1Id = user2.rows[0].id;
    const cashier2Id = user3.rows[0].id;

    console.log(`✅ Users created: Admin (ID: ${adminId}), Cashier 1 (ID: ${cashier1Id}), Cashier 2 (ID: ${cashier2Id})`);

    // Insert Categories (Semua Pakaian)
    console.log('📁 Inserting categories...');
    const cat1 = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
      ['Pakaian Pria', 'Pakaian untuk pria dewasa']
    );
    const cat2 = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
      ['Pakaian Wanita', 'Pakaian untuk wanita dewasa']
    );
    const cat3 = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
      ['Pakaian Anak', 'Pakaian untuk anak-anak']
    );
    const cat4 = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
      ['Aksesoris Pakaian', 'Aksesoris dan perlengkapan pakaian']
    );
    const cat5 = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
      ['Sepatu & Sandal', 'Sepatu dan sandal untuk semua usia']
    );

    const cat1Id = cat1.rows[0].id;
    const cat2Id = cat2.rows[0].id;
    const cat3Id = cat3.rows[0].id;
    const cat4Id = cat4.rows[0].id;
    const cat5Id = cat5.rows[0].id;

    console.log(`✅ Categories created: Pakaian Pria (${cat1Id}), Pakaian Wanita (${cat2Id}), Pakaian Anak (${cat3Id}), Aksesoris (${cat4Id}), Sepatu (${cat5Id})`);

    // Insert Products (Semua Pakaian)
    console.log('📦 Inserting products...');
    const products = [
      // Pakaian Pria
      ['Kemeja Pria Formal Putih', 250000, 30, cat1Id],
      ['Kemeja Pria Casual', 200000, 35, cat1Id],
      ['Celana Jeans Pria', 350000, 25, cat1Id],
      ['Celana Chino Pria', 300000, 28, cat1Id],
      ['Kaos Pria Polos', 80000, 50, cat1Id],
      ['Kaos Pria Kemeja', 120000, 40, cat1Id],
      ['Jaket Pria Denim', 450000, 20, cat1Id],
      ['Jaket Pria Hoodie', 400000, 22, cat1Id],
      ['Celana Training Pria', 180000, 30, cat1Id],
      ['Kemeja Batik Pria', 350000, 25, cat1Id],
      
      // Pakaian Wanita
      ['Dress Wanita Casual', 450000, 20, cat2Id],
      ['Dress Wanita Formal', 550000, 15, cat2Id],
      ['Blouse Wanita', 250000, 30, cat2Id],
      ['Rok Wanita', 200000, 35, cat2Id],
      ['Celana Jeans Wanita', 350000, 25, cat2Id],
      ['Kaos Wanita', 100000, 45, cat2Id],
      ['Kemeja Wanita', 280000, 28, cat2Id],
      ['Jaket Wanita', 380000, 20, cat2Id],
      ['Legging Wanita', 150000, 40, cat2Id],
      ['Kebaya Modern', 650000, 12, cat2Id],
      
      // Pakaian Anak
      ['Baju Anak Laki-laki', 120000, 40, cat3Id],
      ['Baju Anak Perempuan', 130000, 38, cat3Id],
      ['Celana Anak', 100000, 45, cat3Id],
      ['Rok Anak', 90000, 42, cat3Id],
      ['Kaos Anak', 60000, 50, cat3Id],
      
      // Aksesoris Pakaian
      ['Tas Ransel', 200000, 25, cat4Id],
      ['Tas Tote', 150000, 30, cat4Id],
      ['Topi Cap', 80000, 40, cat4Id],
      ['Belt Kulit', 120000, 35, cat4Id],
      ['Dompet Kulit', 150000, 30, cat4Id],
      
      // Sepatu & Sandal
      ['Sepatu Sneakers Pria', 600000, 18, cat5Id],
      ['Sepatu Formal Pria', 800000, 15, cat5Id],
      ['Sepatu Wanita Heels', 500000, 20, cat5Id],
      ['Sepatu Wanita Flat', 400000, 22, cat5Id],
      ['Sandal Pria', 150000, 35, cat5Id],
      ['Sandal Wanita', 120000, 38, cat5Id],
      ['Sepatu Anak', 200000, 30, cat5Id],
      ['Sandal Anak', 80000, 45, cat5Id]
    ];

    for (const [name, price, stock, categoryId] of products) {
      await pool.query(
        'INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4)',
        [name, price, stock, categoryId]
      );
    }

    console.log(`✅ ${products.length} products created`);

    // Insert Transactions (dengan harga pakaian yang realistis)
    console.log('💰 Inserting transactions...');
    const transactions = [
      [450000, adminId],      // Dress + Sepatu
      [650000, cashier1Id],   // Kemeja + Celana + Sepatu
      [350000, cashier1Id],   // Kaos + Celana
      [800000, cashier2Id],   // Kebaya + Sepatu
      [280000, adminId],      // Blouse + Rok
      [550000, cashier1Id],   // Kemeja Formal + Celana
      [420000, cashier2Id],   // Jaket + Kaos
      [380000, adminId],      // Dress Casual
      [720000, cashier1Id],   // Sepatu + Kemeja + Celana
      [250000, cashier2Id],   // Kaos + Celana Training
      [680000, adminId],      // Kebaya + Sepatu
      [480000, cashier1Id],   // Jaket + Kaos + Celana
      [320000, cashier2Id],   // Blouse + Rok + Sandal
      [590000, adminId],      // Kemeja Batik + Sepatu
      [410000, cashier1Id]    // Dress + Sandal
    ];

    for (const [totalPrice, userId] of transactions) {
      await pool.query(
        'INSERT INTO transactions (total_price, user_id) VALUES ($1, $2)',
        [totalPrice, userId]
      );
    }

    console.log(`✅ ${transactions.length} transactions created`);

    // Display summary
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    const transactionCount = await pool.query('SELECT COUNT(*) FROM transactions');

    console.log('\n📊 Database Seeding Summary:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Categories: ${categoryCount.rows[0].count}`);
    console.log(`   Products: ${productCount.rows[0].count}`);
    console.log(`   Transactions: ${transactionCount.rows[0].count}`);
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin:');
    console.log('     Email: admin@toko.com');
    console.log('     Password: admin123');
    console.log('   Cashier:');
    console.log('     Email: kasir1@toko.com atau kasir2@toko.com');
    console.log('     Password: cashier123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

