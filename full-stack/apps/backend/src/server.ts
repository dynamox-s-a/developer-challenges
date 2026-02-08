import { buildApp } from "./app.js";

const app = buildApp();
app.listen({ port: 3001, host: "0.0.0.0" });