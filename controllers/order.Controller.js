const { prisma } = require('../utils/prisma');

// Get orders for tables managed by the manager
const getOrders = async (req, res) => {
  const { managerId } = req.admin; // Assume managerId is set in token
  try {
    // Fetch orders along with payment details
    const orders = await prisma.order.findMany({
      where: { managerId },
      include: {
        payments: true // Ensure this matches your schema relationship
      }
    });

    // Map orders to include payment status
    const ordersWithPaymentStatus = orders.map((order) => ({
      ...order,
      paymentStatus: order.payments?.status || 'pending' // Default to "pending"
    }));

    res.json({ success: true, data: ordersWithPaymentStatus });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Error fetching orders' });
  }
};

// Handle table-specific payment
const handlePayment = async (req, res) => {
  const { tableId, amount, status = 'pending' } = req.body; // Default status to "pending"
  try {
    const payment = await prisma.payment.create({
      data: { tableId, amount, status }
    });
    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, error: 'Error processing payment' });
  }
};

module.exports = { getOrders, handlePayment };
