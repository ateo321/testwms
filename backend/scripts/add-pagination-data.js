const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addPaginationData() {
  try {
    console.log('🌱 Adding pagination test data...');

    // Get existing admin user
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      console.log('❌ No admin user found. Please run seed first.');
      return;
    }

    // Get existing warehouse
    const warehouse = await prisma.warehouse.findFirst();
    if (!warehouse) {
      console.log('❌ No warehouse found. Please run seed first.');
      return;
    }

    // Add 50 more users
    console.log('👥 Adding 50 more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@test.com`;
      const username = `user${i + 1}`;
      const role = ['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'][i % 4];
      const hashedPassword = await bcrypt.hash('password123', 10);

      users.push({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role,
        isActive: Math.random() > 0.1, // 90% active
      });
    }

    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdUsers.count} users`);

    // Add 5 more warehouses
    console.log('🏢 Adding 5 more warehouses...');
    const warehouses = [
      {
        name: 'North Warehouse',
        address: '123 North St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'South Warehouse',
        address: '456 South Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'US',
        isActive: true,
      },
      {
        name: 'East Warehouse',
        address: '789 East Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'US',
        isActive: true,
      },
      {
        name: 'West Warehouse',
        address: '321 West St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'Central Warehouse',
        address: '654 Central Ave',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'US',
        isActive: true,
      }
    ];

    const createdWarehouses = await prisma.warehouse.createMany({
      data: warehouses,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdWarehouses.count} warehouses`);

    // Add 100 more products
    console.log('📦 Adding 100 more products...');
    const products = [];
    for (let i = 0; i < 100; i++) {
      const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Automotive', 'Health'];
      products.push({
        name: `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        description: `Description for product ${i + 1}`,
        category: categories[i % categories.length],
        unitPrice: Math.floor(Math.random() * 1000) + 10,
      });
    }

    const createdProducts = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdProducts.count} products`);

    // Get all warehouses and zones for inventory
    const allWarehouses = await prisma.warehouse.findMany();
    const allZones = await prisma.zone.findMany();
    const allLocations = await prisma.location.findMany();
    const allProducts = await prisma.product.findMany();

    // Add zones for new warehouses
    console.log('🏗️ Adding zones for new warehouses...');
    const zones = [];
    for (const wh of allWarehouses) {
      if (wh.id !== warehouse.id) { // Skip existing warehouse
        for (let i = 0; i < 3; i++) {
          zones.push({
            name: `Zone ${String.fromCharCode(65 + i)}`,
            description: `Storage zone ${i + 1}`,
            warehouseId: wh.id,
          });
        }
      }
    }

    const createdZones = await prisma.zone.createMany({
      data: zones,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdZones.count} zones`);

    // Add locations for new zones
    console.log('📍 Adding locations...');
    const allZonesUpdated = await prisma.zone.findMany();
    const locations = [];
    
    for (const zone of allZonesUpdated) {
      for (let i = 0; i < 10; i++) {
        const aisle = String.fromCharCode(65 + (i % 10));
        const shelf = String(i % 10 + 1).padStart(2, '0');
        const bin = String(i % 5 + 1).padStart(2, '0');
        
        locations.push({
          name: `${aisle}${shelf}-${bin}`,
          barcode: `${aisle}${shelf}${bin}-${Date.now()}-${i}`,
          aisle,
          shelf,
          bin,
          zoneId: zone.id,
          locationType: 'SHELF',
          isActive: true,
        });
      }
    }

    const createdLocations = await prisma.location.createMany({
      data: locations,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdLocations.count} locations`);

    // Add inventory for products
    console.log('📊 Adding inventory...');
    const allLocationsUpdated = await prisma.location.findMany({
      include: { zone: true }
    });
    const inventory = [];

    for (const product of allProducts) {
      const locationCount = Math.floor(Math.random() * 3) + 1; // 1-3 locations per product
      const selectedLocations = allLocationsUpdated
        .sort(() => 0.5 - Math.random())
        .slice(0, locationCount);
      
      for (const location of selectedLocations) {
        const quantity = Math.floor(Math.random() * 500);
        const reservedQty = Math.floor(Math.random() * Math.min(quantity, 50));
        const availableQty = quantity - reservedQty;
        
        inventory.push({
          productId: product.id,
          warehouseId: location.zone.warehouseId,
          locationId: location.id,
          quantity,
          availableQty,
          reservedQty,
          minStock: Math.floor(Math.random() * 20) + 5,
          maxStock: Math.floor(Math.random() * 1000) + 100,
          createdById: admin.id,
        });
      }
    }

    const createdInventory = await prisma.inventory.createMany({
      data: inventory,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdInventory.count} inventory items`);

    // Add 200 more orders
    console.log('📋 Adding 200 more orders...');
    const allUsers = await prisma.user.findMany();
    const orders = [];

    for (let i = 0; i < 200; i++) {
      const orderDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const customerName = `Customer ${i + 1}`;
      const totalValue = Math.floor(Math.random() * 2000) + 50;
      const itemCount = Math.floor(Math.random() * 5) + 1;
      
      orders.push({
        orderNumber: `ORD-${Date.now()}-${i}`,
        status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'][Math.floor(Math.random() * 5)],
        priority: ['LOW', 'NORMAL', 'HIGH', 'URGENT'][Math.floor(Math.random() * 4)],
        orderType: ['INBOUND', 'OUTBOUND'][Math.floor(Math.random() * 2)],
        customerName,
        customerEmail: `customer${i + 1}@example.com`,
        totalValue,
        totalItems: itemCount,
        shippingAddress: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
        notes: `Order notes for order ${i + 1}`,
        createdById: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        assignedToId: allUsers[Math.floor(Math.random() * allUsers.length)].id,
        warehouseId: allWarehouses[Math.floor(Math.random() * allWarehouses.length)].id,
        completedAt: Math.random() > 0.7 ? new Date() : null,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    const createdOrders = await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdOrders.count} orders`);

    // Get final counts
    const finalCounts = {
      totalUsers: await prisma.user.count(),
      totalWarehouses: await prisma.warehouse.count(),
      totalZones: await prisma.zone.count(),
      totalLocations: await prisma.location.count(),
      totalProducts: await prisma.product.count(),
      totalInventory: await prisma.inventory.count(),
      totalOrders: await prisma.order.count(),
    };

    console.log('\n🎉 Pagination test data added successfully!');
    console.log('📊 Final counts:');
    Object.entries(finalCounts).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

  } catch (error) {
    console.error('❌ Error adding pagination data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPaginationData();
