import prisma from "../prisma.js";
import { getCookie } from "hono/cookie";
class OrderController {
    // Menampilkan daftar pesanan pengguna
    async index(c) {
        try {
            const userId = getCookie(c, "userId");
            if (!userId) {
                return c.json({ message: "User is not logged in" }, 401);
            }
            const orders = await prisma.order.findMany({
                where: { userId: Number(userId) },
                include: {
                    checkout: {
                        include: {
                            product: {
                                select: {
                                    namaBarang: true,
                                    hargaBarang: true,
                                    picUrl: true,
                                },
                            },
                        },
                    },
                },
            });
            return c.json(orders);
        }
        catch (error) {
            console.log(error);
            return c.json({ message: error.message || "Internal Server Error" }, 500);
        }
    }
    // Membuat pesanan baru berdasarkan data checkout
    async store(c) {
        try {
            const { checkoutId, paymentMethod } = await c.req.json();
            const userId = getCookie(c, "userId");
            if (!userId) {
                return c.json({ message: "User is not logged in" }, 401);
            }
            if (!checkoutId || !paymentMethod) {
                return c.json({ message: "Checkout ID and payment method are required" }, 400);
            }
            // Validasi data checkout
            const checkout = await prisma.checkout.findUnique({
                where: { id: Number(checkoutId) },
                include: { product: true },
            });
            if (!checkout || checkout.userId !== Number(userId)) {
                return c.json({ message: "Invalid checkout ID" }, 400);
            }
            // Buat pesanan baru
            const order = await prisma.order.create({
                data: {
                    status: "PENDING",
                    userId: Number(userId),
                    checkoutId: Number(checkoutId),
                    paymentMethod,
                    paymentStatus: "UNPAID",
                },
            });
            return c.json({ message: "Order created successfully", order });
        }
        catch (error) {
            console.log(error);
            return c.json({ message: error.message || "Internal Server Error" }, 500);
        }
    }
    // Memperbarui status pesanan
    async update(c) {
        try {
            const { id } = c.req.param();
            const { status } = await c.req.json();
            if (!id || !status) {
                return c.json({ message: "Order ID and status are required" }, 400);
            }
            const validStatuses = [
                "PENDING",
                "PAID",
                "SHIPPED",
                "DELIVERED",
                "CANCELED",
            ];
            if (!validStatuses.includes(status)) {
                return c.json({ message: "Invalid order status" }, 400);
            }
            // Perbarui status pesanan
            const order = await prisma.order.update({
                where: { id: Number(id) },
                data: { status },
            });
            return c.json({ message: "Order status updated successfully", order });
        }
        catch (error) {
            console.log(error);
            return c.json({ message: error.message || "Internal Server Error" }, 500);
        }
    }
}
export default new OrderController();
