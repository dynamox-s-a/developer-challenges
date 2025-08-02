# Machine Management System

A full-stack machine and monitoring points management application built with Next.js, Express.js, and TypeScript.

## Features

- **Machine Management**: Create, read, update, and delete industrial machines (pumps and fans)
- **Monitoring Points**: Manage sensor monitoring points with different types (TcAg, TcAs, HFPlus)
- **Authentication**: JWT cookie-based authentication system
- **Real-time Updates**: Redux state management with server synchronization
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Material-UI components with responsive design

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## File Structure

```
developer-challenges/
├── client/                          # Frontend Next.js application
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── sign-in/
│   │   │   │   ├── sign-up/
│   │   │   │   └── reset-password/
│   │   │   ├── dashboard/          # Dashboard pages
│   │   │   │   ├── machines/       # Machine management
│   │   │   │   ├── monitoring/     # Monitoring points
│   │   │   │   ├── account/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx
│   │   ├── components/             # Reusable components
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   │   ├── customer/      # Machine table
│   │   │   │   ├── monitoring/    # Monitoring components
│   │   │   │   └── layout/        # Layout components
│   │   │   └── core/              # Core components
│   │   ├── store/                 # Redux store
│   │   │   ├── features/          # Redux slices
│   │   │   │   ├── machinesSlice.ts
│   │   │   │   └── monitoringPointsSlice.ts
│   │   │   └── index.ts
│   │   ├── lib/                   # Utility libraries
│   │   │   └── auth/              # Authentication client
│   │   ├── types/                 # TypeScript type definitions
│   │   └── styles/                # Styling and themes
│   ├── public/                    # Static assets
│   ├── .env.local                 # Environment variables
│   └── package.json
├── server/                        # Backend Express.js application
│   ├── src/
│   │   ├── domain/                # Domain models
│   │   │   ├── BaseMachine.ts
│   │   │   ├── BaseMonitoringPoint.ts
│   │   │   ├── FanMachine.ts
│   │   │   ├── FanMonitoringPoint.ts
│   │   │   ├── PumpMachine.ts
│   │   │   ├── PumpMonitoringPoint.ts
│   │   │   └── MachineFactory.ts
│   │   ├── repository/            # Data repositories
│   │   │   ├── MachineRepositoryMemory.ts
│   │   │   ├── MonitoringPointRepositoryMemory.ts
│   │   │   └── UserRepositoryMemory.ts
│   │   ├── service/               # Business services
│   │   │   └── AuthService.ts
│   │   ├── middleware/            # Express middleware
│   │   │   └── authMiddleware.ts
│   │   ├── types/                 # TypeScript type definitions
│   │   │   └── types.ts
│   │   └── main.ts                # Express server entry point
│   ├── test/                      # Test files
│   │   ├── unit/
│   │   └── integration/
│   ├── .env                       # Environment variables
│   └── package.json
└── README.md
```

## API Routes

### Authentication Routes

#### POST `/api/register`
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

#### POST `/api/login`
Authenticate user and set HTTP-only cookie.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful"
}
```
*Sets `token` cookie with JWT*

#### POST `/api/logout`
Clear authentication cookie.

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET `/api/me`
Get current user information (Protected).

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "/assets/avatar.png"
}
```

### Machine Routes

#### GET `/api/machines`
Get all machines for authenticated user (Protected).

**Response:**
```json
[
  {
    "id": "machine-id",
    "userId": "user-id",
    "name": "Pump Alpha Romeo",
    "type": "pump",
    "monitoringPoints": []
  }
]
```

#### POST `/api/machines`
Create a new machine (Protected).

**Request:**
```json
{
  "name": "Industrial Pump",
  "type": "pump"
}
```

**Response:**
```json
{
  "id": "new-machine-id"
}
```

#### DELETE `/api/machines/:id`
Delete a machine and all associated monitoring points (Protected).

**Response:**
```json
{
  "message": "Machine deleted successfully"
}
```

#### PUT `/api/machines/:id/type`
Update machine type and delete associated monitoring points (Protected).

