const { prisma } = require('../utils/prisma');

const menuItems = [
  {
    name: 'Pasta',
    description: 'Creamy Alfredo Pasta',
    price: 250,

    isApproved: true
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Margherita Pizza with fresh basil',
    price: 1000,

    isApproved: true
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh lettuce, croutons, and Caesar dressing',
    price: 200,

    isApproved: true
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake',
    price: 600,

    isApproved: true
  }
];

const populateMenu = async () => {
  try {
    for (const item of menuItems) {
      await prisma.menu.create({
        data: item
      });
      console.log(`Added menu item: ${item.name}`);
    }
    console.log('Menu population completed successfully.');
  } catch (error) {
    console.error('Error populating menu:', error);
  } finally {
    await prisma.$disconnect();
  }
};

populateMenu();
