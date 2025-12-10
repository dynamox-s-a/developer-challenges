---
name: json-server-mock-api
description: Set up and configure json-server as a mock REST API for development. Use when creating fake API endpoints, designing database schema for json-server, implementing CRUD operations, configuring routes, or adding middleware for authentication simulation.
---

# JSON Server Mock API

## Overview

This skill provides comprehensive guidance for setting up json-server as a mock REST API for Next.js applications during development.

## Installation & Setup

### Install Dependencies

```bash
npm install json-server --save-dev
npm install concurrently --save-dev  # For running both servers
```

### Database Schema (db.json)

```json
{
  "users": [
    {
      "id": "1",
      "email": "admin@events.com",
      "password": "admin123",
      "role": "admin",
      "name": "Admin User"
    },
    {
      "id": "2",
      "email": "reader@events.com",
      "password": "reader123",
      "role": "reader",
      "name": "Reader User"
    }
  ],
  "events": [
    {
      "id": "1",
      "name": "Tech Conference 2025",
      "date": "2025-06-15T09:00:00.000Z",
      "location": "Convention Center, San Francisco",
      "description": "Annual technology conference featuring the latest innovations in software development, AI, and cloud computing. Join industry leaders and experts for three days of learning and networking.",
      "category": "Conference",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "createdBy": "1"
    },
    {
      "id": "2",
      "name": "React Workshop",
      "date": "2025-04-20T14:00:00.000Z",
      "location": "Online",
      "description": "Hands-on workshop covering advanced React patterns, hooks, and performance optimization techniques. Perfect for intermediate developers looking to level up their React skills.",
      "category": "Workshop",
      "createdAt": "2024-01-10T08:00:00.000Z",
      "createdBy": "1"
    },
    {
      "id": "3",
      "name": "Startup Networking Night",
      "date": "2025-03-10T18:00:00.000Z",
      "location": "Innovation Hub, Austin",
      "description": "Connect with fellow entrepreneurs, investors, and industry professionals at our monthly networking event. Share ideas, find collaborators, and expand your professional network.",
      "category": "Networking",
      "createdAt": "2024-01-05T12:00:00.000Z",
      "createdBy": "1"
    },
    {
      "id": "4",
      "name": "AI in Business Webinar",
      "date": "2024-12-01T10:00:00.000Z",
      "location": "Online",
      "description": "Explore how artificial intelligence is transforming business operations across industries. Learn practical applications and implementation strategies from AI experts.",
      "category": "Webinar",
      "createdAt": "2024-01-01T09:00:00.000Z",
      "createdBy": "1"
    }
  ]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "server": "json-server --watch db.json --port 3001",
    "dev:all": "concurrently \"npm run dev\" \"npm run server\"",
    "server:delay": "json-server --watch db.json --port 3001 --delay 500"
  }
}
```

## REST API Endpoints

### Default Routes Generated

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| PATCH | /users/:id | Partial update |
| DELETE | /users/:id | Delete user |
| GET | /events | Get all events |
| GET | /events/:id | Get event by ID |
| POST | /events | Create event |
| PUT | /events/:id | Update event |
| PATCH | /events/:id | Partial update |
| DELETE | /events/:id | Delete event |

### Query Parameters

```bash
# Filtering
GET /events?category=Workshop
GET /events?category=Workshop&location=Online

# Full-text search
GET /events?q=technology

# Pagination
GET /events?_page=1&_per_page=10

# Sorting
GET /events?_sort=date&_order=asc
GET /events?_sort=date,name&_order=desc,asc

# Slice (for custom pagination)
GET /events?_start=0&_end=10

# Operators
GET /events?date_gte=2025-01-01  # Greater than or equal
GET /events?date_lte=2025-12-31  # Less than or equal
GET /events?id_ne=1              # Not equal

# Nested resources
GET /users/1/events  # Events created by user 1

# Expand relationships
GET /events?_expand=user
```

## Custom Routes

### routes.json

```json
{
  "/api/*": "/$1",
  "/auth/login": "/users",
  "/events/upcoming": "/events?date_gte=:today",
  "/events/past": "/events?date_lt=:today",
  "/events/category/:category": "/events?category=:category"
}
```

### Run with Custom Routes

```bash
json-server --watch db.json --routes routes.json --port 3001
```

## Middleware for Authentication

### server.js (Custom Server)

