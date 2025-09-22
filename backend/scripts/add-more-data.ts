import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Product categories for more variety
const productCategories = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 
  'Books', 'Health & Beauty', 'Automotive', 'Tools & Hardware',
  'Toys & Games', 'Office Supplies', 'Food & Beverage', 'Pet Supplies'
];

// Warehouse locations
const warehouseLocations = [
  'North Distribution Center', 'South Logistics Hub', 'East Coast Warehouse',
  'West Coast Facility', 'Central Distribution', 'International Hub',
  'Regional Storage', 'Express Fulfillment Center', 'Cold Storage Facility',
  'Premium Goods Warehouse'
];

async function addMoreData() {
  try {
    console.log('🚀 Adding more test data for paging...\n');

    // 1. Add more users (20 additional users)
    console.log('👥 Adding more users...');
    const users = [];
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          firstName,
          lastName,
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeXWXz9XGzQrY8Jq2', // "password123"
          role: faker.helpers.arrayElement(['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN']),
          isActive: faker.datatype.boolean(0.9), // 90% active
        }
      });
      users.push(user);
    }
    console.log(`✅ Added ${users.length} users`);

    // 2. Add more warehouses (7 additional warehouses)
    console.log('🏢 Adding more warehouses...');
    const warehouses = [];
    for (let i = 0; i < 7; i++) {
      const warehouse = await prisma.warehouse.create({
        data: {
          name: faker.helpers.arrayElement(warehouseLocations),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
          postalCode: faker.location.zipCode(),
          isActive: true,
        }
      });
      warehouses.push(warehouse);
    }
    console.log(`✅ Added ${warehouses.length} warehouses`);

    // 3. Add more products (80 additional products)
    console.log('📦 Adding more products...');
    const products = [];
    for (let i = 0; i < 80; i++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          sku: `PROD-${faker.string.alphanumeric(8).toUpperCase()}`,
          category: faker.helpers.arrayElement(productCategories),
          unitPrice: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          unit: faker.helpers.arrayElement(['piece', 'kg', 'lb', 'box', 'set', 'pair', 'dozen']),
          weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
          dimensions: `${faker.number.int({ min: 5, max: 100 })}x${faker.number.int({ min: 5, max: 100 })}x${faker.number.int({ min: 5, max: 100 })}`,
          isActive: true,
        }
      });
      products.push(product);
    }
    console.log(`✅ Added ${products.length} products`);

    // 4. Add more zones and locations for each warehouse
    console.log('📍 Adding zones and locations...');
    const allWarehouses = await prisma.warehouse.findMany();
    let totalLocations = 0;
    
    for (const warehouse of allWarehouses) {
      // Add 3-5 zones per warehouse
      const zoneCount = faker.number.int({ min: 3, max: 5 });
      for (let z = 1; z <= zoneCount; z++) {
        const zone = await prisma.zone.create({
          data: {
            name: `Zone ${String.fromCharCode(64 + z)}`, // A, B, C, D, E
            description: `${faker.helpers.arrayElement(['Storage', 'Picking', 'Packaging', 'Receiving', 'Shipping'])} Zone ${String.fromCharCode(64 + z)}`,
            warehouseId: warehouse.id,
            isActive: true,
          }
        });

        // Add 20-50 locations per zone
        const locationCount = faker.number.int({ min: 20, max: 50 });
        for (let l = 1; l <= locationCount; l++) {
          await prisma.location.create({
            data: {
              name: `${String.fromCharCode(64 + z)}${Math.floor((l-1)/10) + 1}-${((l-1) % 10) + 1}-${faker.number.int({ min: 1, max: 5 })}`,
              zoneId: zone.id,
              maxCapacity: faker.number.int({ min: 50, max: 500 }),
              isActive: true,
            }
          });
          totalLocations++;
        }
      }
    }
    console.log(`✅ Added ${totalLocations} locations across all warehouses`);

    // 5. Add more inventory items (150 additional items)
    console.log('📊 Adding more inventory items...');
    const allLocations = await prisma.location.findMany();
    const inventoryItems = [];
    
    for (let i = 0; i < 150; i++) {
      const product = faker.helpers.arrayElement(products);
      const location = faker.helpers.arrayElement(allLocations);
      const quantity = faker.number.int({ min: 0, max: 1000 });
      const reserved = faker.number.int({ min: 0, max: Math.min(quantity, 50) });
      
      const inventory = await prisma.inventory.create({
        data: {
          productId: product.id,
          locationId: location.id,
          quantity,
          reserved,
          lastCountedAt: faker.date.recent({ days: 30 }),
          isActive: true,
        }
      });
      inventoryItems.push(inventory);
    }
    console.log(`✅ Added ${inventoryItems.length} inventory items`);

    // 6. Add more orders (75 additional orders)
    console.log('📋 Adding more orders...');
    const orders = [];
    for (let i = 0; i < 75; i++) {
      const orderNumber = `WMS-${Date.now()}-${String(i).padStart(4, '0')}`;
      const totalValue = parseFloat(faker.commerce.price({ min: 50, max: 5000 }));
      const totalItems = faker.number.int({ min: 1, max: 20 });
      
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName: faker.company.name(),
          status: faker.helpers.arrayElement(['PENDING', 'PROCESSING', 'PICKING', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
          priority: faker.helpers.arrayElement(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
          totalItems,
          totalValue,
          shippingAddress: faker.location.streetAddress(),
          assignedToId: faker.helpers.arrayElement(users).id,
          warehouseId: faker.helpers.arrayElement(allWarehouses).id,
        }
      });

      // Add order items
      for (let j = 0; j < totalItems; j++) {
        const product = faker.helpers.arrayElement(products);
        const quantity = faker.number.int({ min: 1, max: 10 });
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity,
            unitPrice: product.unitPrice,
          }
        });
      }
      
      orders.push(order);
    }
    console.log(`✅ Added ${orders.length} orders with items`);

    // 7. Add activity logs
    console.log('📝 Adding activity logs...');
    const activities = [];
    for (let i = 0; i < 200; i++) {
      const user = faker.helpers.arrayElement(users);
      const activity = await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: faker.helpers.arrayElement([
            'INVENTORY_UPDATE', 'ORDER_CREATED', 'ORDER_SHIPPED', 'USER_LOGIN',
            'PRODUCT_ADDED', 'WAREHOUSE_UPDATED', 'LOCATION_MOVED', 'STOCK_COUNTED'
          ]),
          entityType: faker.helpers.arrayElement(['INVENTORY', 'ORDER', 'PRODUCT', 'USER', 'WAREHOUSE']),
          entityId: faker.string.uuid(),
          details: faker.lorem.sentence(),
          timestamp: faker.date.recent({ days: 90 }),
        }
      });
      activities.push(activity);
    }
    console.log(`✅ Added ${activities.length} activity logs`);

    console.log('\n🎉 Successfully added more test data!');
    console.log('📊 Summary:');
    console.log(`👥 Users: +${users.length}`);
    console.log(`🏢 Warehouses: +${warehouses.length}`);
    console.log(`📦 Products: +${products.length}`);
    console.log(`📍 Locations: +${totalLocations}`);
    console.log(`📊 Inventory Items: +${inventoryItems.length}`);
    console.log(`📋 Orders: +${orders.length}`);
    console.log(`📝 Activity Logs: +${activities.length}`);

  } catch (error) {
    console.error('❌ Error adding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreData();
