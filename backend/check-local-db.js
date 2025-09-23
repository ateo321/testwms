const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLocalDatabase() {
  try {
    console.log('🔍 Checking Local Database...\n');

    // Get counts for all tables
    const counts = {
      users: await prisma.user.count(),
      warehouses: await prisma.warehouse.count(),
      zones: await prisma.zone.count(),
      locations: await prisma.location.count(),
      products: await prisma.product.count(),
      inventory: await prisma.inventory.count(),
      orders: await prisma.order.count(),
      orderItems: await prisma.orderItem.count(),
      activityLogs: await prisma.activityLog.count(),
    };

    console.log('📊 Database Counts:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count}`);
    });

    // Sample data from each table
    console.log('\n📋 Sample Data:');

    // Users
    const sampleUsers = await prisma.user.findMany({
      take: 3,
      select: { firstName: true, lastName: true, email: true, role: true, isActive: true }
    });
    console.log('\n👥 Sample Users:');
    sampleUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`);
    });

    // Warehouses
    const sampleWarehouses = await prisma.warehouse.findMany({
      take: 3,
      select: { name: true, city: true, state: true, isActive: true }
    });
    console.log('\n🏢 Sample Warehouses:');
    sampleWarehouses.forEach(warehouse => {
      console.log(`  - ${warehouse.name} (${warehouse.city}, ${warehouse.state}) - ${warehouse.isActive ? 'Active' : 'Inactive'}`);
    });

    // Products
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: { name: true, sku: true, category: true, unitPrice: true }
    });
    console.log('\n📦 Sample Products:');
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.sku}) - ${product.category} - $${product.unitPrice}`);
    });

    // Inventory
    const sampleInventory = await prisma.inventory.findMany({
      take: 3,
      include: { product: { select: { name: true } }, warehouse: { select: { name: true } } }
    });
    console.log('\n📊 Sample Inventory:');
    sampleInventory.forEach(item => {
      console.log(`  - ${item.product.name} in ${item.warehouse.name} - Qty: ${item.quantity}, Available: ${item.availableQty}`);
    });

    // Orders
    const sampleOrders = await prisma.order.findMany({
      take: 3,
      select: { orderNumber: true, status: true, customerName: true, totalValue: true, createdAt: true }
    });
    console.log('\n📋 Sample Orders:');
    sampleOrders.forEach(order => {
      console.log(`  - ${order.orderNumber} - ${order.customerName} - $${order.totalValue} - ${order.status} - ${order.createdAt.toISOString().split('T')[0]}`);
    });

    console.log('\n✅ Local database review completed!');

  } catch (error) {
    console.error('❌ Error checking local database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLocalDatabase();
