import { PrismaClient, UserRole, OrderStatus, Priority, OrderType, LocationType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function addMoreTestData() {
  try {
    console.log('🌱 Adding more test data for pagination testing...');

    // Get existing data
    const existingWarehouse = await prisma.warehouse.findFirst();
    const existingZone = await prisma.zone.findFirst();
    const existingLocation = await prisma.location.findFirst();
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    if (!existingWarehouse || !existingZone || !existingLocation || !existingAdmin) {
      console.log('❌ Missing required data. Please run the seed script first.');
      return;
    }

    // Add 50 more users
    console.log('👥 Adding 50 more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const username = faker.internet.username({ firstName, lastName });
      const role = faker.helpers.arrayElement(['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN']) as UserRole;
      const hashedPassword = await bcrypt.hash('password123', 10);

      users.push({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role,
        isActive: faker.datatype.boolean(0.9), // 90% active
      });
    }

    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdUsers.count} users`);

    // Add 5 more warehouses
    console.log('🏢 Adding 5 more warehouses...');
    const warehouses = [];
    for (let i = 0; i < 5; i++) {
      warehouses.push({
        name: faker.company.name() + ' Warehouse',
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'US',
        isActive: true,
      });
    }

    const createdWarehouses = await prisma.warehouse.createMany({
      data: warehouses,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdWarehouses.count} warehouses`);

    // Get all warehouses for zones and locations
    const allWarehouses = await prisma.warehouse.findMany();

    // Add zones for each warehouse
    console.log('🏗️ Adding zones...');
    const zones = [];
    for (const warehouse of allWarehouses) {
      const zoneCount = faker.number.int({ min: 2, max: 5 });
      for (let i = 0; i < zoneCount; i++) {
        zones.push({
          name: `Zone ${String.fromCharCode(65 + i)}`,
          description: faker.commerce.department() + ' storage zone',
          warehouseId: warehouse.id,
        });
      }
    }

    const createdZones = await prisma.zone.createMany({
      data: zones,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdZones.count} zones`);

    // Add locations for each zone
    console.log('📍 Adding locations...');
    const allZones = await prisma.zone.findMany();
    const locations = [];
    
    for (const zone of allZones) {
      const locationCount = faker.number.int({ min: 10, max: 20 });
      for (let i = 0; i < locationCount; i++) {
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
          locationType: faker.helpers.arrayElement(['SHELF', 'BIN', 'PALLET']) as LocationType,
          isActive: true,
        });
      }
    }

    const createdLocations = await prisma.location.createMany({
      data: locations,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdLocations.count} locations`);

    // Add 100 more products
    console.log('📦 Adding 100 more products...');
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: `SKU-${Date.now()}-${i}`,
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        unitPrice: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      });
    }

    const createdProducts = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdProducts.count} products`);

    // Add inventory for products
    console.log('📊 Adding inventory...');
    const allProducts = await prisma.product.findMany();
    const allLocations = await prisma.location.findMany();
    const inventory = [];

    for (const product of allProducts) {
      const inventoryCount = faker.number.int({ min: 1, max: 3 }); // 1-3 locations per product
      const selectedLocations = faker.helpers.arrayElements(allLocations, inventoryCount);
      
      for (const location of selectedLocations) {
        const quantity = faker.number.int({ min: 0, max: 500 });
        const reservedQty = faker.number.int({ min: 0, max: Math.min(quantity, 50) });
        const availableQty = quantity - reservedQty;
        
        inventory.push({
          productId: product.id,
          warehouseId: location.zone.warehouseId,
          locationId: location.id,
          quantity,
          availableQty,
          reservedQty,
          minStock: faker.number.int({ min: 5, max: 20 }),
          maxStock: faker.number.int({ min: 100, max: 1000 }),
          createdById: existingAdmin.id,
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
      const orderDate = faker.date.between({ from: new Date('2024-01-01'), to: new Date() });
      const customerName = faker.person.fullName();
      const totalValue = parseFloat(faker.commerce.price({ min: 50, max: 2000 }));
      const itemCount = faker.number.int({ min: 1, max: 5 });
      
      orders.push({
        orderNumber: `ORD-${Date.now()}-${i}`,
        status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']) as OrderStatus,
        priority: faker.helpers.arrayElement(['LOW', 'NORMAL', 'HIGH', 'URGENT']) as Priority,
        orderType: faker.helpers.arrayElement(['INBOUND', 'OUTBOUND']) as OrderType,
        customerName,
        customerEmail: faker.internet.email({ firstName: customerName.split(' ')[0] }),
        totalValue,
        totalItems: itemCount,
        shippingAddress: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.state(),
        notes: faker.lorem.sentence(),
        createdById: faker.helpers.arrayElement(allUsers).id,
        assignedToId: faker.helpers.arrayElement(allUsers).id,
        warehouseId: faker.helpers.arrayElement(allWarehouses).id,
        completedAt: faker.datatype.boolean(0.3) ? faker.date.between({ from: orderDate, to: new Date() }) : null,
        createdAt: orderDate,
        updatedAt: orderDate,
      });
    }

    const createdOrders = await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdOrders.count} orders`);

    // Add order items for orders
    console.log('🛒 Adding order items...');
    const allOrders = await prisma.order.findMany();
    const orderItems = [];

    for (const order of allOrders) {
      const itemCount = faker.number.int({ min: 1, max: 5 });
      const selectedProducts = faker.helpers.arrayElements(allProducts, itemCount);
      
      for (const product of selectedProducts) {
        const quantity = faker.number.int({ min: 1, max: 10 });
        const unitPrice = product.unitPrice || parseFloat(faker.commerce.price({ min: 10, max: 100 }));
        const totalPrice = quantity * unitPrice;
        
        orderItems.push({
          orderId: order.id,
          productId: product.id,
          quantity,
          pickedQty: faker.number.int({ min: 0, max: quantity }),
          unitPrice,
          totalPrice,
          notes: faker.lorem.sentence(),
        });
      }
    }

    const createdOrderItems = await prisma.orderItem.createMany({
      data: orderItems,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdOrderItems.count} order items`);

    // Add activity logs
    console.log('📝 Adding activity logs...');
    const activityLogs = [];
    
    for (let i = 0; i < 500; i++) {
      const user = faker.helpers.arrayElement(allUsers);
      const action = faker.helpers.arrayElement(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']);
      const entity = faker.helpers.arrayElement(['USER', 'PRODUCT', 'INVENTORY', 'ORDER', 'WAREHOUSE']);
      
      activityLogs.push({
        userId: user.id,
        action,
        entity,
        entityId: faker.string.uuid(),
        description: `${action} ${entity}: ${faker.lorem.sentence()}`,
        oldValues: faker.datatype.boolean(0.3) ? { field: faker.lorem.word(), value: faker.lorem.word() } : null,
        newValues: faker.datatype.boolean(0.7) ? { field: faker.lorem.word(), value: faker.lorem.word() } : null,
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
      });
    }

    const createdActivityLogs = await prisma.activityLog.createMany({
      data: activityLogs,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdActivityLogs.count} activity logs`);

    // Get final counts
    const finalCounts = {
      totalUsers: await prisma.user.count(),
      totalWarehouses: await prisma.warehouse.count(),
      totalZones: await prisma.zone.count(),
      totalLocations: await prisma.location.count(),
      totalProducts: await prisma.product.count(),
      totalInventory: await prisma.inventory.count(),
      totalOrders: await prisma.order.count(),
      totalOrderItems: await prisma.orderItem.count(),
      totalActivityLogs: await prisma.activityLog.count(),
    };

    console.log('\n🎉 Test data added successfully!');
    console.log('📊 Final counts:');
    Object.entries(finalCounts).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreTestData();
