import express from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all orders with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          warehouse: {
            select: {
              name: true,
            },
          },
          items: {
            select: {
              quantity: true,
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      status: order.status,
      priority: order.priority,
      totalItems: order.totalItems,
      totalValue: order.totalValue,
      createdAt: order.createdAt.toISOString().split('T')[0],
      assignedTo: order.assignedTo ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}` : null,
    }));

    res.json({
      status: 'success',
      data: {
        orders: transformedOrders,
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
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      status: order.status,
      priority: order.priority,
      totalItems: order.totalItems,
      totalValue: order.totalValue,
      createdAt: order.createdAt.toISOString().split('T')[0],
      assignedTo: order.assignedTo ? `${order.assignedTo.firstName} ${order.assignedTo.lastName}` : null,
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          name: item.product.name,
          sku: item.product.sku,
        },
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    };

    res.json({
      status: 'success',
      data: { order: transformedOrder },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Update order
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedToId, customerName } = req.body;

    // Validate required fields
    if (!status || !priority) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Validate status values
    const validStatuses = ['PENDING', 'PROCESSING', 'PICKING', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status value',
      });
    }

    // Validate priority values
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid priority value',
      });
    }

    // If assignedToId is provided, check if user exists
    if (assignedToId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToId },
      });

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Assigned user not found',
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        priority,
        assignedToId: assignedToId || null,
        customerName: customerName || existingOrder.customerName,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        warehouse: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    const transformedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      status: updatedOrder.status,
      priority: updatedOrder.priority,
      totalItems: updatedOrder.totalItems,
      totalValue: updatedOrder.totalValue,
      createdAt: updatedOrder.createdAt.toISOString().split('T')[0],
      assignedTo: updatedOrder.assignedTo ? `${updatedOrder.assignedTo.firstName} ${updatedOrder.assignedTo.lastName}` : null,
    };

    res.json({
      status: 'success',
      data: { order: transformedOrder },
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Delete order
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Check if order can be deleted (only PENDING orders can be deleted)
    if (existingOrder.status !== 'PENDING') {
      return res.status(400).json({
        status: 'error',
        message: 'Only pending orders can be deleted',
      });
    }

    // Delete order items first (cascade delete should handle this, but being explicit)
    await prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    // Delete the order
    await prisma.order.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router;