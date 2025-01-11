import prisma from "../prisma.js";
class CategoryController {
    async index(c) {
        const categories = await prisma.category.findMany();
        return c.json(categories);
    }
    async store(c) {
        try {
            const { nama } = await c.req.json();
            if (!nama) {
                return c.json({ message: "field must be filled" }, 400);
            }
            await prisma.category.create({
                data: {
                    nama,
                },
            });
            return c.json({ message: "category success inserted" }, 200);
        }
        catch (error) {
            console.error(error);
            return c.json({ message: error || "Internal Server Error" }, 500);
        }
    }
    async show(c) {
        try {
            const id = Number(c.req.param("id"));
            const category = await prisma.category.findUnique({ where: { id } });
            return c.json(category);
        }
        catch (error) {
            throw error;
        }
    }
    async update(c) {
        try {
            // Mengambil ID dari parameter
            const id = Number(c.req.param("id"));
            if (isNaN(id)) {
                return c.json({ message: "Invalid ID" }, 400);
            }
            // Mencari category berdasarkan ID
            const category = await prisma.category.findUnique({ where: { id } });
            if (!category) {
                return c.json({ message: "Category not found" }, 404);
            }
            // Mengambil input data dari body request
            const { nama } = await c.req.json();
            if (!nama || typeof nama !== "string") {
                return c.json({ message: "Invalid or missing 'nama' field" }, 400);
            }
            // Melakukan update pada category
            await prisma.category.update({
                where: { id },
                data: { nama },
            });
            // Mengembalikan respons sukses
            return c.json({ message: "Category successfully updated" }, 200);
        }
        catch (error) {
            console.error("Error updating category:", error);
            return c.json({ message: "Internal Server Error" }, 500);
        }
    }
    async destroy(c) {
        try {
            const id = Number(c.req.param("id"));
            await prisma.category.delete({ where: { id } });
            return c.json({ message: "category deleted" });
        }
        catch (error) { }
    }
}
export default new CategoryController();
