const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function debugAPIResponses() {
  try {
    console.log('🔍 Debugging API Responses...');
    
    // Login first
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test users endpoint with full response
    console.log('\n👥 Users API Response:');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=5`, { headers });
      console.log('Status:', usersResponse.status);
      console.log('Response:', JSON.stringify(usersResponse.data, null, 2));
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Test warehouses endpoint
    console.log('\n🏢 Warehouses API Response:');
    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouse?page=1&limit=5`, { headers });
      console.log('Status:', warehousesResponse.status);
      console.log('Response:', JSON.stringify(warehousesResponse.data, null, 2));
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
    
    // Test inventory endpoint
    console.log('\n📦 Inventory API Response:');
    try {
      const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=5`, { headers });
      console.log('Status:', inventoryResponse.status);
      console.log('Response:', JSON.stringify(inventoryResponse.data, null, 2));
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugAPIResponses();
