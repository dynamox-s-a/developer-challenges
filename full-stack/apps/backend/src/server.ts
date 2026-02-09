import { buildApp } from "./app.js";

const app = buildApp();
app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });