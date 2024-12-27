import { User } from '@prisma/client';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

declare module 'express' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
