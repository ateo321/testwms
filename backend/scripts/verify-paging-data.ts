import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPagingData() {
  try {
    console.log('🔍 Verifying paging data...\n');

    // Check Users with pagination
    console.log('👥 Users (first 10):');
    const users = await prisma.user.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      }
    });
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.role}) - ${user.email}`);
    });

    console.log(`\n📊 Total Users: ${await prisma.user.count()}`);

    // Check Orders with pagination
    console.log('\n📋 Orders (first 10):');
    const orders = await prisma.order.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        status: true,
        priority: true,
        totalItems: true,
        totalValue: true,
      }
    });
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderNumber} - ${order.customerName} (${order.status}) - $${order.totalValue.toFixed(2)}`);
    });

    console.log(`\n📊 Total Orders: ${await prisma.order.count()}`);

    // Check Products with pagination
    console.log('\n📦 Products (first 10):');
    const products = await prisma.product.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        unitPrice: true,
      }
    });
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.sku}) - $${product.unitPrice?.toFixed(2) || '0.00'}`);
    });

    console.log(`\n📊 Total Products: ${await prisma.product.count()}`);

    // Check Inventory with pagination
    console.log('\n📊 Inventory Items (first 10):');
    const inventory = await prisma.inventory.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          }
        },
        location: {
          select: {
            name: true,
          }
        }
      }
    });
    
    inventory.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product.name} - Qty: ${item.quantity}, Available: ${item.availableQty}, Location: ${item.location.name}`);
    });

    console.log(`\n📊 Total Inventory Items: ${await prisma.inventory.count()}`);

    // Check Warehouses
    console.log('\n🏢 Warehouses:');
    const warehouses = await prisma.warehouse.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        _count: {
          select: {
            zones: true,
            orders: true,
            inventory: true,
          }
        }
      }
    });
    
    warehouses.forEach((warehouse, index) => {
      console.log(`${index + 1}. ${warehouse.name} (${warehouse.city}, ${warehouse.state}) - ${warehouse._count.zones} zones, ${warehouse._count.orders} orders, ${warehouse._count.inventory} inventory items`);
    });

    console.log(`\n📊 Total Warehouses: ${await prisma.warehouse.count()}`);

    console.log('\n✅ Paging data verification complete!');
    console.log('🎯 You now have sufficient data to test paging functionality:');
    console.log(`   - ${await prisma.user.count()} users (enough for multiple pages)`);
    console.log(`   - ${await prisma.order.count()} orders (enough for multiple pages)`);
    console.log(`   - ${await prisma.product.count()} products (enough for multiple pages)`);
    console.log(`   - ${await prisma.inventory.count()} inventory items (enough for multiple pages)`);
    console.log(`   - ${await prisma.warehouse.count()} warehouses`);

  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPagingData();
