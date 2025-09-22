import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.location.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.warehouseUser.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@wms.com',
      username: 'admin',
      firstName: 'John',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@wms.com',
      username: 'manager',
      firstName: 'Sarah',
      lastName: 'Manager',
      password: hashedPassword,
      role: 'MANAGER',
      isActive: true,
    },
  });

  const supervisorUser = await prisma.user.create({
    data: {
      email: 'supervisor@wms.com',
      username: 'supervisor',
      firstName: 'Mike',
      lastName: 'Supervisor',
      password: hashedPassword,
      role: 'SUPERVISOR',
      isActive: true,
    },
  });

  const employeeUser = await prisma.user.create({
    data: {
      email: 'employee@wms.com',
      username: 'employee',
      firstName: 'Lisa',
      lastName: 'Employee',
      password: hashedPassword,
      role: 'EMPLOYEE',
      isActive: true,
    },
  });

  // Create Warehouses
  console.log('🏢 Creating warehouses...');
  const mainWarehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Distribution Center',
      address: '123 Industrial Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'US',
      isActive: true,
    },
  });

  const eastWarehouse = await prisma.warehouse.create({
    data: {
      name: 'East Coast Warehouse',
      address: '456 Commerce Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isActive: true,
    },
  });

  const southWarehouse = await prisma.warehouse.create({
    data: {
      name: 'South Regional Hub',
      address: '789 Logistics Dr',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'US',
      isActive: true,
    },
  });

  // Create Warehouse User Assignments
  console.log('🔗 Creating warehouse user assignments...');
  await prisma.warehouseUser.createMany({
    data: [
      { userId: adminUser.id, warehouseId: mainWarehouse.id, role: 'ADMIN' },
      { userId: managerUser.id, warehouseId: mainWarehouse.id, role: 'MANAGER' },
      { userId: managerUser.id, warehouseId: eastWarehouse.id, role: 'MANAGER' },
      { userId: supervisorUser.id, warehouseId: mainWarehouse.id, role: 'SUPERVISOR' },
      { userId: employeeUser.id, warehouseId: mainWarehouse.id, role: 'PICKER' },
      { userId: employeeUser.id, warehouseId: eastWarehouse.id, role: 'PICKER' },
    ],
  });

  // Create Zones
  console.log('🏗️ Creating zones...');
  const receivingZone = await prisma.zone.create({
    data: {
      name: 'Receiving Dock',
      description: 'Incoming shipment processing area',
      warehouseId: mainWarehouse.id,
      zoneType: 'RECEIVING',
      isActive: true,
    },
  });

  const storageZoneA = await prisma.zone.create({
    data: {
      name: 'Storage Zone A',
      description: 'High-velocity items storage',
      warehouseId: mainWarehouse.id,
      zoneType: 'STORAGE',
      isActive: true,
    },
  });

  const storageZoneB = await prisma.zone.create({
    data: {
      name: 'Storage Zone B',
      description: 'Medium-velocity items storage',
      warehouseId: mainWarehouse.id,
      zoneType: 'STORAGE',
      isActive: true,
    },
  });

  const pickingZone = await prisma.zone.create({
    data: {
      name: 'Picking Zone',
      description: 'Order fulfillment area',
      warehouseId: mainWarehouse.id,
      zoneType: 'PICKING',
      isActive: true,
    },
  });

  const packingZone = await prisma.zone.create({
    data: {
      name: 'Packing Station',
      description: 'Order packing and preparation',
      warehouseId: mainWarehouse.id,
      zoneType: 'PACKING',
      isActive: true,
    },
  });

  const shippingZone = await prisma.zone.create({
    data: {
      name: 'Shipping Dock',
      description: 'Outbound shipment staging',
      warehouseId: mainWarehouse.id,
      zoneType: 'SHIPPING',
      isActive: true,
    },
  });

  // Create Locations
  console.log('📍 Creating locations...');
  const locations = [];

  // Storage Zone A locations
  for (let aisle = 1; aisle <= 5; aisle++) {
    for (let shelf = 1; shelf <= 10; shelf++) {
      for (let bin = 1; bin <= 4; bin++) {
        const location = await prisma.location.create({
          data: {
            name: `A${aisle}-${shelf}-${bin}`,
            barcode: `LOC-A${aisle}${shelf}${bin}`,
            zoneId: storageZoneA.id,
            aisle: `A${aisle}`,
            shelf: shelf.toString(),
            bin: bin.toString(),
            capacity: 100,
            locationType: 'SHELF',
            isActive: true,
          },
        });
        locations.push(location);
      }
    }
  }

  // Storage Zone B locations
  for (let aisle = 1; aisle <= 3; aisle++) {
    for (let shelf = 1; shelf <= 8; shelf++) {
      for (let bin = 1; bin <= 3; bin++) {
        const location = await prisma.location.create({
          data: {
            name: `B${aisle}-${shelf}-${bin}`,
            barcode: `LOC-B${aisle}${shelf}${bin}`,
            zoneId: storageZoneB.id,
            aisle: `B${aisle}`,
            shelf: shelf.toString(),
            bin: bin.toString(),
            capacity: 150,
            locationType: 'SHELF',
            isActive: true,
          },
        });
        locations.push(location);
      }
    }
  }

  // Create Products
  console.log('📦 Creating products...');
  const products = [];

  const productData = [
    { sku: 'ELEC-001', name: 'Wireless Bluetooth Headphones', category: 'Electronics', brand: 'TechSound', weight: 0.5, unitPrice: 79.99 },
    { sku: 'ELEC-002', name: 'Smartphone Case', category: 'Electronics', brand: 'ProtectPro', weight: 0.1, unitPrice: 24.99 },
    { sku: 'ELEC-003', name: 'USB-C Cable', category: 'Electronics', brand: 'ConnectMax', weight: 0.2, unitPrice: 12.99 },
    { sku: 'ELEC-004', name: 'Wireless Charger', category: 'Electronics', brand: 'PowerUp', weight: 0.3, unitPrice: 39.99 },
    { sku: 'ELEC-005', name: 'Bluetooth Speaker', category: 'Electronics', brand: 'SoundWave', weight: 0.8, unitPrice: 89.99 },
    
    { sku: 'CLTH-001', name: 'Cotton T-Shirt', category: 'Clothing', brand: 'ComfortWear', weight: 0.2, unitPrice: 19.99 },
    { sku: 'CLTH-002', name: 'Denim Jeans', category: 'Clothing', brand: 'DenimPro', weight: 0.6, unitPrice: 59.99 },
    { sku: 'CLTH-003', name: 'Running Shoes', category: 'Clothing', brand: 'SportMax', weight: 0.9, unitPrice: 129.99 },
    { sku: 'CLTH-004', name: 'Winter Jacket', category: 'Clothing', brand: 'WarmTech', weight: 1.2, unitPrice: 199.99 },
    { sku: 'CLTH-005', name: 'Baseball Cap', category: 'Clothing', brand: 'CapStyle', weight: 0.1, unitPrice: 24.99 },
    
    { sku: 'HOME-001', name: 'Coffee Maker', category: 'Home & Garden', brand: 'BrewMaster', weight: 3.5, unitPrice: 149.99 },
    { sku: 'HOME-002', name: 'Kitchen Knife Set', category: 'Home & Garden', brand: 'SharpEdge', weight: 2.1, unitPrice: 89.99 },
    { sku: 'HOME-003', name: 'Decorative Vase', category: 'Home & Garden', brand: 'ArtDecor', weight: 1.8, unitPrice: 34.99 },
    { sku: 'HOME-004', name: 'LED Desk Lamp', category: 'Home & Garden', brand: 'BrightLight', weight: 1.0, unitPrice: 49.99 },
    { sku: 'HOME-005', name: 'Throw Pillow', category: 'Home & Garden', brand: 'CozyHome', weight: 0.4, unitPrice: 29.99 },
    
    { sku: 'BOOK-001', name: 'Programming Handbook', category: 'Books', brand: 'TechPublish', weight: 0.8, unitPrice: 45.99 },
    { sku: 'BOOK-002', name: 'Business Strategy Guide', category: 'Books', brand: 'BizPress', weight: 0.6, unitPrice: 32.99 },
    { sku: 'BOOK-003', name: 'Cooking Recipes Collection', category: 'Books', brand: 'CulinaryArts', weight: 1.1, unitPrice: 28.99 },
    { sku: 'BOOK-004', name: 'Travel Photography', category: 'Books', brand: 'PhotoWorld', weight: 0.9, unitPrice: 39.99 },
    { sku: 'BOOK-005', name: 'Fitness Training Manual', category: 'Books', brand: 'FitLife', weight: 0.7, unitPrice: 24.99 },
  ];

  for (const productInfo of productData) {
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        description: `High-quality ${productInfo.name.toLowerCase()} from ${productInfo.brand}`,
        dimensions: '{"length": 10, "width": 8, "height": 5}',
        isActive: true,
      },
    });
    products.push(product);
  }

  // Create Inventory
  console.log('📊 Creating inventory...');
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const location = locations[i % locations.length];
    
    const quantity = Math.floor(Math.random() * 500) + 50; // 50-550 items
    const reserved = Math.floor(Math.random() * 20); // 0-20 reserved
    
    await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: mainWarehouse.id,
        locationId: location.id,
        quantity,
        reservedQty: reserved,
        availableQty: quantity - reserved,
        minStock: 25,
        maxStock: 1000,
        createdById: adminUser.id,
      },
    });
  }

  // Create some low stock items
  for (let i = 0; i < 5; i++) {
    const product = products[i + 15];
    const location = locations[i + 50];
    
    await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: eastWarehouse.id,
        locationId: location.id,
        quantity: Math.floor(Math.random() * 15) + 5, // 5-20 items (low stock)
        reservedQty: 0,
        availableQty: Math.floor(Math.random() * 15) + 5,
        minStock: 25,
        maxStock: 500,
        createdById: managerUser.id,
      },
    });
  }

  // Create Orders
  console.log('📋 Creating orders...');
  const orderStatuses = ['PENDING', 'PROCESSING', 'PICKING', 'PICKED', 'PACKING', 'PACKED', 'SHIPPED', 'DELIVERED'];
  const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
  const customers = [
    { name: 'Acme Corporation', email: 'orders@acme.com' },
    { name: 'TechStart Inc', email: 'purchasing@techstart.com' },
    { name: 'Global Retail Co', email: 'procurement@globalretail.com' },
    { name: 'SmallBiz LLC', email: 'orders@smallbiz.com' },
    { name: 'Enterprise Solutions', email: 'supply@enterprise.com' },
  ];

  for (let i = 0; i < 25; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const itemCount = Math.floor(Math.random() * 5) + 1; // 1-5 items per order
    
    const orderNumber = `WMS-${Date.now() + i}-${String(i + 1).padStart(4, '0')}`;
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        warehouseId: Math.random() > 0.7 ? eastWarehouse.id : mainWarehouse.id,
        customerName: customer.name,
        customerEmail: customer.email,
        status: status as any,
        priority: priority as any,
        orderType: 'OUTBOUND',
        totalItems: itemCount,
        totalValue: 0, // Will be calculated after items
        shippingAddress: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr'][Math.floor(Math.random() * 4)]}, ${['New York', 'Los Angeles', 'Chicago', 'Houston'][Math.floor(Math.random() * 4)]}, ${['NY', 'CA', 'IL', 'TX'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 90000) + 10000}`,
        notes: Math.random() > 0.5 ? 'Handle with care' : null,
        createdById: Math.random() > 0.5 ? managerUser.id : supervisorUser.id,
        assignedToId: Math.random() > 0.3 ? employeeUser.id : null,
        completedAt: ['DELIVERED', 'SHIPPED'].includes(status) ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      },
    });

    // Create order items
    let totalValue = 0;
    const selectedProducts = [];
    for (let j = 0; j < itemCount; j++) {
      let product;
      do {
        product = products[Math.floor(Math.random() * products.length)];
      } while (selectedProducts.includes(product.id));
      selectedProducts.push(product.id);

      const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
      const unitPrice = product.unitPrice;
      const itemTotal = quantity * unitPrice;
      totalValue += itemTotal;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity,
          pickedQty: ['PICKED', 'PACKING', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(status) ? quantity : Math.floor(Math.random() * quantity),
          unitPrice,
          totalPrice: itemTotal,
          notes: Math.random() > 0.8 ? 'Special handling required' : null,
        },
      });
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalValue, totalItems: itemCount },
    });
  }

  // Create Activity Logs
  console.log('📝 Creating activity logs...');
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'PICK', 'PACK', 'SHIP'];
  const entities = ['Product', 'Order', 'Inventory', 'User', 'Warehouse'];
  
  for (let i = 0; i < 50; i++) {
    const user = [adminUser, managerUser, supervisorUser, employeeUser][Math.floor(Math.random() * 4)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];
    
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        warehouseId: Math.random() > 0.5 ? mainWarehouse.id : eastWarehouse.id,
        action,
        entity,
        entityId: `${entity.toLowerCase()}-${i + 1}`,
        oldValues: JSON.stringify({ status: 'old_value' }),
        newValues: JSON.stringify({ status: 'new_value' }),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible; WMS/1.0)',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('\n📊 Test Data Summary:');
  console.log(`👥 Users: 4 (Admin, Manager, Supervisor, Employee)`);
  console.log(`🏢 Warehouses: 3 (Main, East Coast, South Regional)`);
  console.log(`🏗️ Zones: 6 per warehouse`);
  console.log(`📍 Locations: ${locations.length}`);
  console.log(`📦 Products: ${products.length}`);
  console.log(`📊 Inventory Records: ${products.length + 5}`);
  console.log(`📋 Orders: 25 with various statuses`);
  console.log(`📝 Activity Logs: 50`);
  console.log('\n🔐 Login Credentials:');
  console.log('Admin: admin@wms.com / password123');
  console.log('Manager: manager@wms.com / password123');
  console.log('Supervisor: supervisor@wms.com / password123');
  console.log('Employee: employee@wms.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
