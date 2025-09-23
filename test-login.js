const axios = require('axios');

async function testLogin() {
  console.log('🔍 Testing Login Functionality...');
  
  try {
    // Test backend API health
    console.log('\n1. Testing Backend API Health...');
    try {
      const healthResponse = await axios.get('http://localhost:3002/api/health');
      console.log('✅ Backend API is running:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend API not accessible:', error.message);
    }
    
    // Test frontend
    console.log('\n2. Testing Frontend...');
    try {
      const frontendResponse = await axios.get('http://localhost:3000');
      console.log('✅ Frontend is running, status:', frontendResponse.status);
    } catch (error) {
      console.log('❌ Frontend not accessible:', error.message);
    }
    
    // Test login API
    console.log('\n3. Testing Login API...');
    try {
      const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
        email: 'admin@wms.com',
        password: 'password123'
      });
      console.log('✅ Login successful:', {
        status: loginResponse.data.status,
        user: loginResponse.data.data?.user?.firstName + ' ' + loginResponse.data.data?.user?.lastName,
        role: loginResponse.data.data?.user?.role
      });
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();
