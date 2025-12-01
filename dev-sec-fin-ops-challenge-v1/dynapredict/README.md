# DynaPredict - Asset Condition Monitoring Platform

A robust and intuitive React + TypeScript application for managing machines, monitoring points, and sensors in industrial environments.

## 🚀 Features Implemented

### ✅ Authentication
- Fixed email/password login (`admin@dynapredict.com` / `admin123`)
- Protected routes with authentication guards
- Logout functionality

### ✅ Machine Management
- Create machines with name and type [Pump, Fan]
- Edit machine attributes (name and type)
- Delete machines
- Real-time loading states

### ✅ Monitoring Points & Sensors
- Create monitoring points for existing machines
- Associate sensors with monitoring points
- Sensor models: TcAg, TcAs, HF+
- **Business Rule**: TcAg and TcAs sensors not allowed on Pump machines
- Paginated list (5 items per page)
- **Sortable columns** (Machine Name, Type, Monitoring Point, Sensor)

### ✅ Technical Requirements
- **TypeScript** - Full type safety
- **React 19** - Latest React features
- **Redux Toolkit** - State management with async thunks
- **Vite** - Fast build tool
- **Material UI 5** - Modern component library
- **React Router** - Client-side routing
- **Vitest** - Unit testing framework

## 🏗️ Project Structure

```
src/
├── components/          # Reusable components
├── hooks/              # Custom hooks (Redux)
├── pages/              # Page components
│   ├── Login/
│   ├── Dashboard/
│   ├── Machines/
│   └── Sensors/
├── store/              # Redux store
│   └── Slices/         # Redux slices
├── test/               # Test setup
└── types/              # TypeScript types
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dynapredict

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Login Credentials
- **Email**: `admin@dynapredict.com`
- **Password**: `admin123`

## 🧪 Testing

Unit tests are implemented using Vitest and cover:
- Redux slice logic
- Business rule validation
- Component behavior

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## 📋 Business Rules

1. **Sensor Restrictions**: TcAg and TcAs sensors cannot be associated with Pump machines
2. **Machine Types**: Only Pump and Fan types are allowed
3. **Sensor Models**: Only TcAg, TcAs, and HF+ models are supported
4. **Monitoring Points**: Each machine can have multiple monitoring points
5. **Authentication**: All routes except login require authentication

## 🎯 Key Assumptions Made

1. **Data Persistence**: Using fake API with simulated delays (no real backend)
2. **Sensor Association**: Sensors are directly associated with monitoring points during creation
3. **Machine Deletion**: Deleting a machine removes all associated monitoring points
4. **Pagination**: Fixed at 5 items per page for optimal UX
5. **Sorting**: Client-side sorting for better performance with small datasets

## 🔧 Technologies Used

- **Frontend**: React 19, TypeScript, Material UI 5
- **State Management**: Redux Toolkit with async thunks
- **Build Tool**: Vite
- **Testing**: Vitest, Testing Library
- **Routing**: React Router v6
- **Styling**: Material UI + Emotion

## 📱 Responsive Design

The application is responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Future Enhancements

- Real backend API integration
- Advanced filtering and search
- Data visualization charts
- Export functionality
- User management
- Real-time notifications
- E2E testing with Cypress
