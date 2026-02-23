# 🎟️ Event Management System

This project is a Front-end challenge that implements an Event Management System with role-based access control, built using Next.js, TypeScript and Redux Toolkit.

The application allows administrators to manage events (create, edit, delete) while readers can browser (view, search, filter, and sort events).

---

## Tech Stack
- **Next.js**
- **React**
- **TypeScript**
- **Redux Toolkit**
- **Material UI 6**
- **json-server**
- **Cypress (E2E Testing)**
- **ESLint**

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
- Login using pre-configured users
- Fake JWT token generation
- Token persisted in localStorage
- Global authentication state handled by Redux
- Route protection with reusable AuthGuard
- Role-based access control
- Redirect handling after login

---

## Admin Capabilities
- Create new events
- Edit existing events (including past events)
- Delete events
- View all events

## Event Validation Rules
- Name, location, category, and description are required
- Description must have at least 50 characters
- Event date must be in the future when creating
- Editing past events is allowed
- Editing a future event to a past date is not allowed

## Reader Capabilities
- View events
- View upcoming and past events separately
- Search events by name or description
- Filter events by category
- Sort events by date or name

## Project Structure
event-management-system/
├─ app/
│  ├─ (public)/
│  │  └─ login/
│  ├─ (private)/
│  │  ├─ events/
│  │  └─ admin/events/
│
├─ components/
│  ├─ app/
│  ├─ auth/
│  ├─ events/
│  ├─ layout/
│  └─ Providers.tsx
│
├─ store/
│  ├─ auth/
│  ├─ eventsSlice.ts
│  ├─ hooks.ts
│  └─ index.ts
│
├─ services/
│  ├─ authService.ts
│  └─ eventsService.ts
│
├─ cypress/
│  ├─ e2e/
│  │  └─ auth.cy.ts
│  └─ support/
│
├─ theme/
│  └─ index.ts
│
└─ server/
   └─ db.json


## Getting Started
$ git clone https://github.com/patiregina89/event-management-system.git
$ cd event-management-system
$ npm install
$ npx json-server server/db.json --port 3001
  npm run dev


## End-to-End Tests (Cypress)
   This project includes real E2E tests using Cypress covering authentication flows.
   Implemented Test Scenarios
   ✔ Route protection (unauthenticated access)
   ✔ Successful login as admin
   ✔ Successful login as reader
   Example Covered Flow
   Attempt to access /admin/events without authentication
   Verify redirection to /login
   Perform login
   Validate correct redirection based on user role

### Running E2E Tests
   First, make sure the app and mock API are running:
   npx json-server server/db.json --port 3001
   npm run dev
   Then run Cypress:
   npx cypress open
   Or run in headless mode:
   npx cypress run
   Tests are located at:
   cypress/e2e/auth.cy.ts
