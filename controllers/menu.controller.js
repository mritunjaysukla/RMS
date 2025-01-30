const { prisma } = require('../utils/prisma');

// Create Menu with Items in one request (Manager only)
exports.createMenuWithItems = async (req, res) => {
  // #swagger.tags = ['Menu']
  const { name, categoryId, items } = req.body;
  const userId = req.user.id;

  try {
    if (!name || !categoryId || !items?.length) {
      return res.status(400).json({
        message: 'Name, category ID, and at least one menu item are required'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the menu
      const menu = await tx.menu.create({
        data: {
          name,
          categoryId: parseInt(categoryId),
          createdById: userId,
          status: 'Pending',
          isApproved: false
        }
      });

      // Create menu items
      const menuItems = await Promise.all(
        items.map((item) =>
          tx.menuItem.create({
            data: {
              menuId: menu.id,
              name: item.name,
              price: parseFloat(item.price),
              categoryId: parseInt(item.categoryId),
              isPopular: item.isPopular || false,
              isAvailable:
                item.isAvailable !== undefined ? item.isAvailable : true
            }
          })
        )
      );

      return { menu, menuItems };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating menu with items:', error);
    res.status(500).json({ message: 'Failed to create menu', error });
  }
};

// Get Active Menus with Items and Categories
exports.getActiveMenus = async (req, res) => {
  // #swagger.tags = ['Menu']
  try {
    const activeMenus = await prisma.menu.findMany({
      where: {
        status: 'Active',
        isApproved: true
      },
      include: {
        MenuItems: {
          where: { isAvailable: true },
          include: { category: true }
        },
        category: true,
        approved_by: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(activeMenus);
  } catch (error) {
    console.error('Error fetching active menus:', error);
    res.status(500).json({ message: 'Failed to fetch menus', error });
  }
};

// Get Popular Menus and Items
exports.getPopular = async (req, res) => {
  // #swagger.tags = ['Menu']
  try {
    // Get popular menus
    const popularMenus = await prisma.menu.findMany({
      where: {
        status: 'Active',
        isApproved: true,
        isPopular: true
      },
      include: {
        MenuItems: {
          where: { isAvailable: true },
          include: { category: true }
        },
        category: true
      }
    });

    // Get popular items across all menus
    const popularItems = await prisma.menuItem.findMany({
      where: {
        isPopular: true,
        isAvailable: true,
        menu: {
          status: 'Active',
          isApproved: true
        }
      },
      include: {
        menu: true,
        category: true
      }
    });

    res.json({
      popularMenus,
      popularItems
    });
  } catch (error) {
    console.error('Error fetching popular content:', error);
    res.status(500).json({ message: 'Failed to fetch popular content', error });
  }
};

// Approve Menu (Admin only)
exports.approveMenu = async (req, res) => {
  // #swagger.tags = ['Menu']
  const menuId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        status: 'Active',
        isApproved: true,
        approvedById: userId
      },
      include: {
        MenuItems: {
          include: { category: true }
        },
        category: true,
        approved_by: true
      }
    });

    res.json(updatedMenu);
  } catch (error) {
    console.error('Error approving menu:', error);
    res.status(500).json({ message: 'Failed to approve menu', error });
  }
};

// Get Menus by Food Category
exports.getMenusByFoodCategory = async (req, res) => {
  // #swagger.tags = ['Menu']
  const { categoryId } = req.params;

  try {
    const menus = await prisma.menu.findMany({
      where: {
        status: 'Active',
        isApproved: true,
        categoryId: parseInt(categoryId)
      },
      include: {
        MenuItems: {
          where: { isAvailable: true },
          include: { category: true }
        },
        category: true
      }
    });

    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus by category:', error);
    res.status(500).json({ message: 'Failed to fetch menus', error });
  }
};
// Get Pending Menus (Admin only)
exports.getPendingMenus = async (req, res) => {
  // #swagger.tags = ['Menu']
  try {
    const pendingMenus = await prisma.menu.findMany({
      where: {
        status: 'Pending',
        isApproved: false
      },
      include: {
        MenuItems: true,
        category: true,
        created_by: true
      }
    });
    res.json(pendingMenus);
  } catch (error) {
    console.error('Error fetching pending menus:', error);
    res.status(500).json({ message: 'Failed to fetch pending menus', error });
  }
};

// Get Rejected Menus (Admin only)
exports.getRejectedMenus = async (req, res) => {
  // #swagger.tags = ['Menu']
  try {
    const rejectedMenus = await prisma.menu.findMany({
      where: {
        status: 'Rejected',
        isApproved: false
      },
      include: {
        MenuItems: true,
        category: true,
        created_by: true,
        approved_by: true
      }
    });
    res.json(rejectedMenus);
  } catch (error) {
    console.error('Error fetching rejected menus:', error);
    res.status(500).json({ message: 'Failed to fetch rejected menus', error });
  }
};

// Update the approveMenu controller to handle rejection
exports.approveOrRejectMenu = async (req, res) => {
  // #swagger.tags = ['Menu']
  const menuId = parseInt(req.params.id);
  const userId = req.user.id;
  const { status } = req.body;

  try {
    if (!['Active', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        status: status,
        isApproved: status === 'Active',
        approvedById: userId
      },
      include: {
        MenuItems: {
          include: { category: true }
        },
        category: true,
        approved_by: true,
        created_by: true
      }
    });

    res.json({
      message: `Menu ${status === 'Active' ? 'approved' : 'rejected'} successfully`,
      menu: updatedMenu
    });
  } catch (error) {
    console.error('Error updating menu status:', error);
    res.status(500).json({ message: 'Failed to update menu status', error });
  }
};
