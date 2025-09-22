import express from 'express';
import { prisma } from '../index';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

// Get key metrics for dashboard
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    // Calculate date range
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    // Get total orders
    const totalOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Get total revenue
    const revenueResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        totalValue: true
      }
    });

    // Get inventory value
    const inventoryResult = await prisma.inventory.aggregate({
      _sum: {
        quantity: true
      }
    });

    const inventoryValue = await prisma.inventory.findMany({
      include: {
        product: true
      }
    });

    const totalInventoryValue = inventoryValue.reduce((sum, item) => {
      return sum + (item.quantity * (item.product.unitPrice || 0));
    }, 0);

    // Get average order processing time (mock calculation)
    const avgOrderTime = 2.3; // This would be calculated from actual order processing times

    // Get previous period data for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    
    const prevTotalOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: prevStartDate,
          lte: startDate
        }
      }
    });

    const prevRevenueResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: prevStartDate,
          lte: startDate
        }
      },
      _sum: {
        totalValue: true
      }
    });

    // Calculate percentage changes
    const orderGrowth = prevTotalOrders > 0 ? ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100 : 0;
    const revenueGrowth = (prevRevenueResult._sum.totalValue || 0) > 0 ? 
      (((revenueResult._sum.totalValue || 0) - (prevRevenueResult._sum.totalValue || 0)) / (prevRevenueResult._sum.totalValue || 0)) * 100 : 0;

    res.json({
      status: 'success',
      data: {
        metrics: {
          totalOrders,
          revenue: revenueResult._sum.totalValue || 0,
          inventoryValue: totalInventoryValue,
          avgOrderTime,
          orderGrowth: Math.round(orderGrowth * 10) / 10,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
          inventoryGrowth: 5.0, // Mock growth
          avgOrderTimeGrowth: 0.2 // Mock growth
        }
      }
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get top selling products
router.get('/top-products', authMiddleware, async (req, res) => {
  try {
    const { period = '30', limit = '5' } = req.query;
    
    const days = parseInt(period as string);
    const limitNum = parseInt(limit as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: startDate
          }
        }
      },
      _sum: {
        quantity: true,
        totalPrice: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limitNum
    });

    // Get product details
    const productIds = topProducts.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    const result = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        unitsSold: item._sum.quantity || 0,
        revenue: item._sum.totalPrice || 0
      };
    });

    res.json({
      status: 'success',
      data: {
        topProducts: result
      }
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get warehouse performance
router.get('/warehouse-performance', authMiddleware, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const warehouses = await prisma.warehouse.findMany({
      include: {
        orders: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        },
        zones: {
          include: {
            locations: {
              include: {
                inventory: true
              }
            }
          }
        }
      }
    });

    const result = warehouses.map(warehouse => {
      const totalOrders = warehouse.orders.length;
      const avgOrderTime = 2.1 + Math.random() * 1.5; // Mock calculation
      const efficiency = 80 + Math.random() * 20; // Mock calculation
      const totalInventoryItems = warehouse.zones.reduce((sum, zone) => 
        sum + zone.locations.reduce((locSum, location) => 
          locSum + location.inventory.length, 0), 0);

      return {
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        totalOrders,
        avgOrderTime: Math.round(avgOrderTime * 10) / 10,
        efficiency: Math.round(efficiency * 10) / 10,
        totalInventoryItems
      };
    });

    // Sort by total orders descending
    result.sort((a, b) => b.totalOrders - a.totalOrders);

    res.json({
      status: 'success',
      data: {
        warehousePerformance: result
      }
    });
  } catch (error) {
    console.error('Get warehouse performance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get order status distribution
router.get('/order-status', authMiddleware, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const statusDistribution = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        status: true
      }
    });

    const total = statusDistribution.reduce((sum, item) => sum + item._count.status, 0);

    const result = statusDistribution.map(item => ({
      status: item.status,
      count: item._count.status,
      percentage: Math.round((item._count.status / total) * 100 * 10) / 10
    }));

    res.json({
      status: 'success',
      data: {
        orderStatus: result
      }
    });
  } catch (error) {
    console.error('Get order status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get inventory levels report
router.get('/inventory-levels', authMiddleware, async (req, res) => {
  try {
    const inventoryLevels = await prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true,
        location: {
          include: {
            zone: true
          }
        }
      }
    });

    const result = inventoryLevels.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      warehouseName: item.warehouse.name,
      locationName: item.location.name,
      zoneName: item.location.zone.name,
      quantity: item.quantity,
      availableQty: item.availableQty,
      reservedQty: item.reservedQty,
      minStock: item.minStock,
      maxStock: item.maxStock,
      isLowStock: item.quantity <= (item.minStock || 0),
      isOverstock: item.quantity >= (item.maxStock || 0),
      value: item.quantity * (item.product.unitPrice || 0)
    }));

    // Sort by value descending
    result.sort((a, b) => b.value - a.value);

    res.json({
      status: 'success',
      data: {
        inventoryLevels: result
      }
    });
  } catch (error) {
    console.error('Get inventory levels error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Get activity summary
router.get('/activity-summary', authMiddleware, async (req, res) => {
  try {
    const { period = '7' } = req.query;
    
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const activities = await prisma.activityLog.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    const actionCounts = await prisma.activityLog.groupBy({
      by: ['action'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: {
        action: true
      }
    });

    res.json({
      status: 'success',
      data: {
        recentActivities: activities,
        actionCounts
      }
    });
  } catch (error) {
    console.error('Get activity summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

export default router;
