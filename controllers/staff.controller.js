/* eslint-disable no-unused-vars */
const { prisma } = require('../utils/prisma');
const { timeSince, calculateMetrics } = require('../utils/staffHelper');
/* eslint-disable indent */
// Get all staff members (for staff list)
exports.getAllStaff = async (_req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: { in: ['Waiter', 'Manager'] } },
      select: {
        id: true,
        username: true,
        role: true,
        contact: true,
        email: true,
        dob: true,
        gender: true,
        StaffOnDuty: {
          orderBy: { startTime: 'desc' },
          take: 1
        }
      }
    });

    const formattedStaff = staff.map((user) => ({
      id: user.id,
      name: user.username,
      role: user.role,
      contact: user.contact,
      email: user.email,
      dob: user.dob.toISOString().split('T')[0],
      gender: user.gender,
      status: user.StaffOnDuty[0]?.status || 'Inactive',
      lastActive: user.StaffOnDuty[0]
        ? timeSince(user.StaffOnDuty[0].startTime)
        : 'N/A'
    }));

    res.status(200).json(formattedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch staff list' });
  }
};

// Get active staff with performance metrics (for staff on duty)
exports.getStaffOnDuty = async (_req, res) => {
  try {
    // Get active duty sessions with user details
    const activeDuty = await prisma.staffOnDuty.findMany({
      where: { endTime: null, status: 'Active' },
      include: { user: true }
    });

    // Get all waiter IDs for order lookup
    const waiterIds = activeDuty
      .filter((d) => d.user.role === 'Waiter')
      .map((d) => d.userId);

    // Single query for all relevant orders
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        waiterId: { in: waiterIds },
        order_status: 'Served',
        createdAt: { gte: new Date(todayStart), lte: new Date(todayEnd) }
      },
      include: { billingDetails: true }
    });

    // Group orders by waiterId for efficient lookup
    const ordersByWaiter = orders.reduce((acc, order) => {
      acc[order.waiterId] = acc[order.waiterId] || [];
      acc[order.waiterId].push(order);
      return acc;
    }, {});

    // Format response with calculated metrics
    const formattedStaff = activeDuty.map((duty) => ({
      id: duty.user.id,
      name: duty.user.username,
      role: duty.user.role,
      status: duty.status,
      ...(duty.user.role === 'Waiter'
        ? calculateMetrics(ordersByWaiter[duty.userId] || [], duty.startTime)
        : {
            serviceTime: timeSince(duty.startTime),
            workingHours:
              ((Date.now() - duty.startTime) / 3600000).toFixed(1) + ' hours'
          })
    }));

    res.status(200).json(formattedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active staff' });
  }
};
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete all related records first
    await prisma.staffOnDuty.deleteMany({ where: { userId: Number(id) } });
    await prisma.user.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(500).json({ message: 'Deletion failed' });
  }
};
