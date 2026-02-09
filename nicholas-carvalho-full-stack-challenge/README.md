<img src="./frontend/public/dynamoxBanner.png" width="100%"/>

<br>

# Dynamox Full-Stack Challenge

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NextJS](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![MaterialUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

This repository contains the complete solution to the challenge of monitoring industrial assets of Dynamox. The application integrates an robust API with NestJS.

## 🏗️ System Architecture & Integration

The project it's structured with a monorepo that clearly separates the responsibilities, ensuring a scalable solution and ease of maintenance.

- **Frontend:** Developed with **Next.js** & **Redux Toolkit**, focused in a fluid user experience and data visualizations at real time.

- **Backend:** An API RESTful build with **NestJS** & **PrismaORM**, granting integrity of datas and high performance with consults in **PostgreSQL.**


## 🐋 How to Run (Quick Start)
With **Docker**, you can raise the ecossistem (Database, API & Client) with an unique command.

1. Clone the repository:
```bash
git clone https://github.com/nicholas-sc-08/developer-challenges.git
cd developer-challenges
```

2. Start the services:
```bash
docker compose-up --build
```

3. Access points:
- **Frontend:** http://localhost:3000
- **API Documentation (Swagger):** http://localhost:3001/api

## ✨ Solved Ambiguites & Key Decisions (Requiriment 4)
As solicitated, I documentated here the assumed premisses:

- **Strict Latency (SLA 350ms):** I implementated otimizations of Database and interceptors of timeout on frontend to garantee that all of HTTP requisitions stays bellow the limit of 350ms.

- **Security:** The **JWT** authentication flow it's stored in **HttpOnly Cookies,** protecting private routes and mitigating XSS attacks.

- **Sensor Constants:** The business rule that Sensors of model ``TcAg``/``TcAs`` in Machines of type ``Pump``, is not valid both in interface (Dinamic UI) and also in backend service layer (Data integrity).

## 🧪 Test Coverage
The project prioritize the confibility in unit tests in both of fronts:
- **Backend:** Unit tests for machines services.
- **Frontend:** Logic validation of utilities.

```bash
# Run backend tests
npm run test --prefix backend

# Run frontend tests
npm run test --prefix frontend
```

## 📁 Repository Map
- <a href="https://github.com/nicholas-sc-08/developer-challenges/tree/nicholas-carvalho/frontend">``/frontend``</a>: Details of Material UI & UX.
- <a href="https://github.com/nicholas-sc-08/developer-challenges/tree/nicholas-carvalho/backend">``/backend``</a>: Details of Prisma, Swagger & Business logic.

## 📊 Visualization of Time-Series (Graphic)
To attend the requisit (7.6), I implemented a area of telemetry where the user can see the health of Machine in real time.

- **Tecnology:** I utilizated the libary **Recharts**, because of it's active integration with React.

- **Funcionability:** The graphic consume the datas of Sensors from backend and renderizate the metrics of vibration and temperature, allowing an tecnic precise analytic of the associated Sensor.

## 🎯 Requirements Checklist

- [x] **Authentication:** JWT & Private Routes
- [x] **Machine Management:** CRUD & Business Rules
- [x] **Sensor Management:** Pagination & Model Restrictions
- [x] **Time-Series Data:** Ingestion & Visualization
- [x] **Performance:** Latency < 350ms
- [x] **Tests:** Automated Unit Tests (Frontend & Backend)
- [x] **DevOps:** Docker & Docker Compose orchestration