# Architecture

## 1. System Structure

The project uses an Nx monorepo with two applications and one shared library. This structure centralizes the rules and contracts used by both the frontend and backend.

```text
full-stack-solution/
├── apps/
│   ├── api/       # REST API
│   └── web/       # Frontend application
└── libs/
    └── shared/    # Shared schemas, types, and rules
```

| Package       | Main Technologies                                              | Responsibility                                                               |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `apps/api`    | Express 5, TypeScript, Prisma 7.10, PostgreSQL 16              | API, business rules, authentication, and data persistence.                   |
| `apps/web`    | Vite 8, React 18, MUI 5, Redux Toolkit, React Router, Recharts | User interface, state management, and interaction with the API.              |
| `libs/shared` | Zod 4                                                          | Validation schemas, domain types, and functions shared between applications. |

The shared library is imported as `@full-stack-solution/shared`. The backend is responsible for enforcing business rules and is the only component authorized to write to the database.

## 2. Runtime Topology and Communication

```text
┌──────────────┐     /api/*     ┌─────────────────┐
│   Browser    │ ─────────────► │   Vite Proxy    │
│    React     │                │     :4200       │
└──────────────┘                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │   Express API   │
                                │      :3000      │
                                └────────┬────────┘
                                         │ Prisma
                                         ▼
                                ┌─────────────────┐
                                │  PostgreSQL 16  │
                                │     Docker      │
                                └─────────────────┘
```

During development, Vite proxies `/api` requests to Express, keeping browser requests on the same origin and eliminating the need for CORS configuration in this environment. When the frontend and API are deployed to different origins, `CORS_ALLOWED_ORIGINS` defines the permitted origins, and the CORS middleware is registered only when this configuration is present. The `VITE_API_URL` variable defines the API URL in the frontend at build time.

Prisma centralizes communication between the API and PostgreSQL.

## 3. Backend Architecture

The backend organizes modules into layers with distinct responsibilities:

```text
Routes → Controller → Service → Repository → Prisma
```

| Layer      | Responsibility                                                          |
| ---------- | ----------------------------------------------------------------------- |
| Routes     | Define endpoints and associate the required middleware.                 |
| Controller | Validates input, coordinates service calls, and sets the HTTP response. |
| Service    | Implements business rules without depending on HTTP or Prisma.          |
| Repository | Encapsulates data access and persistence.                               |
| Prisma     | Executes database operations through the ORM.                           |

The main architectural decisions are:

- **Separation of concerns:** Each layer has a defined responsibility, preventing business rules from accumulating in controllers.
- **Service independence:** Repositories are abstracted through interfaces, allowing unit tests to use in-memory implementations without a database.
- **Controlled data access:** Prisma imports are restricted to repositories and authorized infrastructure components, with ESLint enforcing this boundary.
- **Explicit dependency composition:** `container.ts` instantiates repositories, injects dependencies into services, and provides services to controllers without an additional dependency injection framework.
- **Operation consistency:** Transactions are used when necessary to prevent partial states in related operations.

Authentication and authorization are enforced by the backend. Queries that access user data must respect record ownership boundaries.

## 4. Frontend Architecture

The frontend is organized by feature, keeping components, API calls, and state related to the same domain close together.

```text
apps/web/src/
├── api/          # HTTP client and error handling
├── app/          # Store, hooks, thunks, and middleware
├── components/   # Reusable components and layout
├── features/     # Feature modules organized by domain
├── routes/       # Navigation constants
├── test/         # Test configuration and utilities
├── theme/        # MUI theme
└── utils/        # Utility functions
```

### API Communication

API calls follow a standardized flow:

```text
Component → Redux thunk → Feature API → HTTP client
```

This structure centralizes communication with the backend and prevents components from implementing HTTP calls directly.

### State Management

| State Type                                                                         | Management                                         |
| ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| Session, machines, monitoring points, list queries, time series, and notifications | Redux Toolkit                                      |
| Dialogs, form values, and date inputs                                              | Local component state                              |
| Form validation                                                                    | react-hook-form and Zod schemas from `libs/shared` |

Side effects are handled by thunks, keeping reducers responsible for predictable state updates. Middleware centralizes session termination when requests return `401` and token persistence in `localStorage`. The sign-in operation is excluded from automatic session termination so users can correct invalid credentials without leaving the login form. Because pagination and sorting are performed on the server, lists are fetched again after mutations to prevent inconsistencies between local data and the page returned by the API. Pages are loaded on demand through lazy loading, reducing the initial loading cost and deferring feature-specific resources, such as the charting library, until they are needed.

## 5. Architectural Principles and Conventions

| Concern        | Convention                                                                               |
| -------------- | ---------------------------------------------------------------------------------------- |
| Validation     | Zod schemas shared between the frontend and backend.                                     |
| Errors         | Standardized API error format, normalized on the client as `ApiError`.                   |
| Authorization  | Access scope enforced in database queries according to record ownership rules.           |
| Business rules | Centralized in services and shared functions where applicable.                           |
| Persistence    | Database access encapsulated in repositories.                                            |
| Frontend state | Global state in Redux Toolkit; transient state in components.                            |
| Dependencies   | Explicit composition in `container.ts`, without an additional DI framework.              |
| Quality        | Architectural constraints enforced through linting and behavior validated through tests. |

The `HF+` value is stored as `HF_PLUS` and converted in a single mapping location: `shared/database/sensor-model.mapper.ts`. Enum ordering also follows the convention defined by the business rules.
