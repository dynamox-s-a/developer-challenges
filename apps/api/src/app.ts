import { loginRequestSchema, registerRequestSchema } from "@dyn/contracts";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { timing } from "hono/timing";

import type { AppRepository, Services } from "./dependencies.js";
import type { AuthService } from "./modules/auth.js";
import { createMachineRoutes } from "./modules/machines/routes.js";
import { createMonitoringPointRoutes } from "./modules/monitoring-points/routes.js";
import { createTimeSeriesRoutes } from "./modules/time-series/routes.js";
import type { AppEnv } from "./shared/context.js";
import { DomainError } from "./shared/errors.js";
import { validated } from "./shared/http.js";

export interface AppDependencies {
  repository: AppRepository;
  services: Services;
  auth: AuthService;
}

function bearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match?.[1]?.trim() || null;
}

export function createApp(dependencies: AppDependencies) {
  const app = new Hono<AppEnv>();

  app.use("*", requestId({ limitLength: 128 }));
  app.use("*", timing());
  app.use("*", logger());

  app.onError((error, c) => {
    const requestId = c.get("requestId");

    if (error instanceof DomainError) {
      return c.json(
        {
          error: {
            code: error.code,
            message: error.message,
            requestId,
            ...(error.issues ? { issues: error.issues } : {}),
          },
        },
        error.status
      );
    }

    if (error instanceof SyntaxError || (error instanceof HTTPException && error.status === 400)) {
      return c.json(
        {
          error: {
            code: "INVALID_JSON" as const,
            message: "Request body must contain valid JSON",
            requestId,
          },
        },
        400
      );
    }

    console.error("request.unhandled_error", {
      requestId,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    });
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR" as const,
          message: "An unexpected error occurred",
          requestId,
        },
      },
      500
    );
  });

  app.notFound((c) =>
    c.json(
      {
        error: {
          code: "NOT_FOUND" as const,
          message: "Route was not found",
          requestId: c.get("requestId"),
        },
      },
      404
    )
  );

  // Feature routers are mounted after the bearer guard so every /api/v1 route inherits it, and the
  // chained composition keeps the RPC type of every route in AppType.
  const routes = app
    .get("/health", async (c) => {
      await dependencies.repository.health();
      return c.json({ status: "ok" as const, timestamp: new Date().toISOString() });
    })
    .post("/api/v1/auth/register", validated("json", registerRequestSchema), async (c) => {
      const input = c.req.valid("json");
      const session = await dependencies.auth.register(input.email, input.password);
      return c.json(session, 201);
    })
    .post("/api/v1/auth/login", validated("json", loginRequestSchema), async (c) => {
      const input = c.req.valid("json");
      const session = await dependencies.auth.login(input.email, input.password);
      return c.json(session);
    })
    .use("/api/v1/*", async (c, next) => {
      const token = bearerToken(c.req.header("authorization"));
      if (!token) {
        throw new DomainError({
          code: "AUTHENTICATION_REQUIRED",
          message: "A Bearer access token is required",
          status: 401,
        });
      }

      const user = await dependencies.auth.verifyToken(token);
      c.set("user", user);
      await next();
    })
    .get("/api/v1/auth/me", (c) => c.json({ user: c.get("user") }))
    .route("/", createMachineRoutes(dependencies.services.machines))
    .route("/", createMonitoringPointRoutes(dependencies.services.monitoringPoints))
    .route("/", createTimeSeriesRoutes(dependencies.services.timeSeries));

  return routes;
}

export type AppType = ReturnType<typeof createApp>;
