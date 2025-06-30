const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hashExistingPasswords = async () => {
  try {
    const users = await prisma.user.findMany();
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // Only hash plaintext passwords
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        console.log(`Password updated for user: ${user.username}`);
      }
    }
    console.log('Password hashing completed.');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
};

hashExistingPasswords();
