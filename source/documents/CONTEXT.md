# The Project

I need a project for registering machines and monitoring points. the machines can be motors, fans, pumps, compressors, gearboxes, rollers, harversters, overhead cranes, yard equipment, wind turbines and bearings, each with unique characteristics and properties. As for the sensors, we have three: TcAg, TcAs and HF+. 

# Glossary

## General

**Machines:** Any type of equipment which properties and performance can be monitored by any Sensor.

**Sensors:** An equipment capable of reading and processing information about a Machine.

**Monitoring Point:** A characteristic of a Machine that can be read and interpreted by a Sensor.

## Sensors:

## Comparativo Técnico: Sensores DynaLogger

| Característica | DynaLogger HF+/HF+s | DynaLogger TcAg | DynaLogger TcAs |
| :--- | :--- | :--- | :--- |
| **Perfil de Uso** | Monitoramento triaxial de vibração e temperatura para equipamentos de baixa a alta velocidade. | Identificação de tendência e severidade de defeitos em conformidade com a ISO 20816. | Identificação de sintomas de falha ou defeitos em conformidade com a ISO 20816. |
| **Frequência Máxima** | Até 13 kHz. | Até 2.5 kHz. | Até 2.5 kHz. |
| **Modos de Monitoramento** | Espectral/forma de onda e telemetria. | Monitoramento de telemetria completa. | Espectral/forma de onda e telemetria. |
| **Principais Aplicações** | Motores, bombas, ventiladores, compressores e turbinas eólicas. | Máquinas rotativas, chassis, suspensões, válvulas e painéis elétricos. | Motores, bombas, ventiladores, polias e eixos cardan. |
| **Diferencial** | Amplo espectro de frequência e alta resolução em amplitude. | Monitoramento minuto a minuto em um dos menores sensores do mercado. | Alta resolução espectral de até 91.200 linhas. |
| **Eixos de Medição** | Medição triaxial simultânea. | Medição triaxial simultânea. | Medição triaxial simultânea. |
| **Bateria (Autonomia)** | 5 anos. | 5 anos. | 5 anos. |
| **Comunicação** | Bluetooth BLE 5.3. | Bluetooth BLE 5.3. | Bluetooth BLE 5.3. |

---

### Informações Técnicas Gerais

* **Monitoramento de Temperatura**: Todos os sensores possuem resolução de 0.01°C para temperatura de contato.
* **Capacidade de Memória**: Os dispositivos possuem memória ajustável para 51.200 amostras.
* **Resistência Ambiental**: Possuem certificações IP66, IP68 e IP69K para proteção contra poeira e água.
* **Instalação**: Devem ser instalados em partes rígidas da máquina, preferencialmente próximos aos mancais.
* **Sinalização**: LED integrado nas cores vermelho e verde para sinalização visual.

# Oficial Requirements

## 1 - Authentication

- As a user, I want to log in using a fixed email and password so that I can access private routes.
- As a user, I want to be able to log out of the system so that I can prevent unauthorized access to my account.
- No private routes should be accessible without authentication.

## 2 - Machine Management

- As a user, I want to create a new machine with an arbitrary name and with a type selected from a list ["Pump", "Fan"] so that I can manage it later.
- As a user, I want to change the attributes (name and type) of a machine after creating it so that I can keep the machine information updated.
- As a user, I want to delete a machine when it is no longer in use so that it doesn't clutter the system.

## 3 - Monitoring Points and Sensors Management

- As a user, I want to create at least two monitoring points with arbitrary names for an existing machine, so that I can monitor the machine's performance.
- As a user, I want to associate a sensor to an existing monitoring point so that I can monitor the machine's performance. The sensor should have a unique ID, and the sensor model name should be one of ["TcAg", "TcAs", "HF+"].
- As a user, I want the system to prevent me from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump".
- As a user, I want to see all my monitoring points in a paginated list so that I can manage them. The list should display up to 5 monitoring points per page and should include the following information: "Machine Name", "Machine Type", "Monitoring Point Name", and "Sensor Model".
- As a user, I want to sort the monitoring points list by any of its columns in ascending or descending order, so that I can easily find the information I'm looking for.

## 4 - Ambiguity Handling

- Make reasonable assumptions and design the application accordingly for any ambiguities in the challenge.
- Document your assumptions in the README file.

## 5 - Technical requirements

- Use TypeScript.
- Use React.
- Use Redux for managing global states.
- Use Redux Thunks or Redux Saga for managing asynchronous side effects.
- Use Next.js or Vite.
- Use Material UI 5 for styling the application.
- Create reusable components.
- The code is well-organized and documented.
- The application layout is responsive.
- Ensure correct business logic and behavior with automated unit tests.

