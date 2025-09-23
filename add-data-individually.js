const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function addDataIndividually() {
  try {
    console.log('🚀 Adding data individually to Railway...\n');

    // Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully\n');

    // Add users one by one
    console.log('👥 Adding users...');
    for (let i = 1; i <= 20; i++) {
      try {
        const userData = {
          firstName: `User${i}`,
          lastName: `Test${i}`,
          email: `user${i}@test.com`,
          username: `user${i}`,
          password: 'password123',
          role: ['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'][i % 4],
          isActive: true,
        };

        await axios.post(`${API_BASE_URL}/users`, userData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Added user ${i}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️ User ${i} already exists`);
        } else {
          console.log(`❌ Error adding user ${i}: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // Add warehouses one by one
    console.log('\n🏢 Adding warehouses...');
    const warehouses = [
      { name: 'North Warehouse', city: 'New York', state: 'NY' },
      { name: 'South Warehouse', city: 'Los Angeles', state: 'CA' },
      { name: 'East Warehouse', city: 'Chicago', state: 'IL' },
      { name: 'West Warehouse', city: 'Houston', state: 'TX' },
      { name: 'Central Warehouse', city: 'Phoenix', state: 'AZ' }
    ];

    for (const warehouse of warehouses) {
      try {
        const warehouseData = {
          name: warehouse.name,
          address: '123 Main St',
          city: warehouse.city,
          state: warehouse.state,
          zipCode: '12345',
          country: 'US',
          isActive: true,
        };

        await axios.post(`${API_BASE_URL}/warehouses`, warehouseData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Added warehouse: ${warehouse.name}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️ Warehouse ${warehouse.name} already exists`);
        } else {
          console.log(`❌ Error adding warehouse ${warehouse.name}: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // Add products one by one
    console.log('\n📦 Adding products...');
    for (let i = 1; i <= 20; i++) {
      try {
        const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
        const productData = {
          name: `Product ${i}`,
          sku: `SKU-${String(i).padStart(3, '0')}`,
          description: `Description for product ${i}`,
          category: categories[i % categories.length],
          unitPrice: Math.floor(Math.random() * 1000) + 10,
        };

        await axios.post(`${API_BASE_URL}/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`✅ Added product ${i}`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`⚠️ Product ${i} already exists`);
        } else {
          console.log(`❌ Error adding product ${i}: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // Check final counts
    console.log('\n📊 Final verification...');
    
    const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`👥 Total users: ${usersResponse.data.data.pagination.total}`);

    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouses?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`🏢 Total warehouses: ${warehousesResponse.data.data.pagination.total}`);
    } catch (error) {
      console.log(`🏢 Warehouses: API error`);
    }

    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`📦 Total products: ${productsResponse.data.data.pagination.total}`);
    } catch (error) {
      console.log(`📦 Products: API error`);
    }

    const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`📊 Total inventory: ${inventoryResponse.data.data.pagination.total}`);

    const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`📋 Total orders: ${ordersResponse.data.data.pagination.total}`);

    console.log('\n🎉 Data addition completed!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

addDataIndividually();

