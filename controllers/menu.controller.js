const { prisma } = require('../utils/prisma');

// Create Menu with Items (Manager only)
exports.createMenuWithItems = async (req, res) => {
  // #swagger.tags = ['Menu']
  const { categoryId, items } = req.body;
  const userId = req.user.id;

  try {
    if (!categoryId || !items?.length) {
      return res.status(400).json({
        message: 'Name, category ID, and at least one menu item are required'
      });
    }

    // Check if categoryId exists in FoodCategory
    const categoryExists = await prisma.foodCategory.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: 'Invalid categoryId. Category does not exist.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the menu
      const menu = await tx.menu.create({
        data: {
          name: `Menu-${Date.now()}`, // Assign a default name
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

// Get Menus with Filters (Active, Pending, Rejected)
exports.getMenus = async (req, res) => {
  // #swagger.tags = ['Menu']
  const { status, categoryId, isPopular } = req.query;

  try {
    const menus = await prisma.menu.findMany({
      where: {
        status: status ? status : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isPopular: isPopular ? isPopular === 'true' : undefined,
        isApproved: status === 'Active' ? true : undefined
      },
      include: {
        MenuItems: {
          include: { category: true }
        },
        category: true,
        created_by: true,
        approved_by: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Failed to fetch menus', error });
  }
};

// Update Menu Status (Approve/Reject - Admin only)
exports.updateMenuStatus = async (req, res) => {
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

// Update Menu
exports.updateMenu = async (req, res) => {
  // #swagger.tags = ['Menu']
  const menuId = parseInt(req.params.id);
  const { name, categoryId, isPopular } = req.body;

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        name,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isPopular: isPopular !== undefined ? isPopular : undefined
      },
      include: {
        MenuItems: {
          include: { category: true }
        },
        category: true,
        created_by: true
      }
    });

    res.json(updatedMenu);
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Failed to update menu', error });
  }
};

// Delete Menu
exports.deleteMenu = async (req, res) => {
  // #swagger.tags = ['Menu']
  const menuId = parseInt(req.params.id);

  try {
    await prisma.menu.delete({
      where: { id: menuId }
    });

    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Failed to delete menu', error });
  }
};
