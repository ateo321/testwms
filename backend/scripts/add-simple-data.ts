import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple data generators
const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma', 'Alex', 'Maria', 'Tom', 'Anna', 'Steve', 'Kate', 'Paul', 'Sue', 'Mark', 'Amy', 'Ben', 'Jen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const companies = ['Acme Corp', 'Tech Solutions', 'Global Logistics', 'Retail Chain', 'Manufacturing Co', 'E-commerce Store', 'Wholesale Distributors', 'Local Shop', 'Enterprise Systems', 'Supply Chain Inc'];
const productNames = ['Wireless Mouse', 'Smartphone Case', 'Programming Book', 'Coffee Maker', 'Ergonomic Chair', 'External Hard Drive', 'Bluetooth Speaker', 'Desk Lamp', 'Notebook Set', 'Gaming Headset', 'Mechanical Keyboard', 'USB Cable', 'Power Bank', 'Screen Protector', 'Laptop Stand', 'Webcam', 'Microphone', 'Tablet Case', 'Smart Watch', 'Fitness Tracker'];
const categories = ['Electronics', 'Books', 'Home & Garden', 'Office Supplies', 'Health & Beauty', 'Sports', 'Clothing', 'Automotive', 'Tools', 'Toys'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

async function addMoreData() {
  try {
    console.log('🚀 Adding more test data for paging...\n');

    // 1. Add more users (50 additional users)
    console.log('👥 Adding more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const user = await prisma.user.create({
        data: {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}${Date.now()}@company.com`,
          username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i}${Date.now()}`,
          firstName,
          lastName,
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeXWXz9XGzQrY8Jq2', // "password123"
          role: getRandomElement(['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN']),
          isActive: Math.random() > 0.1, // 90% active
        }
      });
      users.push(user);
    }
    console.log(`✅ Added ${users.length} users`);

    // 2. Add more warehouses (10 additional warehouses)
    console.log('🏢 Adding more warehouses...');
    const warehouses = [];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
    
    for (let i = 0; i < 10; i++) {
      const city = getRandomElement(cities);
      const state = getRandomElement(states);
      const warehouse = await prisma.warehouse.create({
        data: {
          name: `${city} Distribution Center`,
          address: `${getRandomInt(100, 9999)} Main Street`,
          city,
          state,
          country: 'USA',
          zipCode: `${getRandomInt(10000, 99999)}`,
          isActive: true,
        }
      });
      warehouses.push(warehouse);
    }
    console.log(`✅ Added ${warehouses.length} warehouses`);

    // 3. Add more products (100 additional products)
    console.log('📦 Adding more products...');
    const products = [];
    for (let i = 0; i < 100; i++) {
      const productName = getRandomElement(productNames);
      const product = await prisma.product.create({
        data: {
          name: `${productName} ${i + 1}`,
          description: `High-quality ${productName.toLowerCase()} for professional use`,
          sku: `PROD-${String(i + 1000).padStart(4, '0')}-${Date.now()}`,
          category: getRandomElement(categories),
          unitPrice: getRandomFloat(10, 500),
          brand: getRandomElement(['BrandA', 'BrandB', 'BrandC', 'BrandD', 'BrandE']),
          weight: getRandomFloat(0.1, 50),
          dimensions: `${getRandomInt(5, 100)}x${getRandomInt(5, 100)}x${getRandomInt(5, 100)}`,
          isActive: true,
        }
      });
      products.push(product);
    }
    console.log(`✅ Added ${products.length} products`);

    // 4. Add zones and locations for new warehouses
    console.log('📍 Adding zones and locations...');
    const allWarehouses = await prisma.warehouse.findMany();
    let totalLocations = 0;
    
    for (const warehouse of allWarehouses) {
      // Add 2-4 zones per warehouse
      const zoneCount = getRandomInt(2, 4);
      for (let z = 1; z <= zoneCount; z++) {
        const zone = await prisma.zone.create({
          data: {
            name: `Zone ${String.fromCharCode(64 + z)}`,
            description: `Storage Zone ${String.fromCharCode(64 + z)}`,
            warehouseId: warehouse.id,
            isActive: true,
          }
        });

        // Add 10-30 locations per zone
        const locationCount = getRandomInt(10, 30);
        for (let l = 1; l <= locationCount; l++) {
          await prisma.location.create({
            data: {
              name: `${String.fromCharCode(64 + z)}${Math.floor((l-1)/10) + 1}-${((l-1) % 10) + 1}-${getRandomInt(1, 5)}`,
              zoneId: zone.id,
              capacity: getRandomInt(50, 500),
              isActive: true,
            }
          });
          totalLocations++;
        }
      }
    }
    console.log(`✅ Added ${totalLocations} locations across all warehouses`);

    // 5. Add more inventory items (200 additional items)
    console.log('📊 Adding more inventory items...');
    const allLocations = await prisma.location.findMany({
      include: {
        zone: true
      }
    });
    const inventoryItems = [];
    
    for (let i = 0; i < 200; i++) {
      const product = getRandomElement(products);
      const location = getRandomElement(allLocations);
      const quantity = getRandomInt(0, 1000);
      const reserved = getRandomInt(0, Math.min(quantity, 50));
      
      const availableQty = quantity - reserved;
      const inventory = await prisma.inventory.create({
        data: {
          productId: product.id,
          warehouseId: location.zone.warehouseId,
          locationId: location.id,
          quantity,
          reservedQty: reserved,
          availableQty: availableQty,
          minStock: getRandomInt(5, 50),
          maxStock: getRandomInt(500, 2000),
          lastCountAt: new Date(Date.now() - getRandomInt(0, 30) * 24 * 60 * 60 * 1000),
          createdById: getRandomElement(users).id,
        }
      });
      inventoryItems.push(inventory);
    }
    console.log(`✅ Added ${inventoryItems.length} inventory items`);

    // 6. Add more orders (100 additional orders)
    console.log('📋 Adding more orders...');
    const orders = [];
    const statuses = ['PENDING', 'PROCESSING', 'PICKING', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
    
    for (let i = 0; i < 100; i++) {
      const orderNumber = `WMS-${Date.now()}-${String(i).padStart(4, '0')}`;
      const totalValue = getRandomFloat(50, 5000);
      const totalItems = getRandomInt(1, 20);
      
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName: getRandomElement(companies),
          customerEmail: `${getRandomElement(companies).toLowerCase().replace(/\s+/g, '')}@email.com`,
          status: getRandomElement(statuses),
          priority: getRandomElement(priorities),
          totalItems,
          totalValue,
          shippingAddress: `${getRandomInt(100, 9999)} ${getRandomElement(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'First Ave'])}`,
          createdById: getRandomElement(users).id,
          assignedToId: getRandomElement(users).id,
          warehouseId: getRandomElement(allWarehouses).id,
        }
      });

      // Add order items
      for (let j = 0; j < totalItems; j++) {
        const product = getRandomElement(products);
        const quantity = getRandomInt(1, 10);
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity,
            pickedQty: getRandomInt(0, quantity),
            unitPrice: product.unitPrice,
            totalPrice: (product.unitPrice || 0) * quantity,
          }
        });
      }
      
      orders.push(order);
    }
    console.log(`✅ Added ${orders.length} orders with items`);

    // 7. Add activity logs
    console.log('📝 Adding activity logs...');
    const activities = [];
    const actions = ['INVENTORY_UPDATE', 'ORDER_CREATED', 'ORDER_SHIPPED', 'USER_LOGIN', 'PRODUCT_ADDED', 'WAREHOUSE_UPDATED', 'LOCATION_MOVED', 'STOCK_COUNTED'];
    const entityTypes = ['INVENTORY', 'ORDER', 'PRODUCT', 'USER', 'WAREHOUSE'];
    
    for (let i = 0; i < 300; i++) {
      const user = getRandomElement(users);
      const activity = await prisma.activityLog.create({
        data: {
          userId: user.id,
          warehouseId: getRandomElement(allWarehouses).id,
          action: getRandomElement(actions),
          entity: getRandomElement(entityTypes),
          entityId: `entity-${getRandomInt(1000, 9999)}`,
          oldValues: JSON.stringify({ previous: 'old value' }),
          newValues: JSON.stringify({ current: 'new value' }),
          ipAddress: `192.168.1.${getRandomInt(1, 254)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
