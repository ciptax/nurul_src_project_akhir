import { verifyToken } from "../utils/jwt.js";
import prisma from "../prisma.js";
export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyToken(token);
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            return c.json({ message: "Unauthorized" }, 401);
        }
        c.set("user", user);
        await next();
    }
    catch {
        return c.json({ message: "Invalid or expired token" }, 401);
    }
};
