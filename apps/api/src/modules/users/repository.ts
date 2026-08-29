import { type Database, type UserRow, users } from "@dyn/database";
import { eq } from "drizzle-orm";

export interface UserRepository {
  findUserByEmail: (email: string) => Promise<UserRow | null>;
  // Returns null when the email is already registered, riding the unique index instead of a
  // read-then-write race.
  createUser: (input: {
    email: string;
    passwordSalt: string;
    passwordHash: string;
  }) => Promise<UserRow | null>;
}

export function createUserRepository(db: Database): UserRepository {
  return {
    async findUserByEmail(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return user ?? null;
    },

    async createUser(input) {
      const [user] = await db.insert(users).values(input).onConflictDoNothing().returning();
      return user ?? null;
    },
  };
}
