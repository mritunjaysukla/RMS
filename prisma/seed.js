const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync('Anihortes', 10);

    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'Admin',
        email: 'admin@example.com',
        gender: 'Male'
      }
    });

    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
