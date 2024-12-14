declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    email: string;
  }
}