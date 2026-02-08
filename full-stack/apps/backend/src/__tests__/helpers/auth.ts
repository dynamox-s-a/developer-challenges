import type { FastifyInstance } from "fastify";

export async function loginAndGetToken(app: FastifyInstance) {
  const res = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { username: "admin", password: "admin" },
  });

  if (res.statusCode !== 200) {
    throw new Error(`Login failed: ${res.statusCode} ${res.body}`);
  }

  const body = JSON.parse(res.body) as { token: string };
  return body.token;
}
