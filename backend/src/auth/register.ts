import type { Context } from "hono";
import { hashPassword } from "../utils/bcrypt.js";
import prisma from "../prisma.js";

export const registerHandler = async (c: Context) => {
  const { nama, email, role, password } = await c.req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return c.json({ message: "Email already exists" }, 400);
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({
    data: {
      nama,
      email,
      role: role || "customer",
      password: hashedPassword,
    },
  });

  return c.json({
    message: "User registered successfully",
  });
};
