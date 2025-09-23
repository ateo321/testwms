// Simple script to add test data via API calls
const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function addTestData() {
  try {
    console.log('🌱 Adding test data via API...');

    // First, login to get auth token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');

    // Add 20 more users
    console.log('👥 Adding 20 more users...');
    const users = [];
    for (let i = 0; i < 20; i++) {
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@test.com`;
      const username = `user${i + 1}`;
      
      users.push({
        firstName,
        lastName,
        email,
        username,
        password: 'password123',
        role: ['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'][i % 4],
        isActive: true,
      });
    }

    // Add users one by one
    for (const user of users) {
      try {
        await axios.post(`${API_BASE_URL}/users`, user, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Added user: ${user.email}`);
      } catch (error) {
        console.log(`⚠️ User ${user.email} might already exist`);
      }
    }

    // Add 5 more warehouses
    console.log('🏢 Adding 5 more warehouses...');
    const warehouses = [
      {
        name: 'North Warehouse',
        address: '123 North St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'South Warehouse',
        address: '456 South Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'US',
        isActive: true,
      },
      {
        name: 'East Warehouse',
        address: '789 East Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'US',
        isActive: true,
      },
      {
        name: 'West Warehouse',
        address: '321 West St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'Central Warehouse',
        address: '654 Central Ave',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'US',
        isActive: true,
      }
    ];

    for (const warehouse of warehouses) {
      try {
        await axios.post(`${API_BASE_URL}/warehouses`, warehouse, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Added warehouse: ${warehouse.name}`);
      } catch (error) {
        console.log(`⚠️ Warehouse ${warehouse.name} might already exist`);
      }
    }

    // Add 50 more products
    console.log('📦 Adding 50 more products...');
    const products = [];
    for (let i = 0; i < 50; i++) {
      products.push({
        name: `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        description: `Description for product ${i + 1}`,
        category: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'][i % 5],
        unitPrice: Math.floor(Math.random() * 1000) + 10,
      });
    }

    for (const product of products) {
      try {
        await axios.post(`${API_BASE_URL}/products`, product, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Added product: ${product.name}`);
      } catch (error) {
        console.log(`⚠️ Product ${product.name} might already exist`);
      }
    }

    console.log('🎉 Test data addition completed!');

  } catch (error) {
    console.error('❌ Error adding test data:', error.message);
  }
}

addTestData();
