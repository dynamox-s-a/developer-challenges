<img src="../frontend/public/dynamoxBanner.png" width="100%"/>

<br>

# ⚙️ Dynamox Challenge - Backend

This is a aplication server which of industry machines, you can have monitoring points of machines and sensors for those monitoring points.

![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## 🧠 Ambiguity Hadling & Design Decisions

To ensure a robust implementation, the following assumptions were made:

- **Bussiness Logic (Sensor Constraints):** The restriction preventing ``TcAg`` and ``TcAs`` sensors from being assigned to Machines with type ``Pump`` is enforced at the **SensorService**. This ensures data integrity even if API is accessed outside the official frontend.

- **Time-Series (Sensor Data) Management:** Requiriment 7.4 (retrieving the number of records) was implemented with a dual-purpose endpoint: it provides a gloabal count for system overview and supports filtering by `sensorId` for specific asset health analysis.

- **Authentication**: As a requirement 1, a fixed admin credential is used. However, I implemented security using **JWT (JSON Web Tokens)** stored in **HttpOnly Cookies** to demonstrate best pratices against XSS and CSRF attacks.

- **Data Immutability:** Times-Series Data (Sensor Data) is treated as immutable. Users can store (7.1) and delete (7.3) records, but not modify them.

## 💻 Tech Stack
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Languege:** TypeScript
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Documentation:** Swagger (OpenAPI)
- **Testing:** Jest

## 👾 Performance & Scalability

- **Optimized Queries:** Database indexes were applied to ``sensorId`` and ``timestamp`` columns to ensure quick data retrieval even as the Sensor Data table grows.

- **Pagination:** Monitoring Points are served in chuncks of **5 items per page** (Requirement 3.4) to minimize payload size and processing time.

## 🧪 Quality Assurence
The project uses Jest for unit testing, focusing on business rules.

```bash
# Run unit tests
npm run test

#Run covarage report
npm run test:cov
```

## 📄 API Documentation
With server running, you can test and explore the endpoints with **Swagger UI**:

``http://localhost:3000/api``

Main Features:
- **Auth:** ``POST /auth/login`` (admin@dynamox.com)
- **Asset Management:** Full CRUD for Machines and Monitoring Points.
- **Telemetry:** Dedicated endpoints for storing, counting and retreving the sensor metrics.

## ⛺ EndPoints

| Category | Method | EndPoint | Description | Key Params |
|-|-|-|-|-|
| **Auth** | ``POST`` | ``/auth/login`` | System authentication | none |
| **Auth** | ``GET`` | ``/auth/logout`` | Logout of system | none |
| **Machine** | ``GET`` | ``/machine`` | List all machines | userId |
| **Machine** | ``POST`` | ``/machine`` | Insert a machine on system | name, type, userId |
| **Machine** | ``GET`` | ``/machine:id`` | Get a machine by it's ID | id |
| **Machine** | ``PUT`` | ``/machine/:id`` | Update any information of machine | name, type |
| **Machine** | ``DELETE`` | ``/machine/:id`` | Delete a machien by ID | id |
| **Monitoring** | ``GET`` | ``/monitoring-point`` | Paginated List (5 per page) | page number |
| **Monitoring** | ``POST`` | ``/monitoring-point`` | Create a Monitoring Point | name, machineId | 
| **Sensor** | ``POST`` | ``/sensor`` | Assign Sensor to point | sensorUid, model, monitoringPointId |
| **Sensor Data** | ``GET`` | ``/sensor-data/:sensorId`` | Get full time-series | sensorId, start, end |
| **Sensor Data** | ``GET`` | ``/sensor-data/count`` | Total records count | sensorId (optional) |

## 📁 Project Structure
The backend follows a modular architecture:
- ``src/auth``: Security guards and JWT strategy.
- ``src/machine``: Asset management and type constraints.
- ``src/monitoringPoint``: Monitoring Point logic and pagination system.
- ``src/prisma``: Configuration of Prisma Client with the PgAdapter.
- ``src/sensor``: Sensor association and validation logic.
- ``src/sensorData:`` Time-series (Sensor Data) ingestion and metrics calculation.