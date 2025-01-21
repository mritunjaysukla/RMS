const { prisma } = require('../utils/prisma');

// Create a new order
const createOrder = async (req, res) => {
  const { tableId, items } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        tableId,
        items: {
          create: items // Example: [{ menuItemId: 1, quantity: 2 }]
        },
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

// View orders for a table
const getOrdersByTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { tableId: parseInt(tableId) },
      include: { items: true } // Include order items
    });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // Example: 'COMPLETED'

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status }
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

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

// Export all functions
module.exports = {
  createOrder,
  getOrdersByTable,
  updateOrderStatus,
  getOrders,
  handlePayment
};
