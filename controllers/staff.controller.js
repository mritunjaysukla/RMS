const { prisma } = require('../utils/prisma');

// Get all staff on duty with dynamic calculations
exports.getStaffOnDuty = async (req, res) => {
  // #swagger.tags = ['Staff']
  try {
    const staffOnDuty = await prisma.staffOnDuty.findMany({
      where: {
        endTime: null, // Active duty sessions
        status: 'Active'
      },
      include: {
        user: true
      }
    });

    // Calculate dynamic metrics for each staff member
    const formattedStaff = await Promise.all(
      staffOnDuty.map(async (staff) => {
        // Fetch today's served orders for the staff member
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const orders = await prisma.order.findMany({
          where: {
            waiterId: staff.userId,
            order_status: 'Served',
            createdAt: {
              gte: todayStart,
              lte: todayEnd
            }
          },
          include: {
            billingDetails: true
          }
        });

        // Calculate metrics
        const ordersServed = orders.length;
        const totalEarnings = orders.reduce(
          (sum, order) => sum + (order.billingDetails?.total || 0),
          0
        );
        const totalDuration = orders.reduce(
          (sum, order) => sum + (order.duration || 0),
          0
        );
        const averageTime =
          ordersServed > 0
            ? (totalDuration / ordersServed).toFixed(1) + 'min/order'
            : 'N/A';

        // Calculate working hours for this duty session
        const now = new Date();
        const start = staff.startTime;
        const end = staff.endTime || now;
        const serviceTimeMs = end - start;
        const serviceTimeHours = (serviceTimeMs / (1000 * 60 * 60)).toFixed(1);

        return {
          id: staff.user.id,
          name: staff.user.username,
          status: staff.status,
          role: staff.user.role,
          contact: staff.user.contact,
          dob: staff.user.dob.toISOString().split('T')[0],
          gender: staff.user.gender,
          serviceTime: `${serviceTimeHours} hours`,
          performanceStatus: {
            today: {
              ordersServed,
              averageTime
            }
          },
          workingHours: `${serviceTimeHours} hours`,
          totalEarnings: `Rs. ${totalEarnings.toFixed(2)}`
        };
      })
    );

    res.status(200).json(formattedStaff);
  } catch (error) {
    console.error('Error fetching staff on duty:', error);
    res.status(500).json({ message: 'Failed to fetch staff on duty' });
  }
};
