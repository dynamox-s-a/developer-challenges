import { randomUUID } from "node:crypto";

import type { UserRow } from "@dyn/database";

import type { UserRepository } from "../src/modules/users/repository.js";

// Auth flows need a working user store even in the no-database boundary tests, so this fake
// mirrors the two repository methods over a Map.
export function inMemoryUsers(): UserRepository {
  const byEmail = new Map<string, UserRow>();

  return {
    async findUserByEmail(email) {
      return byEmail.get(email) ?? null;
    },

    async createUser(input) {
      if (byEmail.has(input.email)) {
        return null;
      }
      const user: UserRow = { id: randomUUID(), createdAt: new Date(), ...input };
      byEmail.set(user.email, user);
      return user;
    },
  };
}
