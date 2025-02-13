const { prisma } = require('../utils/prisma');
const { v4: uuidv4 } = require('uuid');

// Create New Order
exports.createOrder = async (req, res) => {
  // #swagger.tags = ['Order']
  const { tableId, items, specialInstructions, discount } = req.body;
  const waiterId = req.user.id;

  try {
    // Validate input
    if (!tableId || !items?.length) {
      return res
        .status(400)
        .json({ message: 'Table ID and items are required' });
    }

    // Check table availability
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table?.isAvailable) {
      return res.status(400).json({ message: 'Table is not available' });
    }

    // Generate unique order number
    const orderNumber = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          tableId,
          waiterId,
          special_instructions: specialInstructions,
          order_status: 'Preparing'
        }
      });

      // Process order items
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const menuItem = await tx.menuItem.findUnique({
            where: { id: item.menuItemId },
            include: { menu: { select: { status: true } } }
          });

          if (!menuItem?.isAvailable || menuItem.menu.status !== 'Active') {
            throw new Error(`Item ${item.name} is unavailable`);
          }

          return tx.orderDetails.create({
            data: {
              orderId: newOrder.id,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              unit_price: menuItem.price,
              total_price: menuItem.price * item.quantity
            }
          });
        })
      );

      // Calculate totals
      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.total_price,
        0
      );
      const tax = subtotal * 0.13; // 13% tax
      const total = subtotal + tax - (discount || 0); // Apply discount

      // Create billing details
      await tx.billingDetails.create({
        data: {
          orderId: newOrder.id,
          subtotal,
          tax,
          discount: discount || 0,
          total
        }
      });

      // Mark table as occupied
      await tx.table.update({
        where: { id: tableId },
        data: { isAvailable: false }
      });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res
      .status(400)
      .json({ message: error.message || 'Failed to create order' });
  }
};

// Get Orders with Filters
exports.getOrders = async (req, res) => {
  // #swagger.tags = ['Order']
  const { status, startDate, endDate, waiterId } = req.query;

  try {
    const orders = await prisma.order.findMany({
      where: {
        order_status: status ? status : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined
        },
        waiterId: waiterId ? parseInt(waiterId) : undefined
      },
      include: {
        table: { select: { table_number: true } },
        waiter: { select: { username: true } },
        billingDetails: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format response for UI
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      tableNumber: order.table?.table_number,
      status: order.order_status,
      total: order.billingDetails?.total,
      waiter: order.waiter?.username,
      createdAt: order.createdAt
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get Order Details
exports.getOrderDetails = async (req, res) => {
  // #swagger.tags = ['Order']
  const orderId = parseInt(req.params.id);

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        table: { select: { table_number: true } },
        waiter: { select: { username: true } },
        order_details: {
          include: {
            menu_item: {
              select: { name: true, price: true }
            }
          }
        },
        billingDetails: true
      }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Format order items
    const orderItems = order.order_details.map((item) => ({
      name: item.menu_item.name,
      quantity: item.quantity,
      price: item.unit_price,
      total: item.total_price
    }));

    res.json({
      orderNumber: order.order_number,
      tableNumber: order.table.table_number,
      status: order.order_status,
      createdAt: order.createdAt,
      waiter: order.waiter.username,
      specialInstructions: order.special_instructions,
      items: orderItems,
      subtotal: order.billingDetails.subtotal,
      tax: order.billingDetails.tax,
      discount: order.billingDetails.discount,
      total: order.billingDetails.total
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  // #swagger.tags = ['Order']
  const orderId = parseInt(req.params.id);
  const { status } = req.query; // Get status from query parameter

  try {
    if (!['Preparing', 'Served', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { order_status: status },
      include: {
        table: true,
        billingDetails: true
      }
    });

    // If order is completed, mark table as available
    if (status === 'Served' || status === 'Rejected') {
      await prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { isAvailable: true }
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};
