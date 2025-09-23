const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function addMoreData() {
  try {
    console.log('🚀 Adding more data to production database...');
    
    // First, let's try the force-seed endpoint multiple times to add more data
    for (let i = 0; i < 3; i++) {
      console.log(`📊 Adding batch ${i + 1}...`);
      
      const response = await axios.post(`${API_BASE_URL}/force-seed`, {
        addMoreData: true
      });
      
      console.log(`✅ Batch ${i + 1} completed:`, response.data.message);
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Now let's try the regular seed endpoint
    console.log('🌱 Running regular seed...');
    const seedResponse = await axios.post(`${API_BASE_URL}/seed`);
    console.log('✅ Regular seed completed:', seedResponse.data.message);
    
    // Check final data
    console.log('\n📊 Checking final data...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('📈 Database stats:', healthResponse.data);
    
  } catch (error) {
    console.error('❌ Error adding data:', error.response?.data || error.message);
  }
}

addMoreData();