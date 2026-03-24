import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

    const token = await reply.jwtSign(
      { sub: user.id, username: user.username, role: user.role },
      { expiresIn: "8h" }
    );

    return reply.send({ token });
  });
}