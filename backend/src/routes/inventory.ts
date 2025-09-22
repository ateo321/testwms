import express from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all inventory items with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              category: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
              zone: {
                select: {
                  name: true,
                  warehouse: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          warehouse: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.inventory.count(),
    ]);

    // Transform the data to match frontend expectations
    const transformedInventory = inventory.map((item) => ({
      id: item.id,
      product: {
        name: item.product.name,
        sku: item.product.sku,
      },
      location: item.location.name,
      quantity: item.quantity,
      available: item.availableQty,
      reserved: item.reservedQty,
      status: item.quantity <= (item.minStock || 10) ? 'Low Stock' : 'In Stock',
      warehouse: item.warehouse.name,
    }));

    res.json({
      status: 'success',
      data: {
        inventory: transformedInventory,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get inventory item by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            unitPrice: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            zone: {
              select: {
                name: true,
                warehouse: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!inventory) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }

    const transformedItem = {
      id: inventory.id,
      product: {
        name: inventory.product.name,
        sku: inventory.product.sku,
      },
      location: inventory.location.name,
      quantity: inventory.quantity,
      available: inventory.availableQty,
      reserved: inventory.reservedQty,
      status: inventory.quantity <= (inventory.minStock || 10) ? 'Low Stock' : 'In Stock',
      warehouse: inventory.warehouse.name,
    };

    res.json({
      status: 'success',
      data: { inventory: transformedItem },
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Update inventory item
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, availableQty, reservedQty, minStock, maxStock } = req.body;
    
    // Debug: Log the received data
    console.log('Updating inventory item:', id, { quantity, availableQty, reservedQty, minStock, maxStock });

    // Validate required fields
    if (quantity === undefined || availableQty === undefined || reservedQty === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if inventory item exists
    const existingItem = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }

    // Validate quantities
    if (quantity < 0 || availableQty < 0 || reservedQty < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantities cannot be negative',
      });
    }

    if (availableQty + reservedQty > quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Available + Reserved quantity cannot exceed total quantity',
      });
    }

    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: parseInt(quantity),
        availableQty: parseInt(availableQty),
        reservedQty: parseInt(reservedQty),
        minStock: minStock ? parseInt(minStock) : undefined,
        maxStock: maxStock ? parseInt(maxStock) : undefined,
        updatedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            category: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            zone: {
              select: {
                name: true,
                warehouse: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
      },
    });

    const transformedItem = {
      id: updatedItem.id,
      product: {
        name: updatedItem.product?.name || 'Unknown Product',
        sku: updatedItem.product?.sku || 'N/A',
      },
      location: updatedItem.location?.name || 'Unknown Location',
      quantity: updatedItem.quantity,
      available: updatedItem.availableQty,
      reserved: updatedItem.reservedQty,
      status: updatedItem.quantity <= (updatedItem.minStock || 10) ? 'Low Stock' : 'In Stock',
      warehouse: updatedItem.warehouse?.name || 'Unknown Warehouse',
    };

    res.json({
      status: 'success',
      data: { inventory: transformedItem },
      message: 'Inventory item updated successfully',
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Delete inventory item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if inventory item exists
    const existingItem = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }

    // Check if there are any order items referencing this inventory's product
    const orderItems = await prisma.orderItem.count({
      where: { productId: existingItem.productId },
    });

    if (orderItems > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete inventory item with existing order items. Please remove from orders first.',
      });
    }

    await prisma.inventory.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router;