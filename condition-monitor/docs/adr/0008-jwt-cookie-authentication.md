# 0008. JWT in an httpOnly cookie, private by default

- Status: accepted
- Date: 2026-09-29

## Context

The challenge requires login with a fixed email and password, logout, and no private
route reachable without authentication. The session decisions are recorded in
[assumptions](../assumptions.md) A1 to A3.

## Decision

The API signs a JWT with `@nestjs/jwt` and returns it in an `httpOnly`,
`SameSite=Strict` cookie that expires in one hour. A global guard requires a valid
token on every route; the few public routes, such as login, are marked explicitly.
Logout clears the cookie.

## Alternatives considered

- **Token in `localStorage`**, sent in a header. Readable by any script on the page,
  so an XSS flaw would leak it.
- **Server-side sessions.** Revocable, but they need a session store, one more moving
  part for a single fixed user.
- **Guard per route.** A route whose guard is forgotten would be public without anyone
  noticing.

## Consequences

- A new route is private unless someone deliberately marks it public.
- A token copied before logout stays valid until it expires, at most one hour.
- The web app and the API must share a site for `SameSite=Strict` cookies to be sent;
  in development the web app proxies API calls through Vite.
