// Test script to call the seed endpoint
const https = require('https');

// Replace with your actual Railway URL
const RAILWAY_URL = 'https://wms-production-0b5b.up.railway.app';

function testSeedEndpoint() {
  const options = {
    hostname: 'wms-production-0b5b.up.railway.app',
    port: 443,
    path: '/api/seed',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  console.log('🌱 Testing seed endpoint...');
  console.log(`URL: ${RAILWAY_URL}/api/seed`);

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📊 Response Status:', res.statusCode);
      console.log('📋 Response Data:', data);
      
      try {
        const response = JSON.parse(data);
        if (response.status === 'success') {
          console.log('✅ Database seeded successfully!');
          console.log('📈 Data counts:', response.data);
        } else {
          console.log('❌ Seed failed:', response.message);
        }
      } catch (error) {
        console.log('❌ Failed to parse response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.end();
}

// Test health endpoint first
function testHealthEndpoint() {
  const options = {
    hostname: 'wms-production-0b5b.up.railway.app',
    port: 443,
    path: '/api/health',
    method: 'GET',
  };

  console.log('🏥 Testing health endpoint...');
  console.log(`URL: ${RAILWAY_URL}/api/health`);

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('📊 Health Status:', res.statusCode);
      console.log('📋 Health Response:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ API is running, testing seed endpoint...');
        setTimeout(testSeedEndpoint, 2000); // Wait 2 seconds then test seed
      } else {
        console.log('❌ API is not responding properly');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Health check failed:', error.message);
  });

  req.end();
}

// Start with health check
testHealthEndpoint();
