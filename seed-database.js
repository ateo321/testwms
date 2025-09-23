// Simple database seeding script
const https = require('https');

const RAILWAY_URL = 'https://testwms-production.up.railway.app';

// First, let's try to create data via API calls
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Test health endpoint first
    console.log('🏥 Testing health endpoint...');
    const healthResponse = await makeRequest('GET', '/api/health');
    console.log('✅ Health check passed:', healthResponse.message);
    
    // Try to seed via API
    console.log('🌱 Attempting to seed via API...');
    try {
      const seedResponse = await makeRequest('POST', '/api/seed');
      console.log('✅ Database seeded via API:', seedResponse);
      return;
    } catch (error) {
      console.log('❌ API seeding failed:', error.message);
    }
    
    // If API seeding fails, provide manual instructions
    console.log('\n📋 Manual Database Population Instructions:');
    console.log('1. Go to Railway Dashboard: https://railway.app');
    console.log('2. Click on your WMS project');
    console.log('3. Click on your main app service');
    console.log('4. Go to "Deployments" tab');
    console.log('5. Click on the latest deployment');
    console.log('6. Look for "Console" or "Terminal" option');
    console.log('7. Run: node seed-railway.js');
    console.log('\n🔑 Admin credentials will be: admin@wms.com / password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'testwms-production.up.railway.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${response.message || data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Run the seeding
seedDatabase();
