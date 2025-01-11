import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";

const prisma = new PrismaClient();

/**
 * Handler untuk menyimpan pesan dari pengunjung.
 * Endpoint: POST /api/contact
 */
export const contactHandler = async (c: Context) => {
  try {
    const { name, email, message } = await c.req.json();

    // Validasi sederhana
    if (!name || !email || !message) {
      return c.json({ error: "Semua field harus diisi" }, 400);
    }

    // Simpan data ke database
    const newContact = await prisma.contact.create({
      data: { name, email, message },
    });

    return c.json(
      { message: "Pesan berhasil disimpan", contact: newContact },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "Terjadi kesalahan saat menyimpan pesan" }, 500);
  }
};

/**
 * Handler untuk mendapatkan semua pesan dari pengunjung.
 * Endpoint: GET /api/contacts
 */
export const getContactsHandler = async (c: Context) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" }, // Urutkan berdasarkan waktu
    });
    return c.json(contacts, 200);
  } catch (error) {
    console.error("Error:", error);
    return c.json({ error: "Terjadi kesalahan saat mengambil pesan" }, 500);
  }
};
