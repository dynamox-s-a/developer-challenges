/* eslint-disable @typescript-eslint/no-empty-interface */
import "next-auth";

declare global {
  interface User {
    id: number
  }

  module "next-auth" {
    interface Session {
      user: User
    }
  }
}
