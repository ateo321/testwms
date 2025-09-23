const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function checkUsers() {
  try {
    console.log('🔍 Checking Production Users...');
    
    // Try different common admin credentials
    const adminCredentials = [
      { email: 'admin@wms.com', password: 'admin123' },
      { email: 'admin@wms.com', password: 'password' },
      { email: 'admin@wms.com', password: 'admin' },
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'admin@test.com', password: 'password' },
      { email: 'admin@test.com', password: 'admin' },
    ];
    
    for (const creds of adminCredentials) {
      try {
        console.log(`🔐 Trying ${creds.email}...`);
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, creds);
        
        if (loginResponse.data.token) {
          console.log('✅ Login successful!');
          console.log('📊 User data:', {
            email: loginResponse.data.user?.email,
            role: loginResponse.data.user?.role,
            firstName: loginResponse.data.user?.firstName,
            lastName: loginResponse.data.user?.lastName
          });
          return;
        }
      } catch (error) {
        console.log(`❌ Failed: ${error.response?.data?.message || error.message}`);
      }
    }
    
    console.log('❌ No valid admin credentials found');
    
  } catch (error) {
    console.error('❌ Error checking users:', error.response?.data || error.message);
  }
}

checkUsers();
