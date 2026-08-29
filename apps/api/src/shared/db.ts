// A violation can match the code without exposing a constraint name, so matching is tracked apart
// from the name itself.
export type ConstraintViolation =
  | { matched: false }
  | { matched: true; constraint: string | undefined };

function postgresConstraint(error: unknown, code: "23503" | "23505"): ConstraintViolation {
  let current = error;

  while (typeof current === "object" && current !== null) {
    if (Reflect.get(current, "code") === code) {
      const constraint = Reflect.get(current, "constraint");
      return { matched: true, constraint: typeof constraint === "string" ? constraint : undefined };
    }

    current = Reflect.get(current, "cause");
  }

  return { matched: false };
}

export function postgresUniqueConstraint(error: unknown): ConstraintViolation {
  return postgresConstraint(error, "23505");
}

export function postgresForeignKeyConstraint(error: unknown): ConstraintViolation {
  return postgresConstraint(error, "23503");
}

export function expectCreated<T>(rows: T[], resource: string): T {
  const row = rows[0];
  if (!row) {
    throw new Error(`Database did not return the created ${resource}`);
  }
  return row;
}
