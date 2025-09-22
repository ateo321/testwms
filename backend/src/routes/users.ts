import express from 'express';
import { prisma } from '../index';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all users with pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      status: 'success',
      data: {
        users,
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
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Update user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, role, isActive } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !username || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if email is already taken by another user
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (emailExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    // Check if username is already taken by another user
    const usernameExists = await prisma.user.findFirst({
      where: {
        username,
        id: { not: id },
      },
    });

    if (usernameExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Username already exists',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        username,
        role,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      status: 'success',
      data: { user: updatedUser },
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// Delete user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if user has any orders (prevent deletion if they do)
    const userOrders = await prisma.order.count({
      where: { createdById: id },
    });

    if (userOrders > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete user with existing orders. Please reassign orders first.',
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router;