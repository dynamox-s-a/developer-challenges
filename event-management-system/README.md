# 🎟️ Event Management System

This project is a Front-end challenge that implements an Event Management System with role-based access control, built using Next.js (App Router) and TypeScript.

The application allows administrators to manage events (create, edit, delete) while readers can view, search, filter, and sort events.

---

## Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Redux Toolkit** (state management)
- **Material UI 6** (UI components & theming)
- **json-server** (mock REST API)
- **Jest & Testing Library** (unit tests)

---

## User Roles

The system uses two pre-configured users stored in a mock API:

### Admin
- Email: `admin@events.com`
- Password: `admin123`
- Role: `admin`

### Reader
- Email: `reader@events.com`
- Password: `reader123`
- Role: `reader`

---

## Authentication & Authorization

- Fake JWT token generation
- Token stored in `localStorage`
- Protected routes based on authentication
- Role-based access control (admin / reader)
- Automatic redirection after login:
  - Admin → Admin Dashboard
  - Reader → Events List

---

## Project Structure

event-management-system/
├─ app/
│  ├─ (public)/
│  │  └─ login/
│  │     └─ page.tsx
│  ├─ (private)/
│  │  └─ events/
│  │     ├─ page.tsx
│  │     └─ layout.tsx
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ not-found.tsx
│
├─ components/
│  ├─ app/
│  │  └─ AppInitializer.tsx
│  ├─ auth/
│  │  └─ AuthGuard.tsx
│  ├─ events/
│  │  ├─ EventCard.tsx
│  │  └─ EventForm.tsx
│  ├─ layout/
│  │  └─ Header.tsx
│  └─ Providers.tsx
│
├─ store/
│  ├─ auth/
│  │  ├─ authSlice.ts
│  │  └─ authTypes.ts
│  ├─ eventsSlice.ts
│  ├─ hooks.ts
│  └─ index.ts
│
├─ services/
│  ├─ authService.ts
│  └─ eventsService.ts
│
├─ theme/
│  └─ index.ts
│
└─ server/
   └─ db.json