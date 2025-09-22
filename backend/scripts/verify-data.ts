import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('🔍 Verifying test data...\n');

  // Count records in each table
  const userCount = await prisma.user.count();
  const warehouseCount = await prisma.warehouse.count();
  const zoneCount = await prisma.zone.count();
  const locationCount = await prisma.location.count();
  const productCount = await prisma.product.count();
  const inventoryCount = await prisma.inventory.count();
  const orderCount = await prisma.order.count();
  const orderItemCount = await prisma.orderItem.count();
  const activityLogCount = await prisma.activityLog.count();

  console.log('📊 Database Records:');
  console.log(`👥 Users: ${userCount}`);
  console.log(`🏢 Warehouses: ${warehouseCount}`);
  console.log(`🏗️ Zones: ${zoneCount}`);
  console.log(`📍 Locations: ${locationCount}`);
  console.log(`📦 Products: ${productCount}`);
  console.log(`📊 Inventory: ${inventoryCount}`);
  console.log(`📋 Orders: ${orderCount}`);
  console.log(`📝 Order Items: ${orderItemCount}`);
  console.log(`🔄 Activity Logs: ${activityLogCount}\n`);

  // Show sample data
  console.log('🔍 Sample Data:');
  
  const sampleUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  console.log(`Admin User: ${sampleUser?.firstName} ${sampleUser?.lastName} (${sampleUser?.email})`);

  const sampleWarehouse = await prisma.warehouse.findFirst({
    include: {
      zones: { take: 2 },
      _count: { select: { inventory: true, orders: true } }
    }
  });
  console.log(`Main Warehouse: ${sampleWarehouse?.name} - ${sampleWarehouse?._count.inventory} inventory items, ${sampleWarehouse?._count.orders} orders`);

  const lowStockItems = await prisma.inventory.findMany({
    where: {
      availableQty: { lte: 25 }
    },
    include: {
      product: { select: { name: true, sku: true } },
      warehouse: { select: { name: true } }
    },
    take: 5
  });
  
  if (lowStockItems.length > 0) {
    console.log('\n⚠️ Low Stock Items:');
    lowStockItems.forEach(item => {
      console.log(`  • ${item.product.name} (${item.product.sku}): ${item.availableQty} units at ${item.warehouse.name}`);
    });
  }

  const recentOrders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: { select: { name: true } }
        }
      },
      warehouse: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  console.log('\n📋 Recent Orders:');
  recentOrders.forEach(order => {
    console.log(`  • ${order.orderNumber} - ${order.customerName} - ${order.status} - $${order.totalValue.toFixed(2)} (${order.items.length} items)`);
  });

  console.log('\n✅ Data verification complete!');
}

verifyData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
