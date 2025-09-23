const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function addDataToRailway() {
  try {
    console.log('🌱 Adding data to Railway...');

    // Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');

    // Add users directly via database seeding approach
    console.log('👥 Adding users via seed endpoint...');
    
    // Create a simple seed script that adds users
    const seedData = {
      users: []
    };

    // Generate 50 users
    for (let i = 0; i < 50; i++) {
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@test.com`;
      const username = `user${i + 1}`;
      const role = ['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'][i % 4];
      
      seedData.users.push({
        firstName,
        lastName,
        email,
        username,
        password: 'password123',
        role,
        isActive: Math.random() > 0.1,
      });
    }

    // Try to add users via a custom endpoint or direct database call
    // Since we can't directly access the database, let's try a different approach
    
    console.log('📊 Checking current data counts...');
    
    // Check users
    const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Current users: ${usersResponse.data.data.pagination.total}`);

    // Check warehouses
    const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouses?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Current warehouses: ${warehousesResponse.data.data.pagination.total}`);

    // Check inventory
    const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Current inventory: ${inventoryResponse.data.data.pagination.total}`);

    // Check orders
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Current orders: ${ordersResponse.data.data.pagination.total}`);

    console.log('✅ Data check completed');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

addDataToRailway();
