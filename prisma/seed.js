const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync("Anihortes", 10);

    await prisma.user.create({
      data: {
        username: "admin",
        password: "Anihortes",
        role: "ADMIN",
      },
    });

    console.log("Admin user created.");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
