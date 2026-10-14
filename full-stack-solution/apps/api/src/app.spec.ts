import request from "supertest";
import { createApp } from "./app";
import { Router } from "express";

describe("App", () => {
  const app = createApp({ auth: Router(), machines: Router() });

  it("answers the health check", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns a JSON 400 for unknown routes", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("returns 400 when the body is not valid JSON", async () => {
    const response = await request(app)
      .post("/api/anything")
      .set("Content-Type", "application/json")
      .send("{ broken");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_JSON");
  });

  it("returns 413 instead of 500 when the body exceeds the limit", async () => {
    const response = await request(app)
      .post("/api/anything")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ padding: "x".repeat(200 * 1024) }));

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });

  describe("CORS", () => {
    const ALLOWED = "https://developer-challenges.vercel.app";

    it("mounts no CORS middleware when no origin is configured", async () => {
      // The local setup: the dev server proxies /api, so the browser never
      // makes a cross-origin request and nothing should be negotiated.
      const response = await request(app)
        .get("/api/health")
        .set("Origin", ALLOWED);

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("allows a configured origin", async () => {
      const response = await request(
        createApp({ auth: Router() }, { allowedOrigins: [ALLOWED] }),
      )
        .get("/api/health")
        .set("Origin", ALLOWED);

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe(ALLOWED);
    });

    it("does not allow an origin that is not configured", async () => {
      const response = await request(
        createApp({ auth: Router() }, { allowedOrigins: [ALLOWED] }),
      )
        .get("/api/health")
        .set("Origin", "https://attacker.example");

      // The request still succeeds — CORS is enforced by the browser, which
      // withholds the response from the page when this header is missing.
      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("answers a preflight with the headers the client needs", async () => {
      const response = await request(
        createApp({ auth: Router() }, { allowedOrigins: [ALLOWED] }),
      )
        .options("/api/machines")
        .set("Origin", ALLOWED)
        .set("Access-Control-Request-Method", "POST")
        .set("Access-Control-Request-Headers", "authorization");

      expect(response.status).toBe(204);
      expect(response.headers["access-control-allow-headers"]).toContain(
        "Authorization",
      );
      expect(response.headers["access-control-allow-methods"]).toContain(
        "PATCH",
      );
      expect(response.headers["access-control-max-age"]).toBe("86400");
    });

    it("supports several origins, for preview deployments", async () => {
      const preview = "https://developer-challenges-git-main.vercel.app";
      const response = await request(
        createApp({ auth: Router() }, { allowedOrigins: [ALLOWED, preview] }),
      )
        .get("/api/health")
        .set("Origin", preview);

      expect(response.headers["access-control-allow-origin"]).toBe(preview);
    });
  });

  it("accepts a body on the readings path that the default limit would reject", async () => {
    // The ingest parser must be registered before the default one: body-parser
    // skips a request whose body was already consumed, which once made the
    // larger limit dead code and capped batches at the default 100 KB.
    const response = await request(
      createApp({ timeSeries: Router() }),
    )
      .post("/api/monitoring-points/p1/readings")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ padding: "x".repeat(300 * 1024) }));

    // Parsed, then no route matched it — the point is that it was not a 413.
    expect(response.status).toBe(404);
  });
});
