# 🎟️ Challenge 2: Event Management System - Implementation Plan

## Current State Analysis

**✅ Already Installed:**
- Next.js 16 with React 19
- TypeScript 5
- MUI 7 (Material UI)
- Redux Toolkit + React-Redux
- json-server (mock API)
- Biome (linting/formatting)
- React Compiler enabled

**📦 Project Structure:** Fresh Next.js scaffold with App Router

---

## Implementation Phases

### Phase 1: Foundation & Infrastructure ✅ COMPLETED
**Focus:** Core setup, configuration, and project structure

| Task | Description | Status |
|------|-------------|--------|
| 1.1 | Create folder structure (features, components, lib, types) | ✅ Done |
| 1.2 | Setup MUI theme with custom configuration | ✅ Done |
| 1.3 | Configure Redux store with RTK | ✅ Done |
| 1.4 | Setup json-server with db.json (users + events) | ✅ Done |
| 1.5 | Create TypeScript types/interfaces | ✅ Done |
| 1.6 | Setup API client utilities | ✅ Done |

**Deliverables:** ✅ All completed
- `src/lib/store.ts` - Redux store configuration with auth + events reducers
- `src/lib/theme.ts` - MUI theme with custom colors, typography, and component overrides
- `src/lib/hooks.ts` - Typed Redux hooks (useAppDispatch, useAppSelector, useAppStore)
- `src/lib/StoreProvider.tsx` - Redux Provider wrapper for Next.js App Router
- `src/lib/ThemeProvider.tsx` - MUI Theme Provider wrapper with CssBaseline
- `src/lib/jwt.ts` - Fake JWT generation, validation, and decoding utilities
- `src/lib/api.ts` - Core API client with auth token handling and `apiRequest` helper
- `src/features/events/eventsApi.ts` - Events domain API (getAll, getById, create, update, delete)
- `src/types/user.ts` - User, AuthUser, LoginCredentials, AuthState interfaces
- `src/types/event.ts` - Event, EventCategory, CRUD payloads, EventFilters interfaces
- `src/types/index.ts` - Barrel exports
- `src/features/auth/authSlice.ts` - Auth state with login, logout, initializeAuth thunks
- `src/features/events/eventsSlice.ts` - Events CRUD async thunks and state management
- `db.json` - json-server database with 2 users + 6 sample events
- `src/app/layout.tsx` - Updated with Store + Theme providers

**NPM Scripts Added:**
- `npm run server` - Start json-server on port 3001
- `npm run dev:all` - Start both json-server and Next.js concurrently

---

### Phase 2: Authentication System ✅ COMPLETED
**Focus:** Login, JWT simulation, protected routes

| Task | Description | Status |
|------|-------------|--------|
| 2.1 | Create auth slice (Redux) with login/logout actions | ✅ Done (Phase 1) |
| 2.2 | Implement fake JWT token generation | ✅ Done (Phase 1) |
| 2.3 | Create login page with form validation | ✅ Done |
| 2.4 | Build AuthProvider context wrapper | ✅ Done |
| 2.5 | Implement protected route HOC/middleware | ✅ Done |
| 2.6 | Add role-based redirect logic | ✅ Done |
| 2.7 | Create logout functionality | ✅ Done (Phase 1) |

**Deliverables:** ✅ All completed
- `src/features/auth/authSlice.ts` - ✅ Auth state management (created in Phase 1)
- `src/lib/jwt.ts` - ✅ Fake JWT utilities (created in Phase 1)
- `src/app/login/page.tsx` - ✅ Login page with email/password validation
- `src/components/auth/AuthProvider.tsx` - ✅ Auth initialization wrapper
- `src/components/auth/ProtectedRoute.tsx` - ✅ Route protection HOC with role support
- `src/components/auth/index.ts` - ✅ Barrel exports
- `src/app/page.tsx` - ✅ Root redirect based on auth state and role
- `src/app/admin/layout.tsx` - ✅ Admin-only protected layout
- `src/app/admin/page.tsx` - ✅ Admin dashboard placeholder
- `src/app/events/layout.tsx` - ✅ Events protected layout (admin + reader)
- `src/app/events/page.tsx` - ✅ Events page placeholder
- `src/app/layout.tsx` - ✅ Updated with AuthProvider

