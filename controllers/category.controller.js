const { prisma } = require('../utils/prisma');

// Create Category (Admin only)
exports.createCategory = async (req, res) => {
  // #swagger.tags = ['Food Category']
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await prisma.foodCategory.create({
      data: { name }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Failed to create category', error });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  // #swagger.tags = ['Food Category']
  try {
    const categories = await prisma.foodCategory.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

// Update Category (Admin only)
exports.updateCategory = async (req, res) => {
  // #swagger.tags = ['Food Category']
  const categoryId = parseInt(req.params.id);
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const updatedCategory = await prisma.foodCategory.update({
      where: { id: categoryId },
      data: { name }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

// Delete Category (Admin only)
exports.deleteCategory = async (req, res) => {
  // #swagger.tags = ['Food Category']
  const categoryId = parseInt(req.params.id);

  try {
    await prisma.foodCategory.delete({
      where: { id: categoryId }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};
