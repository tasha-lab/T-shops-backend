import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
  const email = "admin@tshop.com";
  const password = process.env.ADMIN_PASSWORD!;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "Admin",
      firstname: "Super",
      lastname: "Admin",
      username: "superadmin",
      phonenumber: "0712345678",
    },
  });

  console.log("Admin created successfully");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
