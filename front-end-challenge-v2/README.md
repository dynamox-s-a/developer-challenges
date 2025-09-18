# Dynamox Front-end Challenge v2

Implementation of the **Dynamox Front-end Challenge v2**.  
This project delivers a dashboard application to visualize machine condition data (acceleration, velocity, and temperature) in synchronized time-series charts.

---

## 🚀 Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Redux**
- **Redux-Saga**
- **Material UI v5**
- **Highcharts**
- **Vitest** + **Testing Library**

---

## ⚙️ Setup & Installation

```bash
# install dependencies
npm install

# start mock API (http://localhost:3000)
npm run api

# in another terminal, start dev server (http://localhost:5173)
npm run dev

# build for production
npm run build

# preview production build
npm run preview

---

## 🧪 Running Tests

Unit tests are written with **Vitest** and **Testing Library**.

```bash
# run all tests
npm run test
```

---

## ✨ Features Implemented

- Route `/data` displaying:
  - Machine header information
  - 3 synchronized time-series charts:
    - **Acceleration**
    - **Velocity**
    - **Temperature**
- Charts support hover crosshair & tooltips synchronized by timestamp
- Responsive UI with Material UI v5
- Redux state management with Saga for async fetching
- Mock API consumption via `json-server`
- Unit tests for reducers, sagas, selectors, API helpers, and chart components

---

## 📌 Notes

- Tests are organized alongside the code using `__tests__` folders.
