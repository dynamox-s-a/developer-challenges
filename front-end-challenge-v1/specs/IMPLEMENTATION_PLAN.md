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

### Phase 1: Foundation & Infrastructure
**Focus:** Core setup, configuration, and project structure

| Task | Description | Priority |
|------|-------------|----------|
| 1.1 | Create folder structure (features, components, lib, types) | 🔴 Critical |
| 1.2 | Setup MUI theme with custom configuration | 🔴 Critical |
| 1.3 | Configure Redux store with RTK | 🔴 Critical |
| 1.4 | Setup json-server with db.json (users + events) | 🔴 Critical |
| 1.5 | Create TypeScript types/interfaces | 🔴 Critical |
| 1.6 | Setup API client utilities | 🟡 Important |

**Deliverables:**
- `src/lib/store.ts` - Redux store configuration
- `src/lib/theme.ts` - MUI theme customization
- `src/types/` - TypeScript interfaces (User, Event, Auth)
- `db.json` - json-server database with pre-configured users
- `src/lib/api.ts` - API utilities with token handling

---

### Phase 2: Authentication System
**Focus:** Login, JWT simulation, protected routes

| Task | Description | Priority |
|------|-------------|----------|
| 2.1 | Create auth slice (Redux) with login/logout actions | 🔴 Critical |
| 2.2 | Implement fake JWT token generation | 🔴 Critical |
| 2.3 | Create login page with form validation | 🔴 Critical |
| 2.4 | Build AuthProvider context wrapper | 🔴 Critical |
| 2.5 | Implement protected route HOC/middleware | 🔴 Critical |
| 2.6 | Add role-based redirect logic | 🔴 Critical |
| 2.7 | Create logout functionality | 🟡 Important |

**Deliverables:**
- `src/features/auth/authSlice.ts` - Auth state management
- `src/app/login/page.tsx` - Login page
- `src/components/auth/AuthProvider.tsx` - Auth context
- `src/components/auth/ProtectedRoute.tsx` - Route protection HOC
- `src/lib/jwt.ts` - Fake JWT utilities

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

### Phase 3: Event Data Layer
**Focus:** Event CRUD operations and state management

| Task | Description | Priority |
|------|-------------|----------|
| 3.1 | Create events slice with RTK Query or createAsyncThunk | 🔴 Critical |
| 3.2 | Define Event model with validation rules | 🔴 Critical |
| 3.3 | Implement CRUD API endpoints integration | 🔴 Critical |
| 3.4 | Add event filtering/sorting logic | 🟡 Important |
| 3.5 | Create past/upcoming event separation | 🟡 Important |

**Event Schema:**
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

**Deliverables:**
- `src/features/events/eventsSlice.ts` - Event state management
- `src/features/events/eventsApi.ts` - RTK Query API or async thunks
- `src/types/event.ts` - Event type definitions

---

### Phase 4: Admin Features
**Focus:** Admin dashboard with full CRUD capabilities

| Task | Description | Priority |
|------|-------------|----------|
| 4.1 | Create admin dashboard layout | 🔴 Critical |
| 4.2 | Build event creation form with validation | 🔴 Critical |
| 4.3 | Build event editing form | 🔴 Critical |
| 4.4 | Implement event deletion with confirmation | 🔴 Critical |
| 4.5 | Create events list/table for admin | 🔴 Critical |
| 4.6 | Add form validation (future date, min 50 chars) | 🟡 Important |

**Validation Rules:**
- Name: required
- Date/Time: required, must be future date
- Location: required
- Description: required, minimum 50 characters
- Category: required, enum selection

