import express from 'express';
import { prisma } from '../index';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = express.Router();

// Get all warehouses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      where: { isActive: true },
      include: {
        zones: {
          where: { isActive: true },
          include: {
            locations: {
              where: { isActive: true }
            }
          }
        },
        _count: {
          select: {
            inventory: true,
            orders: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json({
      status: 'success',
      data: { warehouses }
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Create new warehouse (Admin only)
router.post('/', authMiddleware, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, address, city, state, zipCode, country = 'US' } = req.body;

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode,
        country
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Warehouse created successfully',
      data: { warehouse }
    });
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

export default router;