## 6 - Back-end Requirements

- Implement your own back-end code using NodeJS JavaScript runtime (not Java, not PHP...). Although we also work with Python here, we are looking for JavaScript related skills in this test.
- Use either PostgreSQL or MongoDB as a persistence layer.
- If you choose to use PostgreSQL, use Prisma ORM (or even try Drizzle, or Kysely) to interact with PostgreSQL.
- If you choose to use MongoDB, use Mongoose ORM to interact with the database.
- Implement RESTful API endpoints for all required functionality (authentication, machine management, sensor management).
- Implement time-series data storage and retrieval functionality for sensor data.
- Ensure the API has proper error handling and validation.
- Implement unit tests for backend code.
- The latency between client and the server side should be below 350ms for all requests.

## 7 - Time-Series Data Management

- As a user, I want to be able to store raw sensor data as time-series for my monitoring points.
- As a user, I want to be able to retrieve metrics about the time-series data for my sensors.
- As a user, I want to be able to delete time-series data I've sent to the server.
- As a user, I want to be able to retrieve the number of time-series I've stored in the server.
- As a user, I want to be able to retrieve a full time-series I've stored.
- As a user, I want to be able to visualize time-series data in a chart or graph format.

## 8 - Bonus

- Use Nx to manage the whole application as a monorepo (we use that tool a lot here).
- Add e2e tests with Cypress (use it to test a full user flow).
- If you were provided with a baseline code, identify any areas of bad code or suboptimal implementations and refactor them.
- Deploy your application to a cloud provider and provide a link for the running app.
- Implement a functionality that gives a future prediction of the time-series data.
- Add load balancer to the application.
- Add load tests to the application.

## 9 - Tips

- There is no need to reinvent the wheel. You can use a Material UI 5 free template like [Devias Kit](https://mui.com/store/items/devias-kit/) to speed up the development process.
- Not familiar with Redux? Check out [this tutorial](https://egghead.io/courses/modern-redux-with-redux-toolkit-rtk-and-typescript-64f243c8) to get started.
- Not familiar with Cypress? Check out [these tutorials](https://learn.cypress.io/) to get started.
- For time-series data visualization, consider using libraries like [Recharts](https://recharts.org/), [Chart.js](https://www.chartjs.org/), or [D3.js](https://d3js.org/).



# Project Requirements Summary

## 1. Business Requirements
- **Domain Logic:** Management of industrial equipment categorized as either `Pump` or `Fan`.
- **Operational Constraints:** 
  - `Pump` type machines are strictly prohibited from using **TcAg** or **TcAs** sensors.
  - Each machine must support a minimum of two monitoring points.
- **Performance Standards:** Maximum allowable latency of **350ms** for all API requests.
- **Transparency:** All architectural assumptions and ambiguity resolutions must be documented in the project README.
- **Data Integrity:** Mandatory unique IDs for sensors and strict adherence to the model list: `TcAg`, `TcAs`, and `HF+`.



## 2. User Requirements
- **Access Control:** 
  - Authentication via fixed credentials (email/password).
  - Secure session termination (Logout).
  - Full protection of private routes.
- **Asset Management:** 
  - CRUD functionality for Machines (Name/Type).
  - Ability to define Monitoring Points and associate specific Sensors.
- **Data Interaction:**
  - View a paginated list (5 items/page) of monitoring points with sorting capabilities.
  - Store and delete raw time-series sensor data.
  - Retrieve total counts and full datasets of time-series records.
- **Visualization:** Ability to view sensor performance and metrics through charts/graphs.



## 3. System Requirements
- **Frontend Architecture:**
  - **Core:** React & TypeScript.
  - **Environment:** Next.js
  - **State:** Redux (with Thunks or Sagas) for global state and async side effects.
  - **UI/UX:** Material UI 5 with responsive, reusable components.
- **Backend Architecture:**
  - **Runtime:** Node.js.
  - **API:** RESTful endpoints with validation and error handling.
  - **Persistence:** * PostgreSQL (with Prisma/Drizzle/Kysely) OR MongoDB (with Mongoose).
  - Specialized implementation for time-series data storage.
- **Quality & DevOps:**
  - Mandatory automated unit tests for both client and server.
  - (Bonus) Nx Monorepo, Cypress E2E tests, Cloud Deployment, and Load Balancing.

# References

1. [GitHub - Dynamox Full-Stack Developer Challenge](https://github.com/dynamox-s-a/developer-challenges/blob/main/full-stack-challenge.md)
2. [Dynamox - Sensors](https://dynamox.net/en/sensors)