import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const [users, products, orders, inventory, warehouses] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.inventory.count(),
      prisma.warehouse.count(),
    ]);

    console.log('📊 Current Data Counts:');
    console.log(`👥 Users: ${users}`);
    console.log(`📦 Products: ${products}`);
    console.log(`📋 Orders: ${orders}`);
    console.log(`📊 Inventory Items: ${inventory}`);
    console.log(`🏢 Warehouses: ${warehouses}`);
    
    const totalRecords = users + products + orders + inventory + warehouses;
    console.log(`\n📈 Total Records: ${totalRecords}`);
    
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