**Deliverables:**
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/admin/events/page.tsx` - Events management
- `src/app/admin/events/new/page.tsx` - Create event
- `src/app/admin/events/[id]/edit/page.tsx` - Edit event
- `src/components/events/EventForm.tsx` - Reusable event form
- `src/components/events/EventsTable.tsx` - Admin events table

---

### Phase 5: Reader Features
**Focus:** Reader-facing event views with filtering

| Task | Description | Priority |
|------|-------------|----------|
| 5.1 | Create reader events list page | 🔴 Critical |
| 5.2 | Implement upcoming vs past events tabs/sections | 🔴 Critical |
| 5.3 | Add search functionality | 🟡 Important |
| 5.4 | Add filter by category | 🟡 Important |
| 5.5 | Implement sorting (date, name) | 🟡 Important |
| 5.6 | Create event detail view (optional) | 🟢 Nice-to-have |

**Deliverables:**
- `src/app/events/page.tsx` - Reader events list
- `src/components/events/EventCard.tsx` - Event display card
- `src/components/events/EventFilters.tsx` - Search/filter controls
- `src/components/events/EventTabs.tsx` - Past/Upcoming tabs

---

### Phase 6: UI Components & Layout
**Focus:** Shared components and responsive design

| Task | Description | Priority |
|------|-------------|----------|
| 6.1 | Create app shell layout (header, navigation) | 🔴 Critical |
| 6.2 | Build responsive navigation with role awareness | 🔴 Critical |
| 6.3 | Create reusable UI components (buttons, inputs, cards) | 🟡 Important |
| 6.4 | Implement loading states and error boundaries | 🟡 Important |
| 6.5 | Add toast/snackbar notifications | 🟢 Nice-to-have |

**Deliverables:**
- `src/components/layout/AppLayout.tsx` - Main layout wrapper
- `src/components/layout/Header.tsx` - App header with nav
- `src/components/layout/Sidebar.tsx` - Admin sidebar (optional)
- `src/components/ui/` - Shared UI components

---

### Phase 7: Testing
**Focus:** Unit tests for business logic

| Task | Description | Priority |
|------|-------------|----------|
| 7.1 | Setup testing framework (Vitest or Jest) | 🔴 Critical |
| 7.2 | Write auth slice tests | 🔴 Critical |
| 7.3 | Write events slice tests | 🔴 Critical |
| 7.4 | Write form validation tests | 🟡 Important |
| 7.5 | Write component tests | 🟡 Important |

**Deliverables:**
- `src/__tests__/` or `tests/` - Test files
- Test configuration in package.json

---

### Phase 8 (Bonus): E2E Tests & Enhancements
**Focus:** Cypress E2E, Storybook, deployment

| Task | Description | Priority |
|------|-------------|----------|
| 8.1 | Setup Cypress | 🟢 Bonus |
| 8.2 | Write E2E tests for auth flow | 🟢 Bonus |
| 8.3 | Write E2E tests for event CRUD | 🟢 Bonus |
| 8.4 | Setup Storybook for UI components | 🟢 Bonus |
| 8.5 | Deploy to Vercel/cloud | 🟢 Bonus |

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
│   │   ├── theme.ts
│   │   ├── api.ts
│   │   └── jwt.ts
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

| Phase | Name | Estimated Complexity | Dependencies |
|-------|------|---------------------|--------------|
| 1 | Foundation | Medium | None |
| 2 | Authentication | High | Phase 1 |
| 3 | Event Data Layer | Medium | Phase 1, 2 |
| 4 | Admin Features | High | Phase 1, 2, 3 |
| 5 | Reader Features | Medium | Phase 1, 2, 3 |
| 6 | UI Components | Medium | Phase 1 (can parallel) |
| 7 | Testing | Medium | Phase 2, 3, 4, 5 |
| 8 | Bonus | Low-Medium | All above |

---

## Technical Requirements Checklist

From the challenge requirements:

### Authentication & Authorization
- [ ] Authenticate using pre-configured email and password
- [ ] Implement fake JWT token generation
- [ ] Store token in localStorage
- [ ] Include token in API requests headers
- [ ] Protected routes for authenticated users only
- [ ] Logout functionality
- [ ] Role-based redirect (Admin → Dashboard, Reader → Events List)

### Admin Features (Role: admin)
- [ ] Create new events with all required fields
- [ ] Event name (required)
- [ ] Date and time (required, must be future date)
- [ ] Location (required)
- [ ] Description (required, min 50 characters)
- [ ] Category (required, select from: Conference, Workshop, Webinar, Networking, Other)
- [ ] Edit existing event details
- [ ] Delete events
- [ ] View events

### Reader Features (Role: reader)
- [ ] View events
- [ ] View past events separately from upcoming events
- [ ] Search and filter events
- [ ] Sort events by Date
- [ ] Sort events by Name

### Technical Requirements
- [ ] Use TypeScript
- [ ] Use React
- [ ] Use Next.js
- [ ] Implement state management using Redux Toolkit
- [ ] Create mock REST API using json-server
- [ ] Use Material UI 6 for styling with custom theme configuration
- [ ] Ensure responsive design for all screen sizes
- [ ] Ensure correct business logic and behavior with automated unit tests

### Bonus
- [ ] Add e2e tests with Cypress
- [ ] Implement role-based route protection using HOCs or middleware
- [ ] Deploy to cloud provider
- [ ] Add Storybook documentation for UI components
