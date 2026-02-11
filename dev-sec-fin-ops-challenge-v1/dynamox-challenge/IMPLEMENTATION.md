# Event Management System 🎟️

A comprehensive event management system with role-based access control built with Next.js, TypeScript, Redux Toolkit, and Material UI.

## 🚀 Features

### Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Token stored in localStorage
- ✅ Token included in API request headers
- ✅ Protected routes with role-based access
- ✅ Logout functionality
- ✅ Role-based redirects (Admin → Dashboard, Reader → Events)

### Admin Features (admin@events.com)
- ✅ Create new events with validation:
  - Event name (required)
  - Date and time (required, must be future date)
  - Location (required)
  - Description (required, minimum 50 characters)
  - Category (required: Conference, Workshop, Webinar, Networking, Other)
- ✅ Edit existing events
- ✅ Delete events
- ✅ View all events

### Reader Features (reader@events.com)
- ✅ View all events
- ✅ Separate views for upcoming and past events
- ✅ Search events by name, description, or location
- ✅ Filter events by category
- ✅ Sort events by:
  - Date (earliest/latest first)
  - Name (A-Z or Z-A)

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **UI Library:** Material UI 7
- **Styling:** Material UI Theme with custom configuration
- **Backend:** json-server with JWT authentication
- **Date Handling:** date-fns
- **Testing:** Jest + React Testing Library
- **Development:** Concurrent development servers

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dynamox-challenge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   The `.env.local` file is already configured with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## 🏃 Running the Application

### Development Mode
Run both the API server and Next.js development server concurrently:

```bash
npm run dev
```

This will start:
- JSON Server API on `http://localhost:3001`
- Next.js app on `http://localhost:3000`

### Run Servers Separately

**Start API Server:**
```bash
npm run server
```

**Start Next.js (in another terminal):**
```bash
npm run next-dev
```

### Production Build

```bash
npm run build
npm start
```

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Test Coverage:
The project includes unit tests for:
- Redux slices (authSlice, eventsSlice)
- React components (EventCard)
- Business logic and state management

## 👥 Demo Accounts

### Admin Account
- **Email:** admin@events.com
- **Password:** admin123
- **Permissions:** Full access to create, edit, and delete events

### Reader Account
- **Email:** reader@events.com
- **Password:** reader123
- **Permissions:** View-only access with filtering and sorting

## 📱 Application Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard page
│   ├── events/              # Reader events page
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page (redirects to login)
├── components/              # React components
│   ├── EventCard.tsx        # Event display card
│   ├── EventFormDialog.tsx  # Create/Edit event form
│   ├── EventsList.tsx       # Events list with filters
│   ├── Navbar.tsx           # Navigation bar
│   ├── ProtectedRoute.tsx   # Route protection HOC
│   └── Providers.tsx        # Redux and MUI providers
├── store/                   # Redux store
│   ├── slices/
│   │   ├── authSlice.ts    # Authentication state
│   │   └── eventsSlice.ts  # Events state
│   ├── hooks.ts            # Typed Redux hooks
│   └── store.ts            # Store configuration
├── services/               # API services
│   └── api.ts             # API client
├── theme/                 # Material UI theme
│   └── theme.ts          # Custom theme configuration
└── types/                # TypeScript types
    └── index.ts          # Application types
```

## 🎨 Features Highlights

### Form Validation
- Real-time validation for all event fields
- Minimum character requirements for descriptions
- Future date validation
- Clear error messages

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Material UI breakpoints
- Works on all screen sizes

### User Experience
- Loading states
- Error handling with user feedback
- Success/error notifications
- Confirmation dialogs for destructive actions
- Clean and intuitive interface

### Code Quality
- TypeScript for type safety
- Redux Toolkit for predictable state management
- Component-based architecture
- Separation of concerns
- Reusable components
- Comprehensive test coverage

## 🔐 API Endpoints

The json-server provides the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/verify` - Verify token

### Events
- `GET /events` - Fetch all events
- `POST /events` - Create event (admin only)
- `PATCH /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

## 📝 Development Notes

### State Management
- Redux Toolkit for global state
- Async thunks for API calls
- Optimistic UI updates
- Error handling at slice level

### Route Protection
- HOC-based route protection
- Automatic token verification
- Role-based access control
- Redirect logic based on user role

### Material UI Theme
- Custom color palette
- Typography configuration
- Component style overrides
- Responsive breakpoints

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Module not found:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material UI Documentation](https://mui.com/)
- [json-server Documentation](https://github.com/typicode/json-server)

## ✅ Challenge Requirements Checklist

### Authentication & Authorization
- [x] Fake JWT token generation
- [x] Token storage in localStorage
- [x] Token in API request headers
- [x] Protected routes
- [x] Logout functionality
- [x] Role-based redirects

### Admin Features
- [x] Create events with all required fields
- [x] Form validation (future date, min 50 chars, etc.)
- [x] Edit events
- [x] Delete events
- [x] View events

### Reader Features
- [x] View events
- [x] Past events separated from upcoming
- [x] Search and filter events
- [x] Sort by date and name

### Technical Requirements
- [x] TypeScript
- [x] React
- [x] Next.js
- [x] Redux Toolkit state management
- [x] json-server REST API
- [x] Material UI 6+ with custom theme
- [x] Responsive design
- [x] Unit tests with Jest

### Bonus Features
- [x] Role-based route protection with HOC
- [ ] E2E tests with Cypress (optional)
- [ ] Cloud deployment (optional)
- [ ] Storybook documentation (optional)

## 👨‍💻 Author

Developed as a technical challenge for Dynamox.

## 📄 License

This project is part of a technical assessment.
