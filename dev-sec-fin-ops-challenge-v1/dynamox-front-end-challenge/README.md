# Dynamox Full-Stack Developer Challenge (Front-end)

This project was implemented as part of the **Dynamox Full-Stack Developer Challenge** using:

- **Vite + React + TypeScript**
- **Material UI 5**
- **Redux Toolkit + Thunk**
- Persistence using **json-server** (mock REST API)
- LocalStorage used for authentication state
- **Unit tests** with **Vitest**

---

## ✅ Features

### Authentication
- Login with fixed credentials (fake auth)
- Protected routes (`/machines`, `/monitoring-points`)
- Logout

### Machine Management
- Create / Edit / Delete machines
- Machine type: `Pump` or `Fan`

### Monitoring Points & Sensors
- Create / Edit / Delete monitoring points linked to a machine
- Associate a sensor to a monitoring point:
  - Sensor has a **unique ID**
  - Model is one of: `TcAg`, `TcAs`, `HF+`
- Business rule:
  - Machines of type **Pump** cannot use `TcAg` or `TcAs`

### List UX
- Monitoring points table supports:
  - Pagination: **5 items per page**
  - Sorting by any column (asc/desc)

### Automated tests
- Business rules: sensor vs machine type
- Sorting utilities
- Pagination utilities

---

## 🧠 Assumptions (ambiguities handled)

- **Persistence**: Implemented using a mock REST API with **json-server**, simulating a real backend.
  - This approach was chosen to better reflect a real-world frontend + API integration.
  - The architecture allows an easy migration to a real backend (Node.js / NestJS) with minimal changes.
- **Sensor per monitoring point**: each monitoring point can have **at most 1 sensor** (`sensor: Sensor | null`).
- **Deleting a machine**: monitoring points referencing a deleted machine may appear as `(machine removed)` in the list.
  - In a production system, this could be handled by cascade delete or by blocking deletion if dependencies exist.

---

## 🔐 Fixed credentials

- Email: `admin@dynamox.com`
- Password: `123456`

---

## ▶️ How to run

### Requirements
- Node.js 18+ recommended

### Install
```bash
npm install
```
### Run (dev)
```bash
npm run dev
```
### 🧪 Tests
```bash
npm run test:run
```
### Watch mode:
```bash
npm test
```

### Mock API (json-server)

This project uses **json-server** to simulate a REST API.

Run the API:
```bash
npm run server

```
The API will be available at:

http://localhost:3001

Make sure the API is running before using the application.

```json
"scripts": {
  "server": "json-server --watch db.json --port 3001"
}
```


## Project structure (high-level)

- src/routes – routing + private route

- src/features – Redux slices/thunks per domain (auth, machines, monitoring)

- src/services – localStorage persistence adapters

- src/utils – pure functions (validation/sorting/pagination)

- src/pages – screens

- src/components – reusable UI components

- src/test – test setup

## Notes
### This implementation prioritizes:

- Clean separation between UI / state / business rules
- Readability and maintainability
- Correct behavior according to the challenge requirements