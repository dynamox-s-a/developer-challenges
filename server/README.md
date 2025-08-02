# Machine Management API - Express.js

A TypeScript-based Express.js API for managing industrial machines with JWT authentication and monitoring capabilities.

## 🚀 Features

- **JWT Authentication**: Secure API endpoints with token-based authentication
- **User-based Machine Management**: Each user can manage their own machines
- **Type-safe**: Full TypeScript support with strict typing
- **RESTful API**: Clean REST endpoints following best practices
- **Comprehensive Testing**: 23 tests covering all functionality

## 🏗️ Architecture

```
src/
├── domain/                    # Domain layer
│   ├── BaseMachine.ts        # Abstract base class
│   ├── BaseMonitoringPoint.ts # Abstract monitoring point
│   ├── PumpMachine.ts        # Pump implementation
│   ├── FanMachine.ts         # Fan implementation
│   ├── PumpMonitoringPoint.ts # Pump sensors
│   ├── FanMonitoringPoint.ts  # Fan sensors
│   ├── MachineFactory.ts     # Factory pattern
│   └── index.ts              # Domain exports
├── middleware/               # Express middleware
│   └── authMiddleware.ts     # JWT authentication
├── types/                   # Type definitions
│   └── types.ts             # Shared types
└── main.ts                  # Express server setup
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Token Format**: `Bearer <jwt_token>`
2. **Token Payload**: `{ userId: string }`
3. **Protected Routes**: All machine management endpoints

### Example Token:
```javascript
// Create a test token
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 'user-123' }, 'your-secret-key');
// Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📡 API Endpoints

### Public Endpoints

#### Health Check
```http
GET /
```
**Response:**
```json
{
  "message": "Machine Management API",
  "version": "1.0.0",
  "status": "running"
}
```

#### Get Machine Types
```http
GET /api/machines/types
```
**Response:**
```json
{
  "types": ["pump", "fan"]
}
```

### Protected Endpoints (Require Authentication)

#### Create Machine
```http
POST /api/machines
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "pump-001",
  "type": "pump"
}
```
**Response:**
```json
{
  "userId": "user-123",
  "id": "machine-uuid",
  "name": "pump-001",
  "type": "pump",
  "monitoringPoints": []
}
```

#### Get User Machines
```http
GET /api/machines
Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "message": "Get user machines endpoint - implementation pending",
  "userId": "user-123"
}
```

## 🏭 Machine Types

### Pump Machines
- **Type**: `pump`
- **Supported Sensors**: HFPlus (pressure)
- **Monitoring**: Pressure monitoring points

### Fan Machines
- **Type**: `fan`
- **Supported Sensors**: TcAg (temperature), TcAs (humidity)
- **Monitoring**: Temperature and humidity monitoring points

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd server
npm install
```

### Environment Variables
Create a `.env` file:
```env
JWT_SECRET=your-secret-key-here
PORT=3000
```

### Running the Application
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### API Testing
```bash
# Test the API endpoints
node test-express.js
```

## 🔧 Configuration

### TypeScript Configuration
- **Target**: ES2016
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **ES Module Interop**: Enabled

### Express Configuration
- **JSON Body Parser**: Enabled
- **CORS**: Not configured (add as needed)
- **Error Handling**: Custom error responses

## 🧪 Testing

### Test Structure
```
test/
├── unit/
│   ├── Machine.test.ts      # Domain logic tests
│   └── MachineRepository.test.ts # Repository tests
```

### Test Coverage
- ✅ Machine creation and validation
- ✅ Authentication middleware
- ✅ Sensor type restrictions
- ✅ Error scenarios
- ✅ Property updates
- ✅ Factory functionality

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Input Validation**: Comprehensive request validation
3. **Error Handling**: Secure error responses
4. **Type Safety**: Compile-time type checking
5. **User Isolation**: Machines are user-scoped

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `JWT_SECRET`: Required for token signing
- `PORT`: Server port (default: 3000)

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Future Enhancements

1. **Database Integration**: PostgreSQL/MongoDB support
2. **Real-time Monitoring**: WebSocket connections
3. **Rate Limiting**: API rate limiting
4. **Logging**: Structured logging with Winston
5. **Metrics**: Prometheus metrics
6. **Caching**: Redis caching layer
7. **Documentation**: OpenAPI/Swagger docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

ISC License 