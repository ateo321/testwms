const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function testWithCorrectCredentials() {
  try {
    console.log('🔍 Testing Production Database with Correct Credentials...');
    
    // Login with correct credentials
    console.log('🔐 Logging in with admin@wms.com / password123...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    console.log('✅ Logged in successfully!');
    console.log('👤 User:', user?.firstName || 'Unknown', user?.lastName || 'User');
    console.log('📊 Login response:', JSON.stringify(loginResponse.data, null, 2));
    
    // Set up headers with token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('🔑 Token:', token.substring(0, 50) + '...');
    
    // Test users endpoint
    console.log('\n👥 Testing Users API...');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=10`, { headers });
      console.log('📊 Total Users:', usersResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample users:');
      usersResponse.data.users?.slice(0, 5).forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
      });
    } catch (error) {
      console.log('❌ Users API error:', error.response?.data || error.message);
    }
    
    // Test warehouses endpoint
    console.log('\n🏢 Testing Warehouses API...');
    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouse?page=1&limit=10`, { headers });
      console.log('📊 Total Warehouses:', warehousesResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample warehouses:');
      warehousesResponse.data.warehouses?.slice(0, 5).forEach(warehouse => {
        console.log(`  - ${warehouse.name} (${warehouse.city}, ${warehouse.state})`);
      });
    } catch (error) {
      console.log('❌ Warehouses API error:', error.response?.data?.message || error.message);
    }
    
    // Test inventory endpoint
    console.log('\n📦 Testing Inventory API...');
    try {
      const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=10`, { headers });
      console.log('📊 Total Inventory Items:', inventoryResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample inventory:');
      inventoryResponse.data.inventory?.slice(0, 5).forEach(item => {
        console.log(`  - ${item.product?.name || 'Unknown Product'} - Qty: ${item.quantity}`);
      });
    } catch (error) {
      console.log('❌ Inventory API error:', error.response?.data?.message || error.message);
    }
    
    // Test orders endpoint
    console.log('\n📋 Testing Orders API...');
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=10`, { headers });
      console.log('📊 Total Orders:', ordersResponse.data.pagination?.total || 'No pagination data');
      console.log('📋 Sample orders:');
      ordersResponse.data.orders?.slice(0, 5).forEach(order => {
        console.log(`  - Order #${order.orderNumber} - Status: ${order.status}`);
      });
    } catch (error) {
      console.log('❌ Orders API error:', error.response?.data?.message || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing data:', error.response?.data || error.message);
  }
}

testWithCorrectCredentials();
