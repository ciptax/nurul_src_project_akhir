import type { Context } from "hono";
import prisma from "../prisma.js";
import { getCookie } from "hono/cookie";

class CheckoutController {
  async index(c: Context) {
    try {
      const userId = getCookie(c, "userId");

      if (!userId) {
        return c.json({ message: "User is not logged in" }, 401);
      }

      const checkouts = await prisma.checkout.findMany({
        where: {
          userId: Number(userId),
          status: 0, // Menampilkan hanya produk yang ada di keranjang (status: 0)
        },
        include: {
          product: {
            select: {
              namaBarang: true,
              hargaBarang: true,
              picUrl: true,
            },
          },
        },
      });

      return c.json(checkouts);
    } catch (error) {
      console.log(error);
      return c.json({ message: error.message || "Internal Server Error" }, 500);
    }
  }

  async show(c: Context) {}

  async store(c: Context) {
    try {
      const { productId, quantity } = await c.req.json();
      const userId = getCookie(c, "userId");

      if (!userId) {
        return c.json({ message: "User is not logged in" }, 401);
      }

      if (!productId || !quantity) {
        return c.json({ message: "Product ID and quantity are required" }, 400);
      }

      // Memeriksa apakah produk yang ingin ditambahkan masih tersedia di stok
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
      });

      if (!product || product.stokBarang < quantity) {
        return c.json({ message: "Insufficient stock" }, 400);
      }

      // Menambahkan ke keranjang checkout
      await prisma.checkout.create({
        data: {
          userId: Number(userId),
          productId: Number(productId),
          quantity: Number(quantity),
          status: 0, // Status 0 berarti ada di keranjang, belum dipesan
        },
      });

      return c.json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.log(error);
      return c.json({ message: error.message || "Internal Server Error" }, 500);
    }
  }

  async update(c: Context) {}

  async destroy(c: Context) {
    try {
      const { id } = c.req.param();

      // Validasi ID yang diterima
      if (isNaN(Number(id))) {
        return c.json({ message: "Invalid ID" }, 400);
      }

      const checkoutToDelete = await prisma.checkout.findUnique({
        where: { id: Number(id) },
      });

      if (!checkoutToDelete) {
        return c.json({ message: "Product not found in cart" }, 404);
      }

      // Menghapus produk dari keranjang
      await prisma.checkout.delete({
        where: { id: Number(id) },
      });

      return c.json({ message: "Product removed from cart successfully" });
    } catch (error) {
      console.log(error);
      return c.json({ message: error.message || "Internal Server Error" }, 500);
    }
  }
}

export default new CheckoutController();
