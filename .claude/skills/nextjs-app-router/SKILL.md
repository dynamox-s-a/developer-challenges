---
name: nextjs-app-router
description: Build Next.js 14+ applications using App Router patterns, Server Components, and modern React 19 features. Use when creating routes, layouts, pages, loading states, error boundaries, or implementing server/client component patterns in Next.js projects.
---

# Next.js App Router Development

## Overview

This skill provides guidance for building Next.js applications using the App Router architecture with React 19 features.

## Core Concepts

### File-Based Routing Structure

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
├── (auth)/             # Route group (no URL impact)
│   ├── login/
│   │   └── page.tsx    # /login
│   └── register/
│       └── page.tsx    # /register
├── dashboard/
│   ├── layout.tsx      # Nested layout
│   ├── page.tsx        # /dashboard
│   └── [id]/
│       └── page.tsx    # /dashboard/:id
└── api/
    └── route.ts        # API route handler
```

### Server vs Client Components

**Server Components (Default)**
```tsx
// app/events/page.tsx - Server Component by default
async function EventsPage() {
  const events = await fetchEvents(); // Direct async/await

  return (
    <main>
      <h1>Events</h1>
      <EventList events={events} />
    </main>
  );
}
```

**Client Components**
```tsx
// components/EventForm.tsx
'use client';

import { useState } from 'react';

export function EventForm() {
  const [name, setName] = useState('');
  // Client-side interactivity
}
```

### When to Use Each

| Server Components | Client Components |
|-------------------|-------------------|
| Fetch data | useState, useEffect |
| Access backend resources | Event listeners (onClick) |
| Keep sensitive info server-side | Browser-only APIs |
| Large dependencies | Interactive UI elements |
| SEO-critical content | Real-time updates |
| Use native `fetch` (Next.js caching) | Use `axios` (interceptors, better errors) |

## Route Patterns

### Dynamic Routes

```tsx
// app/events/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  return <EventDetails event={event} />;
}
```

### Route Groups

```tsx
// app/(dashboard)/layout.tsx - Groups routes without affecting URL
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Parallel Routes

```tsx
// app/@modal/(.)events/[id]/page.tsx
// Intercepting route for modals
```

## Data Fetching

### Server-Side Fetching

```tsx
// app/events/page.tsx
async function getEvents() {
  const res = await fetch('http://localhost:3001/events', {
    cache: 'no-store', // Dynamic data
    // cache: 'force-cache', // Static data (default)
    // next: { revalidate: 60 }, // ISR
  });

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventList events={events} />;
}
```

### Server Actions

```tsx
// app/events/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const event = {
    name: formData.get('name'),
    date: formData.get('date'),
    location: formData.get('location'),
  };

  await fetch('http://localhost:3001/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  revalidatePath('/events');
}
```

## Loading & Error States

### Loading UI

```tsx
// app/events/loading.tsx
import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <div>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}
```

### Error Boundary

```tsx
// app/events/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Metadata & SEO

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Event Management',
    default: 'Event Management System',
  },
  description: 'Manage your events efficiently',
  openGraph: {
    title: 'Event Management System',
    description: 'Manage your events efficiently',
    type: 'website',
  },
};
```

### Dynamic Metadata

```tsx
// app/events/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  return {
    title: event.name,
    description: event.description,
  };
}
```

## Middleware

```tsx
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
```

## Best Practices

1. **Default to Server Components** - Only use 'use client' when necessary
2. **Colocate related files** - Keep components near their routes
3. **Use Route Groups** - Organize without URL impact
4. **Implement proper loading states** - Every async boundary needs loading UI
5. **Handle errors gracefully** - Use error.tsx at appropriate levels
6. **Optimize metadata** - Use generateMetadata for dynamic pages
7. **Use fetch in Server Components/Actions** - Next.js extends fetch with caching
8. **Use axios in Client Components** - Better error handling and interceptors for auth

## Common Patterns for Event Management

### Protected Routes Layout

```tsx
// app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

### Role-Based Routing

```tsx
// app/(protected)/layout.tsx
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect('/login');

  // Redirect based on role
  if (session.role === 'admin') {
    // Admin sees admin dashboard
  } else {
    // Reader sees events list
  }

  return <>{children}</>;
}
```