```javascript
// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares
server.use(middlewares);

// Parse JSON bodies
server.use(jsonServer.bodyParser);

// Custom authentication endpoint
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;
  const user = db
    .get('users')
    .find({ email, password })
    .value();

  if (user) {
    // Generate fake JWT token
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    ).toString('base64');

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Verify token middleware
server.use((req, res, next) => {
  // Skip auth for login and GET requests (for demo purposes)
  if (
    req.path === '/auth/login' ||
    req.method === 'GET' ||
    req.path === '/users'
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

    if (decoded.exp < Date.now()) {
      return res.status(401).json({ error: 'Token expired' });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Role-based access control
server.use((req, res, next) => {
  // Only admins can create, update, delete events
  if (
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
    req.path.startsWith('/events')
  ) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
  }
  next();
});

// Add createdAt and createdBy for new events
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/events') {
    req.body.createdAt = new Date().toISOString();
    req.body.createdBy = req.user?.userId || '1';
  }
  next();
});

// Use default router
server.use(router);

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
```

### Updated Package.json Scripts

```json
{
  "scripts": {
    "server": "node server.js",
    "dev:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

## Frontend API Integration

### API Client Configuration

```tsx
// lib/api.ts
import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken(); // From your auth storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic API request helper
export async function apiRequest<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        `Request failed with status ${error.response?.status}`;
      throw new Error(message);
    }
    throw error;
  }
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      data: { email, password },
    }),
};

// Events API
export const eventsApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest<Event[]>(`/events${params ? `?${params}` : ''}`),

  getById: (id: string) => apiRequest<Event>(`/events/${id}`),

  create: (event: Omit<Event, 'id'>) =>
    apiRequest<Event>('/events', {
      method: 'POST',
      data: event,
    }),

  update: (id: string, event: Partial<Event>) =>
    apiRequest<Event>(`/events/${id}`, {
      method: 'PATCH',
      data: event,
    }),

  delete: (id: string) =>
    apiRequest<void>(`/events/${id}`, {
      method: 'DELETE',
    }),
};
```

### Query Parameter Builder

```tsx
// lib/queryBuilder.ts
interface EventQueryParams {
  search?: string;
  category?: string;
  sortBy?: 'date' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  upcoming?: boolean;
  past?: boolean;
}

export function buildEventQuery(params: EventQueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set('q', params.search);
  }

  if (params.category) {
    searchParams.set('category', params.category);
  }

  if (params.sortBy) {
    searchParams.set('_sort', params.sortBy);
    searchParams.set('_order', params.sortOrder || 'asc');
  }

  if (params.page && params.limit) {
    searchParams.set('_page', String(params.page));
    searchParams.set('_per_page', String(params.limit));
  }

  // Filter by date
  const today = new Date().toISOString();
  if (params.upcoming) {
    searchParams.set('date_gte', today);
  } else if (params.past) {
    searchParams.set('date_lt', today);
  }

  return searchParams;
}
```

### Usage in Redux Thunks

```tsx
// store/slices/eventsSlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { eventsApi } from '@/lib/api';
import { buildEventQuery, EventQueryParams } from '@/lib/queryBuilder';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params: EventQueryParams = {}, { rejectWithValue }) => {
    try {
      const query = buildEventQuery(params);
      return await eventsApi.getAll(query);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (event: Omit<Event, 'id'>, { rejectWithValue }) => {
    try {
      // Token is automatically added via axios interceptor
      return await eventsApi.create(event);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
```

## Environment Configuration

### .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### .env.production

```env
NEXT_PUBLIC_API_URL=https://your-production-api.com
```

## Testing with JSON Server

### Mock Data Generation

```javascript
// scripts/generateMockData.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');

const categories = ['Conference', 'Workshop', 'Webinar', 'Networking', 'Other'];

const generateEvents = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: faker.company.catchPhrase(),
    date: faker.date.future().toISOString(),
    location: faker.location.city(),
    description: faker.lorem.paragraphs(2),
    category: faker.helpers.arrayElement(categories),
    createdAt: faker.date.past().toISOString(),
    createdBy: faker.helpers.arrayElement(['1', '2']),
  }));
};

const db = {
  users: [
    {
      id: '1',
      email: 'admin@events.com',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User',
    },
    {
      id: '2',
      email: 'reader@events.com',
      password: 'reader123',
      role: 'reader',
      name: 'Reader User',
    },
  ],
  events: generateEvents(50),
};

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Mock data generated!');
```

## Best Practices

1. **Use custom server.js** - For authentication and middleware
2. **Add delay for realism** - Use `--delay` flag to simulate network latency
3. **Version your db.json** - Keep it in git for consistent team development
4. **Use environment variables** - Switch between dev/prod APIs easily
5. **Generate mock data** - Use faker.js for realistic test data
6. **Document your API** - Keep README with available endpoints
7. **Handle errors gracefully** - Frontend should expect API failures
8. **Use axios for HTTP requests** - Better error handling, interceptors, automatic JSON
9. **Centralize auth with interceptors** - Add tokens automatically to all requests
