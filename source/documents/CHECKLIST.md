# Project Implementation Checklist

## 1. Authentication
- [X] Implement login using fixed email and password
- [X] Implement logout functionality
- [X] Secure private routes (redirect unauthorized users)

## 2. Machine Management
- [X] Implement Machine creation (Name, Type: "Pump" or "Fan")
- [X] Implement Machine updates (Name, Type)
- [X] Implement Machine deletion

## 3. Monitoring Points and Sensors Management
- [X] Implement Monitoring Point creation (minimum 2 per machine)
- [X] Implement Sensor association to Monitoring Point
    - [X] Unique Sensor ID
    - [X] Model selection: ["TcAg", "TcAs", "HF+"]
- [X] Implement Business Rule: Prevent "TcAg" and "TcAs" sensors for "Pump" machines
- [ ] Implement Paginated List of Monitoring Points
    - [X] 5 items per page
    - [X] Columns: Machine Name, Machine Type, Monitoring Point Name, Sensor Model
- [ ] Implement Sorting for all columns (ASC/DESC)

## 4. Time-Series Data Management
- [X] Implement raw sensor data storage
- [ ] Implement time-series metrics retrieval
- [ ] Implement deletion of time-series data
- [ ] Implement time-series count retrieval
- [ ] Implement full time-series retrieval
- [ ] Implement time-series visualization (charts/graphs)

## 5. Technical & Quality Requirements
- [X] Frontend: React, TypeScript, Next.js/Vite
- [X] State Management: Redux with Thunks or Sagas
- [X] UI: Material UI 5 (Responsive & Reusable components)
- [X] Backend: Node.js with RESTful API
- [X] Database: PostgreSQL (Prisma)
- [ ] Error Handling & Validation
- [ ] Unit Tests (Frontend & Backend)
- [X] API Latency < 350ms
- [ ] Document assumptions in README

## 6. Bonus Features
- [X] Nx Monorepo setup
- [ ] E2E tests with Cypress
- [ ] Cloud deployment
- [ ] Time-series future prediction
- [ ] Load balancer setup
- [ ] Load tests
