const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller to add a new menu item
exports.addMenuItem = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        description,
        isApproved: false, // Default to not approved
      },
    });

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: "Failed to add menu item", error });
  }
};

exports.approveMenuItem = async (req, res) => {
  const menuItemId = parseInt(req.params.id); // Menu item ID from the URL params

  try {
    // Fetch the menu item by ID
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (menuItem.isApproved) {
      return res.status(400).json({ message: "Menu item is already approved" });
    }

    // Approve the menu item
    const approvedMenuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: { isApproved: true },
    });

    res.status(200).json({
      message: "Menu item approved successfully",
      menuItem: approvedMenuItem,
    });
  } catch (error) {
    console.error("Error approving menu item:", error);
    res.status(500).json({ message: "Failed to approve menu item", error });
  }
};
