import { buildApp } from "./app.js";

const app = buildApp();

app.addHook('preHandler', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  reply.header('Access-Control-Allow-Credentials', 'true');
});

app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });