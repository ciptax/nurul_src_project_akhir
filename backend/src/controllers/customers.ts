import type { Context } from "hono";
import prisma from "../prisma.js";

class CustomerController {
  // Menampilkan semua customers
  async index(c: Context) {
    try {
      const customers = await prisma.user.findMany({
        where: { role: "customer" },
        select: {
          id: true,
          nama: true,
          email: true,
        },
      });

      return c.json(customers);
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Error fetching customers",
          error: (error as Error).message,
        },
        500
      );
    }
  }

  // Menampilkan satu customer berdasarkan ID
  async show(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ message: "Invalid ID" }, 400);
      }

      const customer = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          nama: true,
          email: true,
        },
      });

      if (!customer) {
        return c.json({ message: "Customer not found" }, 404);
      }

      return c.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }

  // Menambahkan customer baru
  async store(c: Context) {
    try {
      const { nama, email, password, role } = await c.req.json();

      if (!nama || !email || !password) {
        return c.json(
          { message: "Nama, email, and password are required" },
          400
        );
      }

      // Mengecek apakah email sudah digunakan
      const existingCustomer = await prisma.user.findUnique({
        where: { email },
      });
      if (existingCustomer) {
        return c.json({ message: "Email already exists" }, 400);
      }

      // Membuat customer baru
      const newCustomer = await prisma.user.create({
        data: {
          nama,
          email,
          password, // Anda harus mengenkripsi password di sini sebelum menyimpannya
          role: role || "customer",
        },
      });

      return c.json(
        { message: "Customer successfully created", customer: newCustomer },
        201
      );
    } catch (error) {
      console.error("Error creating customer:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }

  // Mengupdate customer berdasarkan ID
  async update(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ message: "Invalid ID" }, 400);
      }

      const customer = await prisma.user.findUnique({ where: { id } });
      if (!customer) {
        return c.json({ message: "Customer not found" }, 404);
      }

      const { nama, email, password } = await c.req.json();

      const updatedCustomer = await prisma.user.update({
        where: { id },
        data: {
          nama,
          email,
          password, // Perhatikan bahwa password harus di-hash terlebih dahulu
        },
      });

      return c.json({
        message: "Customer successfully updated",
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }

  // Menghapus customer berdasarkan ID
  async destroy(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) {
        return c.json({ message: "Invalid ID" }, 400);
      }

      await prisma.user.delete({
        where: { id },
      });

      return c.json({ message: "Customer successfully deleted" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
}

export default new CustomerController();