**Pre-configured Users (db.json):**
```json
{
  "users": [
    { "id": 1, "email": "admin@events.com", "password": "admin123", "role": "admin" },
    { "id": 2, "email": "reader@events.com", "password": "reader123", "role": "reader" }
  ]
}
```

---

### Phase 3: Event Data Layer ✅ COMPLETED
**Focus:** Event CRUD operations and state management

| Task | Description | Status |
|------|-------------|--------|
| 3.1 | Create events slice with RTK Query or createAsyncThunk | ✅ Done (Phase 1) |
| 3.2 | Define Event model with validation rules | ✅ Done (Phase 1) |
| 3.3 | Implement CRUD API endpoints integration | ✅ Done (Phase 1) |
| 3.4 | Add event filtering/sorting logic | ✅ Done |
| 3.5 | Create past/upcoming event separation | ✅ Done |

**Event Schema:** ✅ Implemented in `src/types/event.ts`
```typescript
interface Event {
  id: string;
  name: string;           // required
  dateTime: string;       // required, ISO format, future date
  location: string;       // required
  description: string;    // required, min 50 chars
  category: EventCategory; // Conference | Workshop | Webinar | Networking | Other
  createdAt: string;
  updatedAt: string;
}
```

**Deliverables:** ✅ All completed
- `src/features/events/eventsSlice.ts` - ✅ Event state management with CRUD thunks (created in Phase 1)
- `src/features/events/eventsApi.ts` - ✅ Events domain API with getAll, getById, create, update, delete (created in Phase 1)
- `src/types/event.ts` - ✅ Event type definitions (created in Phase 1)
- `src/features/events/eventsSelectors.ts` - ✅ Selectors for filtering, sorting, past/upcoming separation
- `src/features/events/useEvents.ts` - ✅ Custom hook for events with filter state management
- `src/features/events/index.ts` - ✅ Barrel exports for events feature

---

### Phase 4: Admin Features ✅ COMPLETED
**Focus:** Admin dashboard with full CRUD capabilities

| Task | Description | Status |
|------|-------------|--------|
| 4.1 | Create admin dashboard layout | ✅ Done |
| 4.2 | Build event creation form with validation | ✅ Done |
| 4.3 | Build event editing form | ✅ Done |
| 4.4 | Implement event deletion with confirmation | ✅ Done |
| 4.5 | Create events list/table for admin | ✅ Done |
| 4.6 | Add form validation (future date, min 50 chars) | ✅ Done |

**Validation Rules:** ✅ All implemented
- Name: required
- Date/Time: required, must be future date
- Location: required
- Description: required, minimum 50 characters
- Category: required, enum selection

**Deliverables:** ✅ All completed
- `src/app/admin/page.tsx` - ✅ Admin dashboard with stats cards and quick actions
- `src/app/admin/events/page.tsx` - ✅ Events management with sorting
- `src/app/admin/events/new/page.tsx` - ✅ Create event page
- `src/app/admin/events/[id]/edit/page.tsx` - ✅ Edit event page
- `src/components/events/EventForm.tsx` - ✅ Reusable event form with validation
- `src/components/events/EventsTable.tsx` - ✅ Admin events table with delete confirmation
- `src/components/events/index.ts` - ✅ Barrel exports

**Additional Dependencies:**
- `@mui/icons-material` - Added for UI icons

---

### Phase 5: Reader Features ✅ COMPLETED
**Focus:** Reader-facing event views with filtering

| Task | Description | Status |
|------|-------------|--------|
| 5.1 | Create reader events list page | ✅ Done |
| 5.2 | Implement upcoming vs past events tabs/sections | ✅ Done |
| 5.3 | Add search functionality | ✅ Done |
| 5.4 | Add filter by category | ✅ Done |
| 5.5 | Implement sorting (date, name) | ✅ Done |
| 5.6 | Create event detail view (optional) | ⏭️ Skipped |

