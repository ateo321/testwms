const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function pushDataToRailway() {
  try {
    console.log('🚀 Pushing data to Railway production...\n');

    // Wait a moment for deployment to complete
    console.log('⏳ Waiting for deployment...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Try the force-seed endpoint
    console.log('🌱 Triggering force-seed endpoint...');
    try {
      const response = await axios.post(`${API_BASE_URL}/force-seed`, {}, {
        timeout: 60000 // 60 second timeout
      });
      
      console.log('✅ Force-seed successful!');
      console.log('📊 Data counts:', response.data.data);
      
    } catch (error) {
      console.log('⚠️ Force-seed failed, trying regular seed...');
      
      // Fallback to regular seed
      const seedResponse = await axios.post(`${API_BASE_URL}/seed`, {}, {
        timeout: 60000
      });
      
      console.log('✅ Regular seed successful!');
      console.log('📊 Data counts:', seedResponse.data.data);
    }

    // Verify the data was added
    console.log('\n🔍 Verifying data...');
    
    // Login to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;

    // Check users
    const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`👥 Users: ${usersResponse.data.data.pagination.total}`);

    // Check warehouses
    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouses?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`🏢 Warehouses: ${warehousesResponse.data.data.pagination.total}`);
    } catch (error) {
      console.log(`🏢 Warehouses: Error - ${error.response?.data?.message || 'Unknown error'}`);
    }

    // Check products
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`📦 Products: ${productsResponse.data.data.pagination.total}`);
    } catch (error) {
      console.log(`📦 Products: Error - ${error.response?.data?.message || 'Unknown error'}`);
    }

    // Check inventory
    const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`📊 Inventory: ${inventoryResponse.data.data.pagination.total}`);

    // Check orders
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`📋 Orders: ${ordersResponse.data.data.pagination.total}`);

    console.log('\n🎉 Railway data push completed!');

  } catch (error) {
    console.error('❌ Error pushing data to Railway:', error.response?.data || error.message);
  }
}

pushDataToRailway();

