const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function testProductionData() {
  try {
    console.log('🔍 Testing Production Database Data...');
    
    // Login first
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Logged in successfully');
    
    // Set up headers with token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test users endpoint
    console.log('\n👥 Testing Users API...');
    const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=5`, { headers });
    console.log('📊 Users:', usersResponse.data.pagination?.total || 'No pagination data');
    console.log('📋 Sample users:', usersResponse.data.users?.slice(0, 3).map(u => `${u.firstName} ${u.lastName} (${u.email})`));
    
    // Test warehouses endpoint
    console.log('\n🏢 Testing Warehouses API...');
    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouse?page=1&limit=5`, { headers });
      console.log('📊 Warehouses:', warehousesResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample warehouses:', warehousesResponse.data.warehouses?.slice(0, 3).map(w => w.name));
    } catch (error) {
      console.log('❌ Warehouses API error:', error.response?.data?.message || error.message);
    }
    
    // Test inventory endpoint
    console.log('\n📦 Testing Inventory API...');
    try {
      const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=5`, { headers });
      console.log('📊 Inventory:', inventoryResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample inventory:', inventoryResponse.data.inventory?.slice(0, 3).map(i => `${i.product?.name} - Qty: ${i.quantity}`));
    } catch (error) {
      console.log('❌ Inventory API error:', error.response?.data?.message || error.message);
    }
    
    // Test orders endpoint
    console.log('\n📋 Testing Orders API...');
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=5`, { headers });
      console.log('📊 Orders:', ordersResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample orders:', ordersResponse.data.orders?.slice(0, 3).map(o => `Order #${o.orderNumber}`));
    } catch (error) {
      console.log('❌ Orders API error:', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing data:', error.response?.data || error.message);
  }
}

testProductionData();