**Deliverables:** ✅ All completed
- `src/app/events/page.tsx` - ✅ Reader events list with tabs, filters, and grid layout
- `src/components/events/EventCard.tsx` - ✅ Event display card with date/time/location/category
- `src/components/events/EventFilters.tsx` - ✅ Search, category filter, sort controls
- `src/components/events/EventTabs.tsx` - ✅ Past/Upcoming tabs with badge counts

---

### Phase 6: UI Components & Layout ✅ COMPLETED
**Focus:** Shared components and responsive design

| Task | Description | Status |
|------|-------------|--------|
| 6.1 | Create app shell layout (header, navigation) | ✅ Done |
| 6.2 | Build responsive navigation with role awareness | ✅ Done |
| 6.3 | Create reusable UI components (buttons, inputs, cards) | ✅ Done (EventCard) |
| 6.4 | Implement loading states and error boundaries | ✅ Done (in pages) |
| 6.5 | Add toast/snackbar notifications | ⏭️ Skipped |

**Deliverables:** ✅ All completed
- `src/components/layout/AppLayout.tsx` - ✅ Main layout wrapper with Header and Container
- `src/components/layout/Header.tsx` - ✅ Responsive header with mobile drawer, role-aware navigation
- `src/components/layout/index.ts` - ✅ Barrel exports
- `src/app/events/layout.tsx` - ✅ Updated to use AppLayout
- `src/app/admin/layout.tsx` - ✅ Updated to use AppLayout
- All page components updated to remove duplicate containers/headers

---

### Phase 7: Testing ✅ COMPLETED
**Focus:** E2E tests with Cypress for comprehensive testing

| Task | Description | Status |
|------|-------------|--------|
| 7.1 | Setup Cypress testing framework | ✅ Done |
| 7.2 | Write auth flow E2E tests | ✅ Done |
| 7.3 | Write admin events CRUD E2E tests | ✅ Done |
| 7.4 | Write reader events E2E tests | ✅ Done |
| 7.5 | Configure test scripts in package.json | ✅ Done |

**Deliverables:** ✅ All completed
- `cypress.config.ts` - ✅ Cypress configuration
- `cypress/e2e/auth.cy.ts` - ✅ Authentication flow tests (login, logout, protected routes, role-based access)
- `cypress/e2e/admin-events.cy.ts` - ✅ Admin CRUD tests (create, edit, delete, validation)
- `cypress/e2e/reader-events.cy.ts` - ✅ Reader features tests (view, filter, search, tabs, sorting)
- `cypress/support/commands.ts` - ✅ Custom commands (loginAsAdmin, loginAsReader, logout, clearAuth)
- `cypress/support/e2e.ts` - ✅ E2E support file with Testing Library integration
- `cypress/fixtures/events.json` - ✅ Test fixtures

**NPM Scripts Added:**
- `npm run cy:open` - Open Cypress interactive runner
- `npm run cy:run` - Run Cypress tests headlessly
- `npm run test:e2e` - Run full E2E test suite with servers
- `npm run test:e2e:open` - Open Cypress with servers running

**Test Coverage:**
- **Auth Tests (18 tests)**: Login validation, admin/reader login, logout, protected routes, session persistence
- **Admin Events Tests (16 tests)**: Dashboard, CRUD operations, form validation, delete confirmation
- **Reader Events Tests (20 tests)**: Layout, tabs, search, category filter, sorting, event cards

---

### Phase 8 (Bonus): Additional Enhancements
**Focus:** Storybook, deployment

| Task | Description | Priority |
|------|-------------|----------|
| 8.1 | Setup Storybook for UI components | 🟢 Bonus |
| 8.2 | Deploy to Vercel/cloud | 🟢 Bonus |

---

## Proposed Folder Structure

