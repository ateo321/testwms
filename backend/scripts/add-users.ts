import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function addUsers() {
  try {
    console.log('👥 Adding more test users...\n');

    // Add 20 more users
    const users = [];
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const username = faker.internet.username({ firstName, lastName });
      const role = faker.helpers.arrayElement(['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN']);
      
      users.push({
        firstName,
        lastName,
        email,
        username,
        password: 'password123', // Default password for all test users
        role,
        isActive: faker.datatype.boolean(0.9), // 90% active
      });
    }

    // Insert users
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdUsers.count} users`);

    // Show some sample users
    const sampleUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    console.log('\n📋 Sample users created:');
    sampleUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
    });

    // Get total count
    const totalUsers = await prisma.user.count();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

  } catch (error) {
    console.error('❌ Error adding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addUsers();
