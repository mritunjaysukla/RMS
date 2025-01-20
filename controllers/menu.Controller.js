const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to add a new menu item
exports.createMenuItem = async (req, res) => {
  const { name, price, description } = req.body;
  const userId = req.user?.id; // Get user ID from auth middleware

  try {
    // Validate required fields
    if (!name || !price || !description) {
      return res.status(400).json({
        message: 'Name, price, and description are required'
      });
    }

    const newMenuItem = await prisma.menu.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        isApproved: false,
        createdById: userId
      }
    });

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      menuItem: newMenuItem
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add menu item'
    });
  }
};

// Read all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany();
    res.status(200).json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Failed to fetch menu items', error });
  }
};

// Controller to update an existing menu item
exports.updateMenuItem = async (req, res) => {
  const menuItemId = parseInt(req.params.id); // Menu item ID from the URL params
  const { name, price, description } = req.body;

  try {
    // Check if the menu item exists
    const menuItem = await prisma.menu.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Update the menu item
    const updatedMenuItem = await prisma.menu.update({
      where: { id: menuItemId },
      data: {
        name: name || menuItem.name, // Update only if provided
        price: price || menuItem.price,
        description: description || menuItem.description
      }
    });

    res.status(200).json({
      message: 'Menu item updated successfully',
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item', error });
  }
};

// Controller to delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const menuItemId = parseInt(req.params.id); // Menu item ID from the URL params

  try {
    // Check if the menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete the menu item
    await prisma.menuItem.delete({
      where: { id: menuItemId }
    });

    res.status(200).json({
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item', error });
  }
};

// Controller to approve a menu item
exports.approveMenuItem = async (req, res) => {
  const menuItemId = parseInt(req?.params?.id); // Menu item ID from the URL params
  console.log('menuId', req?.params?.id);
  try {
    // Fetch the menu item by ID
    const menuItem = await prisma.menu.findUnique({
      where: { id: menuItemId }
    });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.isApproved) {
      return res.status(400).json({ message: 'Menu item is already approved' });
    }

    // Approve the menu item
    const approvedMenuItem = await prisma.menu.update({
      where: { id: menuItemId },

      data: { isApproved: true, status: 'Approved' }
    });

    res.status(200).json({
      message: 'Menu item approved successfully',
      menuItem: approvedMenuItem
    });
  } catch (error) {
    console.error('Error approving menu item:', error);
    res.status(500).json({ message: 'Failed to approve menu item', error });
  }
};
