const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🗑 Deleting existing users...');
  await prisma.user.deleteMany(); // Deletes all users

  console.log('✅ All users deleted successfully.');

  // Check if the admin user already exists
  const hashedPassword = await bcrypt.hash('Anihortes', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@foodhub.com',
      password: hashedPassword,
      contact: '9840039126',
      dob: new Date('2004-02-16'),
      gender: 'Male',
      role: 'Admin',
      isActive: true,
      createdAt: new Date()
    }
  });

  console.log('✅ Admin user created successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