```
front-end-challenge-v1/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── events/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   ├── events/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── events/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.ts
│   │   └── events/
│   │       ├── eventsSlice.ts
│   │       └── eventsApi.ts
│   ├── lib/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   ├── theme.ts
│   │   ├── api.ts
│   │   ├── jwt.ts
│   │   ├── StoreProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── types/
│       ├── user.ts
│       ├── event.ts
│       └── index.ts
├── db.json
├── specs/
│   └── IMPLEMENTATION_PLAN.md
├── tests/
└── package.json
```

---

## Execution Order Summary

| Phase | Name | Status | Dependencies |
|-------|------|--------|--------------|
| 1 | Foundation | ✅ Complete | None |
| 2 | Authentication | ✅ Complete | Phase 1 |
| 3 | Event Data Layer | ✅ Complete | Phase 1, 2 |
| 4 | Admin Features | ✅ Complete | Phase 1, 2, 3 |
| 5 | Reader Features | ✅ Complete | Phase 1, 2, 3 |
| 6 | UI Components | ✅ Complete | Phase 1 (can parallel) |
| 7 | Testing (Cypress E2E) | ✅ Complete | Phase 2, 3, 4, 5 |
| 8 | Bonus | ⏳ Pending | All above |

---

## Technical Requirements Checklist

From the challenge requirements:

### Authentication & Authorization
- [x] Authenticate using pre-configured email and password ✅ `src/app/login/page.tsx`
- [x] Implement fake JWT token generation ✅ `src/lib/jwt.ts`
- [x] Store token in localStorage ✅ `src/lib/api.ts` (setStoredAuth/getStoredAuth)
- [x] Include token in API requests headers ✅ `src/lib/api.ts` (apiRequest)
- [x] Protected routes for authenticated users only ✅ `src/components/auth/ProtectedRoute.tsx`
- [x] Logout functionality ✅ `src/features/auth/authSlice.ts` (logout action)
- [x] Role-based redirect (Admin → Dashboard, Reader → Events List) ✅ `src/app/page.tsx`

### Admin Features (Role: admin)
- [x] Create new events with all required fields ✅ `src/app/admin/events/new/page.tsx`
- [x] Event name (required) ✅ Implemented with validation
- [x] Date and time (required, must be future date) ✅ Implemented with future date validation
- [x] Location (required) ✅ Implemented with validation
- [x] Description (required, min 50 characters) ✅ Implemented with character count
- [x] Category (required, select from: Conference, Workshop, Webinar, Networking, Other) ✅ Implemented with dropdown
- [x] Edit existing event details ✅ `src/app/admin/events/[id]/edit/page.tsx`
- [x] Delete events ✅ `src/components/events/EventsTable.tsx` (with confirmation dialog)
- [x] View events ✅ `src/app/admin/events/page.tsx`

### Reader Features (Role: reader)
- [x] View events ✅ `src/app/events/page.tsx`
- [x] View past events separately from upcoming events ✅ `src/components/events/EventTabs.tsx`
- [x] Search and filter events ✅ `src/components/events/EventFilters.tsx`
- [x] Sort events by Date ✅ Sort toggle in EventFilters
- [x] Sort events by Name ✅ Sort toggle in EventFilters

### Technical Requirements
- [x] Use TypeScript ✅
- [x] Use React ✅
- [x] Use Next.js ✅
- [x] Implement state management using Redux Toolkit ✅ `src/lib/store.ts`
- [x] Create mock REST API using json-server ✅ `db.json`
- [x] Use Material UI 6 for styling with custom theme configuration ✅ `src/lib/theme.ts`
- [x] Ensure responsive design for all screen sizes ✅ `src/components/layout/Header.tsx` (mobile drawer)
- [x] Ensure correct business logic and behavior with automated tests ✅ Cypress E2E tests

### Bonus
- [x] Add e2e tests with Cypress ✅ `cypress/e2e/` (54 tests across 3 spec files)
- [x] Implement role-based route protection using HOCs or middleware ✅ `src/components/auth/ProtectedRoute.tsx`
- [ ] Deploy to cloud provider
- [ ] Add Storybook documentation for UI components
