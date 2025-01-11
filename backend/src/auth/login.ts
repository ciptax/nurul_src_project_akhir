import type { Context } from "hono";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import prisma from "../prisma.js";
import { setCookie } from "hono/cookie";

export const loginHandler = async (c: Context) => {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return c.json({ message: "Email tidak ditemuan" }, 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return c.json({ message: "Password yang anda masukan salah" }, 401);
  }

  setCookie(c, "userId", String(user.id), {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  const token = generateToken({ id: user.id, email: user.email });
  return c.json({
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    token,
  });
};
