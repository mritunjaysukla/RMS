const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Generate Report (Manager only)
const generateReport = async (req, res) => {
  // #swagger.tags = ['Report']
  try {
    const { period, submittedToId } = req.body;
    const managerId = req.user.id;

    // Validate admin exists
    const admin = await prisma.user.findUnique({
      where: { id: submittedToId, role: 'Admin' }
    });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    // Calculate date range
    const { startDate, endDate } = calculateDateRange(period);

    // Get orders in period
    const orders = await prisma.order.findMany({
      where: {
        order_date: { gte: startDate, lte: endDate }
      },
      include: {
        billingDetails: true,
        table: true,
        order_details: {
          include: { menu_item: true }
        }
      }
    });

    // Calculate totals
    const total_orders = orders.length;
    const total_sales = orders.reduce(
      (sum, order) => sum + (order.billingDetails?.total || 0),
      0
    );

    // Create report
    const report = await prisma.report.create({
      data: {
        period,
        total_orders,
        total_sales,
        managerId,
        submittedToId,
        orders: { connect: orders.map((o) => ({ id: o.id })) }
      }
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get All Reports (Admin only)
const getAllReports = async (req, res) => {
  // #swagger.tags = ['Report']
  try {
    const reports = await prisma.report.findMany({
      include: { manager: true, submitted_to: true }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get Report Details (Admin only)
const getReportDetails = async (req, res) => {
  // #swagger.tags = ['Report']
  try {
    const report = await prisma.report.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        orders: {
          include: {
            table: true,
            billingDetails: true,
            order_details: {
              include: { menu_item: true }
            }
          }
        }
      }
    });

    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Group by table with time slots
    const tableData = report.orders.reduce((acc, order) => {
      const tableId = order.tableId;
      if (!acc[tableId]) {
        acc[tableId] = {
          tableNumber: order.table.table_number,
          totalOrder: 0,
          totalSales: 0,
          orders: []
        };
      }

      // Add order with time slot
      acc[tableId].orders.push({
        timeSlot: `${order.order_date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })} - ${order.billingDetails.createdAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        items: order.order_details.map((od) => ({
          name: od.menu_item.name,
          quantity: od.quantity,
          price: od.menu_item.price
        })),
        subtotal: order.billingDetails.subtotal,
        tax: order.billingDetails.tax,
        total: order.billingDetails.total
      });

      acc[tableId].totalOrder++;
      acc[tableId].totalSales += order.billingDetails.total;
      return acc;
    }, {});

    // Process tables
    const tables = Object.values(tableData)
      .sort(
        (a, b) =>
          parseInt(a.tableNumber.match(/\d+/)) -
          parseInt(b.tableNumber.match(/\d+/))
      )
      .map((table) => ({
        ...table,
        orders: table.orders.sort(
          (a, b) =>
            new Date(a.timeSlot.split(' - ')[0]) -
            new Date(b.timeSlot.split(' - ')[0])
        )
      }));

    res.json({
      id: report.id,
      period: report.period,
      total_orders: report.total_orders,
      total_sales: report.total_sales,
      tables
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function for date ranges
function calculateDateRange(period) {
  const now = new Date();
  let startDate, endDate;
  /* eslint-disable indent */

  switch (period) {
    case 'Daily':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      endDate = new Date(now.setHours(23, 59, 59, 999));
      break;
    case 'Weekly':
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      endDate = new Date(now.setDate(startDate.getDate() + 6));
      break;
    case 'Monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      throw new Error('Invalid period');
  }

  return { startDate, endDate };
}

module.exports = { generateReport, getAllReports, getReportDetails };
