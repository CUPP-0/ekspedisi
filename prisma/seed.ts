import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.users.create({
    data: {
      name: "Administrator",
      email: "admin@ekspedisi.com",
      password,
      role: "manager",
    },
  });

  console.log("Manager created.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });