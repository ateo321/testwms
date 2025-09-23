const axios = require('axios');

const API_BASE_URL = 'https://testwms-production.up.railway.app/api';

async function checkProductionDatabase() {
  try {
    console.log('🔍 Checking Production Database (Railway)...\n');

    // Login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@wms.com',
      password: 'password123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully\n');

    // Check each endpoint for data counts
    const endpoints = [
      { name: 'Users', url: '/users?page=1&limit=1' },
      { name: 'Warehouses', url: '/warehouses?page=1&limit=1' },
      { name: 'Products', url: '/products?page=1&limit=1' },
      { name: 'Inventory', url: '/inventory?page=1&limit=1' },
      { name: 'Orders', url: '/orders?page=1&limit=1' },
      { name: 'Reports', url: '/reports/metrics' }
    ];

    const counts = {};

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (endpoint.name === 'Reports') {
          counts[endpoint.name] = 'Available';
          console.log(`📊 ${endpoint.name}: Available`);
        } else {
          const total = response.data.data.pagination?.total || response.data.data?.length || 0;
          counts[endpoint.name] = total;
          console.log(`📊 ${endpoint.name}: ${total}`);
        }
      } catch (error) {
        counts[endpoint.name] = 'Error';
        console.log(`❌ ${endpoint.name}: Error - ${error.response?.data?.message || error.message}`);
      }
    }

    // Get sample data from each endpoint
    console.log('\n📋 Sample Data:');

    // Sample Users
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('\n👥 Sample Users:');
      usersResponse.data.data.users.forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`);
      });
    } catch (error) {
      console.log('\n👥 Sample Users: Error fetching data');
    }

    // Sample Warehouses
    try {
      const warehousesResponse = await axios.get(`${API_BASE_URL}/warehouses?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('\n🏢 Sample Warehouses:');
      warehousesResponse.data.data.warehouses.forEach(warehouse => {
        console.log(`  - ${warehouse.name} (${warehouse.city}, ${warehouse.state}) - ${warehouse.isActive ? 'Active' : 'Inactive'}`);
      });
    } catch (error) {
      console.log('\n🏢 Sample Warehouses: Error fetching data');
    }

    // Sample Products
    try {
      const productsResponse = await axios.get(`${API_BASE_URL}/products?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('\n📦 Sample Products:');
      productsResponse.data.data.products.forEach(product => {
        console.log(`  - ${product.name} (${product.sku}) - ${product.category} - $${product.unitPrice}`);
      });
    } catch (error) {
      console.log('\n📦 Sample Products: Error fetching data');
    }

    // Sample Inventory
    try {
      const inventoryResponse = await axios.get(`${API_BASE_URL}/inventory?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('\n📊 Sample Inventory:');
      inventoryResponse.data.data.inventory.forEach(item => {
        console.log(`  - ${item.product.name} in ${item.warehouse.name} - Qty: ${item.quantity}, Available: ${item.available}`);
      });
    } catch (error) {
      console.log('\n📊 Sample Inventory: Error fetching data');
    }

    // Sample Orders
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('\n📋 Sample Orders:');
      ordersResponse.data.data.orders.forEach(order => {
        console.log(`  - ${order.orderNumber} - ${order.customerName} - $${order.totalValue} - ${order.status} - ${order.createdAt.split('T')[0]}`);
      });
    } catch (error) {
      console.log('\n📋 Sample Orders: Error fetching data');
    }

    console.log('\n✅ Production database review completed!');

  } catch (error) {
    console.error('❌ Error checking production database:', error.response?.data || error.message);
  }
}

checkProductionDatabase();
