# Copilot Instructions - Event Management System

## Architecture Overview

This is a **Next.js 15 (App Router) + Material-UI event management system** with role-based authentication using a JSON Server backend for development. The app manages events with admin/reader permissions.

### Key Components

- **Frontend**: Next.js 15 with TypeScript, Material-UI v7, Emotion styling
- **Backend**: JSON Server (`db.json`) running on port 3001
- **Auth**: Custom fake JWT implementation for development (`lib/auth/jwt-fake.ts`)
- **State**: React hooks with localStorage persistence for auth state

## Development Workflow

### Essential Commands

```bash
# Start development (uses Turbopack)
npm run dev

# Start JSON Server backend (required!)
npm run json-server

# Build with Turbopack
npm run build --turbopack
```

**Critical**: Always run `json-server` on port 3001 before starting development. The API client expects this backend.

## Authentication System

Uses a **fake JWT system** for development with two demo users:

- `admin@events.com` / `admin123` (full CRUD access)
- `reader@events.com` / `reader123` (read-only access)

### Auth Pattern

```typescript
// Always use the auth hook for protected pages
const { isAuthenticated, isAdmin, user, loading } = useAuth();

// Check loading first, then redirect if needed
if (!authLoading && !isAuthenticated) {
  router.push("/");
  return null;
}
```

## File Organization Patterns

### Route Structure

- `/` - Login page (`app/page.tsx`)
- `/dashboard` - Event listing (all users)
- `/admin/events/add` - Create events (admin warning for readers)
- `/admin/events/edit/[id]` - Edit events (admin only)

### Component Organization

- `components/forms/` - Reusable form components with validation
- `components/ui/` - Pure UI components (Loading, etc.)
- `hooks/` - Custom hooks (`useAuth`, `useLocalStorage`)
- `lib/api/` - API client with TypeScript interfaces and auth token support
- `providers/` - React providers (Theme, etc.)
- `types/` - Centralized TypeScript type definitions

## API Client System

### Current Architecture (Fetch-based)

**Use**: `lib/api/apiClients.ts` - Primary API client with automatic auth token injection

```typescript
// Import specific functions, not the class
import { getEvents, createEvent, setAuthToken } from "@/lib/api/apiClients";

// Authentication token is automatically included in all requests
const events: Event[] = await getEvents();
```

**Token Management**: The `useAuth` hook automatically calls `setAuthToken()` to configure the API client when users login/logout.

### Legacy System (Axios-based)

**Avoid**: `lib/apiClient.ts` - Legacy axios client with manual token management

### Data Types

**Use centralized types**: Import from `@/types` instead of individual files:

```typescript
import { User, Event, LoginCredentials, EventFormData } from "@/types";
```

**Type Organization**:

- `types/auth.ts` - User, authentication, and JWT types
- `types/events.ts` - Event data and filtering types
- `types/forms.ts` - Form component props and data types
- `types/ui.ts` - UI component and theme types
- `types/index.ts` - Central export file (use this for imports)

## Material-UI Integration

### Theme Setup

- Custom theme in `styles/theme.ts`
- Global providers in `providers/ThemeProvider.tsx`
- Uses Emotion for CSS-in-JS

### Form Patterns

Forms use Material-UI with validation and loading states:

```typescript
// See FormEvent.tsx for the standard pattern
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

## Database Schema (db.json)

```json
{
  "user": [
    /* id, email, password, role */
  ],
  "event": [
    /* id, name, date, location, description, category */
  ]
}
```

Events have predefined categories: Workshop, Conference, Webinar, Meetup, etc.

## Role-Based Access

### Admin Features

- Full CRUD on events
- Access to `/admin/*` routes

### Reader Features

- View events only
- Can access admin routes but sees warning messages

### Implementation Pattern

```typescript
// Check role in components
if (!isAdmin) {
  return <Alert severity="warning">Admin access required</Alert>;
}
```

## Common Development Tasks

### Adding New Routes

1. Create page in `app/` following the file-based routing
2. Add authentication checks using `useAuth()`
3. Import necessary MUI components and types from `@/types`

### Working with Types

1. **Always import from central types**: `import { User, Event } from '@/types'`
2. **Add new types** to appropriate file in `types/` directory
3. **Export new types** from `types/index.ts` for easy importing
4. **Use existing patterns**: Check `types/` for similar interfaces before creating new ones

### Extending API

1. Add interface to `types/` directory (not in API client)
2. Add corresponding methods to `ApiClient` class
3. Export functions at bottom of API client file
4. Auth tokens are automatically included

### New Components

1. Place in appropriate `components/` subdirectory
2. Import types from `@/types` instead of defining inline
3. Export from `components/index.ts` if reusable
4. Use TypeScript interfaces for props from centralized types

## Environment Variables

- `NEXT_PUBLIC_API_URL` - JSON Server URL (defaults to `http://localhost:3001`)

## Build Configuration

- Uses Turbopack for faster development and builds
- ESLint configured with Next.js TypeScript rules
- TypeScript strict mode enabled
