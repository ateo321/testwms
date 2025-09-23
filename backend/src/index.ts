import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import inventoryRoutes from './routes/inventory';
import warehouseRoutes from './routes/warehouse';
import orderRoutes from './routes/orders';
import reportRoutes from './routes/reports';
import seedRoutes from './routes/seed';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://testwms-production.up.railway.app',
    'https://*.up.railway.app'
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'WMS API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Force add pagination data endpoint
app.post('/api/force-seed', async (req, res) => {
  try {
    console.log('🌱 Force adding pagination test data...');

    const bcrypt = require('bcryptjs');

    // Add 50 more users for pagination testing
    console.log('👥 Adding 50 more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@test.com`;
      const username = `user${i + 1}`;
      const role = (['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'] as const)[i % 4];
      const userHashedPassword = await bcrypt.hash('password123', 10);

      users.push({
        firstName,
        lastName,
        email,
        username,
        password: userHashedPassword,
        role,
        isActive: Math.random() > 0.1, // 90% active
      });
    }

    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdUsers.count} additional users`);

    // Add 5 more warehouses
    console.log('🏢 Adding 5 more warehouses...');
    const warehouses = [
      {
        name: 'North Warehouse',
        address: '123 North St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'South Warehouse',
        address: '456 South Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'US',
        isActive: true,
      },
      {
        name: 'East Warehouse',
        address: '789 East Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'US',
        isActive: true,
      },
      {
        name: 'West Warehouse',
        address: '321 West St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'Central Warehouse',
        address: '654 Central Ave',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'US',
        isActive: true,
      }
    ];

    const createdWarehouses = await prisma.warehouse.createMany({
      data: warehouses,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdWarehouses.count} additional warehouses`);

    // Add 50 more products
    console.log('📦 Adding 50 more products...');
    const products = [];
    for (let i = 0; i < 50; i++) {
      const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Automotive', 'Health'];
      products.push({
        name: `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        description: `Description for product ${i + 1}`,
        category: categories[i % categories.length],
        unitPrice: Math.floor(Math.random() * 1000) + 10,
      });
    }

    const createdProducts = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdProducts.count} additional products`);

    // Get final counts
    const finalCounts = {
      totalUsers: await prisma.user.count(),
      totalWarehouses: await prisma.warehouse.count(),
      totalProducts: await prisma.product.count(),
      totalInventory: await prisma.inventory.count(),
      totalOrders: await prisma.order.count(),
    };

    console.log('🎉 Pagination test data added successfully!');
    console.log('📊 Final counts:', finalCounts);

    res.json({
      status: 'success',
      message: 'Pagination test data added successfully!',
      data: finalCounts
    });

  } catch (error) {
    console.error('❌ Error adding pagination data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add pagination data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add more test data endpoint
app.post('/api/seed-more', async (req, res) => {
  try {
    console.log('🌱 Adding more test data for pagination testing...');

    // Get existing data
    const existingWarehouse = await prisma.warehouse.findFirst();
    const existingZone = await prisma.zone.findFirst();
    const existingLocation = await prisma.location.findFirst();
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    if (!existingWarehouse || !existingZone || !existingLocation || !existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required data. Please run /api/seed first.'
      });
    }

    const bcrypt = require('bcryptjs');
    const faker = require('@faker-js/faker');

    // Add 50 more users
    console.log('👥 Adding 50 more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const username = faker.internet.username({ firstName, lastName });
      const role = faker.helpers.arrayElement(['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN']);
      const hashedPassword = await bcrypt.hash('password123', 10);

      users.push({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role,
        isActive: faker.datatype.boolean(0.9),
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

    // Get final counts
    const finalCounts = {
      totalUsers: await prisma.user.count(),
      totalWarehouses: await prisma.warehouse.count(),
      totalProducts: await prisma.product.count(),
      totalInventory: await prisma.inventory.count(),
      totalOrders: await prisma.order.count(),
    };

    console.log('🎉 More test data added successfully!');
    console.log('📊 Final counts:', finalCounts);

    res.json({
      status: 'success',
      message: 'More test data added successfully!',
      data: finalCounts
    });

  } catch (error) {
    console.error('❌ Error adding more test data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add more test data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Simple seed endpoint for database population
app.post('/api/seed', async (req, res) => {
  try {
    console.log('🌱 Starting database seed...');

    // Check if data already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'admin@wms.com' }
    });

    if (existingUser) {
      console.log('✅ Admin user already exists:', existingUser.email);
      return res.json({
        status: 'success',
        message: 'Database already seeded!',
        data: {
          admin: existingUser.email,
          totalUsers: await prisma.user.count(),
          totalWarehouses: await prisma.warehouse.count(),
          totalProducts: await prisma.product.count(),
          totalInventory: await prisma.inventory.count(),
          totalOrders: await prisma.order.count(),
        }
      });
    }

    // Create admin user
    const bcrypt = require('bcryptjs');
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

    // Add 50 more users for pagination testing
    console.log('👥 Adding 50 more users...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const firstName = `User${i + 1}`;
      const lastName = `Test${i + 1}`;
      const email = `user${i + 1}@test.com`;
      const username = `user${i + 1}`;
      const role = (['EMPLOYEE', 'SUPERVISOR', 'MANAGER', 'ADMIN'] as const)[i % 4];
      const userHashedPassword = await bcrypt.hash('password123', 10);

      users.push({
        firstName,
        lastName,
        email,
        username,
        password: userHashedPassword,
        role,
        isActive: Math.random() > 0.1, // 90% active
      });
    }

    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdUsers.count} additional users`);

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

    // Add 5 more warehouses
    console.log('🏢 Adding 5 more warehouses...');
    const warehouses = [
      {
        name: 'North Warehouse',
        address: '123 North St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'South Warehouse',
        address: '456 South Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'US',
        isActive: true,
      },
      {
        name: 'East Warehouse',
        address: '789 East Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'US',
        isActive: true,
      },
      {
        name: 'West Warehouse',
        address: '321 West St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'US',
        isActive: true,
      },
      {
        name: 'Central Warehouse',
        address: '654 Central Ave',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'US',
        isActive: true,
      }
    ];

    const createdWarehouses = await prisma.warehouse.createMany({
      data: warehouses,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdWarehouses.count} additional warehouses`);

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
        barcode: `A1-01-${Date.now()}`,
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
        sku: `PROD-${Date.now()}`,
        description: 'A sample product for testing',
        category: 'Electronics',
        unitPrice: 99.99,
      },
    });

    console.log('✅ Product created:', product.name);

    // Add 50 more products
    console.log('📦 Adding 50 more products...');
    const products = [];
    for (let i = 0; i < 50; i++) {
      const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Automotive', 'Health'];
      products.push({
        name: `Product ${i + 1}`,
        sku: `SKU-${String(i + 1).padStart(3, '0')}`,
        description: `Description for product ${i + 1}`,
        category: categories[i % categories.length],
        unitPrice: Math.floor(Math.random() * 1000) + 10,
      });
    }

    const createdProducts = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    });

    console.log(`✅ Created ${createdProducts.count} additional products`);

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
        orderNumber: `ORD-${Date.now()}`,
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

    // Get counts
    const counts = {
      totalUsers: await prisma.user.count(),
      totalWarehouses: await prisma.warehouse.count(),
      totalProducts: await prisma.product.count(),
      totalInventory: await prisma.inventory.count(),
      totalOrders: await prisma.order.count(),
    };

    console.log('🎉 Database seeded successfully!');
    console.log('📊 Counts:', counts);

    res.json({
      status: 'success',
      message: 'Database seeded successfully!',
      data: {
        admin: admin.email,
        ...counts
      }
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/seed', seedRoutes);

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../out'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../out/index.html'));
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WMS API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Server accessible at: http://0.0.0.0:${PORT}`);
});

export default app;

