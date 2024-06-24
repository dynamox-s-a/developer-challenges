# Dynamox Developer Challenges

- [x] Dynamox Full-Stack Developer Challenge

## Start project (with docker)

You will need docker and docker-compose.

`npm start` or `docker-compose up` to start the project then go to `localhost:3000`

|-|-|
|-|-|
|frontend|`localhost:3000`|
|backend|`localhost:3001`|
|database|`localhost:27017`|

## Stop project

`npm stop` or `docker-compose down`

## Start project (without docker)

You will need a running mongoDB.

### Backend

Go to `/backend` folder and edit `.env_example` then rename it to `.env`

Run backend with `npm install` & `npm start`

### Frontend

Go to `/frontend` folder then run `npm install` & `npm start`

## Features

1 - Authentication

1. [x] As a user, I want to log in using a fixed email and password so that I can access private routes.
1. [x] As a user, I want to be able to log out of the system so that I can prevent unauthorized access to my account.
1. [x] No private routes should be accessible without authentication.

2 - Machine Management

1. [x] As a user, I want to create a new machine with an arbitrary name and with a type selected from a list ["Pump", "Fan"] so that I can manage it later.
1. [x] As a user, I want to change the attributes (name and type) of a machine after creating it so that I can keep the machine information updated.
1. [x] As a user, I want to delete a machine when it is no longer in use so that it doesn't clutter the system.

3 - Monitoring Points and Sensors Management

1. [x] As a user, I want to create at least two monitoring points with arbitrary names for an existing machine, so that I can monitor the machine's performance.
1. [x] As a user, I want to associate a sensor to an existing monitoring point so that I can monitor the machine's performance. The sensor should have a unique ID, and the sensor model name should be one of ["TcAg", "TcAs", "HF+"].
1. [x] As a user, I want the system to prevent me from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump".
1. [x] As a user, I want to see all my monitoring points in a paginated list so that I can manage them. The list should display up to 5 monitoring points per page and should include the following information: "Machine Name", "Machine Type", "Monitoring Point Name", and "Sensor Model".
1. [x] As a user, I want to sort the monitoring points list by any of its columns in ascending or descending order, so that I can easily find the information I'm looking for.

4 - Technical requirements

1. [x] Use TypeScript.
1. [x] Use React.
1. [x] Use Redux for managing global states.
1. [x] Use Redux Thunks or Redux Saga for managing asynchronous side effects.
1. [x] Use Next.js or Vite.
1. [x] Use Material UI 5 for styling the application.
1. [x] Create reusable components.
1. [x] The code is well-organized and documented.
1. [x] The application layout is responsive.
The choice of remaining tools is at your discretion.

6 - Bonus

1. [ ] Implement unit tests for the application (let us know how to run them, otherwise we won't be able to evaluate).
1. [x] Implement your own back-end code. If you pick this option, write it using NodeJS JavaScript runtime (not Java, not PHP...). Although we also work with Python here, we are looking for JavaScript related skills in this test.
1. [x] If you choose to implement your own back-end, we encourage you to use either PostgreSQL or MongoDB as a persistence layer.
1. [x] If you choose to use PostgreSQL, use Prisma ORM (or even try Drizzle, or Kysely) to interact with PostgreSQL.
1. [x] If you choose to use MongoDB, use Mongoose ORM to interact with the database;
1. [ ] Use Nest.js Framework for the back-end (we are moving some services to that tool).
1. [ ] Use Nx to manage the whole application as a monorepo (we use that tool a lot here).
1. [ ] Add e2e tests with Cypress (use it to test a full user flow).
1. [ ] If you were provided with a baseline code, identify any areas of bad code or suboptimal implementations and refactor them.
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.

## Test

A postman collection file exists at the root of the project `api.postman_collection.json`. It can be imported into the postman app to test the api.