**Request:**
```json
{
  "type": "fan"
}
```

**Response:**
```json
{
  "message": "Machine type updated successfully. All monitoring points have been removed.",
  "machine": {
    "id": "machine-id",
    "name": "Industrial Machine",
    "type": "fan"
  }
}
```

### Monitoring Points Routes

#### GET `/api/monitoring-points`
Get all monitoring points for authenticated user (Protected).

**Response:**
```json
[
  {
    "userId": "user-id",
    "machineId": "machine-id",
    "name": "Temperature Sensor",
    "sensorType": "TcAg",
    "sensorId": "sensor-123"
  }
]
```

#### POST `/api/monitoring-points`
Create a new monitoring point (Protected).

**Request:**
```json
{
  "name": "Pressure Sensor",
  "sensorType": "HFPlus",
  "machineId": "machine-id"
}
```

**Response:**
```json
{
  "id": "monitoring-point-id"
}
```

#### DELETE `/api/monitoring-points/sensor-id/:sensorId`
Delete monitoring point by sensor ID (Protected).

**Response:**
```json
{
  "message": "Monitoring point deleted"
}
```

#### DELETE `/api/monitoring-points/machine-id/:machineId`
Delete all monitoring points for a machine (Protected).

**Response:**
```json
{
  "message": "Monitoring points deleted"
}
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Environment Variables

**Client (`.env.local`):**
```env
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:3000
```

**Server (`.env`):**
```env
JWT_SECRET=your-super-secret-jwt-key-for-development-only
CLIENT_URL=http://localhost:3001
NODE_ENV=development
PORT=3000
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd developer-challenges
   ```

2. **Install all dependencies:**
   ```bash
   # Install root, server, and client dependencies
   npm run install:all
   ```

3. **Start both development servers:**
   ```bash
   # Single command to start both server and client
   npm run dev
   ```

   **Or manually start each server:**
   ```bash
   # Terminal 1: Start server only
   npm run dev:server

   # Terminal 2: Start client only
   npm run dev:client
   ```

4. **Open the application:**
   - Client: `http://localhost:3001`
   - Server API: `http://localhost:3000`

## Available Scripts

### Development
- `npm run dev` - Start both server and client concurrently
- `npm run dev:server` - Start only the server
- `npm run dev:client` - Start only the client

### Building
- `npm run build` - Build both server and client for production
- `npm run build:server` - Build only the server
- `npm run build:client` - Build only the client

### Production
- `npm run start` - Start both production builds
- `npm run start:server` - Start only the production server
- `npm run start:client` - Start only the production client

### Utilities
- `npm run install:all` - Install dependencies for root, server, and client
- `npm run clean` - Clean all build artifacts and node_modules
- `npm test` - Run server tests

## Data Models

### Machine Types
- **Pump**: Industrial pumps with specific sensor compatibility
- **Fan**: Industrial fans with specific sensor compatibility

### Sensor Types
- **TcAg**: Temperature sensors (compatible with pumps)
- **TcAs**: Humidity sensors (compatible with fans)
- **HFPlus**: Pressure sensors (compatible with pumps)

### Business Rules
1. **Machine Type Change**: When a machine type is changed, all associated monitoring points are automatically deleted
2. **Sensor Compatibility**: Different machine types support different sensor types
3. **User Isolation**: Users can only access their own machines and monitoring points
4. **Cascade Deletion**: Deleting a machine removes all its monitoring points

## Authentication

The application uses JWT-based authentication with HTTP-only cookies:

1. **Registration/Login**: Sets secure HTTP-only cookie
2. **API Requests**: Cookie automatically included with `credentials: 'include'`
3. **Protected Routes**: Server validates JWT on protected endpoints
4. **Logout**: Clears authentication cookie

## Testing
The backend server has unit and integration tests. They are not abosolutely comprehensive, but cover the major use cases.   
```bash
cd server
npm run test
```

## Production Deployment

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Build the server:**
   ```bash
   cd server
   npm run build
   ```

3. **Set production environment variables**
4. **Deploy both applications to your hosting platform**
