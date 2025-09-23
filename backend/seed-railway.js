// Simple seed script for Railway deployment
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if data already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@wms.com' }
    });

    if (existingUser) {
      console.log('✅ Admin user already exists:', existingUser.email);
      console.log('🎉 Database already seeded!');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@wms.com',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        name: 'Main Warehouse',
        address: '123 Warehouse St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'US',
        isActive: true,
      },
    });

    console.log('✅ Warehouse created:', warehouse.name);

    // Create zone
    const zone = await prisma.zone.create({
      data: {
        name: 'Zone A',
        description: 'Main storage zone',
        warehouseId: warehouse.id,
      },
    });

    console.log('✅ Zone created:', zone.name);

    // Create location
    const location = await prisma.location.create({
      data: {
        name: 'A1-01',
        barcode: 'A1-01-BARCODE',
        aisle: 'A1',
        shelf: '01',
        bin: '01',
        zoneId: zone.id,
        locationType: 'SHELF',
        isActive: true,
      },
    });

    console.log('✅ Location created:', location.name);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: 'Sample Product',
        sku: 'PROD-001',
        description: 'A sample product for testing',
        category: 'Electronics',
        unitPrice: 99.99,
      },
    });

    console.log('✅ Product created:', product.name);

    // Create inventory
    const inventory = await prisma.inventory.create({
      data: {
        productId: product.id,
        warehouseId: warehouse.id,
        locationId: location.id,
        quantity: 100,
        availableQty: 95,
        reservedQty: 5,
        minStock: 10,
        maxStock: 500,
        createdById: admin.id,
      },
    });

    console.log('✅ Inventory created:', inventory.quantity, 'units');

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        status: 'PENDING',
        priority: 'NORMAL',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        totalValue: 99.99,
        totalItems: 1,
        createdById: admin.id,
        warehouseId: warehouse.id,
      },
    });

    console.log('✅ Order created:', order.orderNumber);

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        unitPrice: 99.99,
        totalPrice: 99.99,
      },
    });

    console.log('✅ Order item created:', orderItem.id);

    console.log('🎉 Database seeded successfully!');
    console.log('📧 Admin login: admin@wms.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
