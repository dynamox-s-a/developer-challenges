# DynaPredict — Full-Stack Challenge

A small asset-monitoring app inspired by DynaPredict, built for the
[Dynamox full-stack challenge](../full-stack-challenge.md). You log in with a
fixed user, register machines, add monitoring points with sensors, upload
sensor readings as time series and see them in a chart, with metrics.

Everything is connected end to end: the React app talks to a Node.js REST API,
which stores the data in PostgreSQL.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Running the tests](#running-the-tests)
- [Project structure](#project-structure)
- [Design decisions](#design-decisions)
- [API reference](#api-reference)
- [Time-series data](#time-series-data)
- [Assumptions](#assumptions)
- [Performance](#performance)
- [Challenge checklist](#challenge-checklist)
- [Development notes](#development-notes)

## Tech stack

| Layer    | Tools                                                                                     |
| -------- | ----------------------------------------------------------------------------------------- |
| Monorepo | Nx 24, npm workspaces                                                                     |
| Frontend | React 19, TypeScript, Vite, Material UI 5, Redux Toolkit (thunks), React Router, Recharts |
| Backend  | Node.js, Express 5, TypeScript, Prisma 7, PostgreSQL 17, JWT, bcrypt                      |
| Shared   | Zod 4 schemas used by both the API and the web app                                        |
| Tests    | Vitest, React Testing Library                                                             |

## Getting started

The project lives in the `dynapredict/` folder of this repository. **Run every
command below from that folder.**

### Prerequisites

- **Node.js 22.18 or newer.** The API runs its TypeScript files directly,
  using Node's built-in type stripping (no build step).
- **npm 10 or newer** (the project was built with npm 11).
- **Docker** with Docker Compose, for the PostgreSQL database.

### 1. Install the dependencies

```sh
cd dynapredict
npm ci
```

### 2. Start the database

```sh
docker compose up -d
```

This starts PostgreSQL 17 in a container named `dynapredict-db`, on port
**5433** of your computer (to avoid clashing with a local PostgreSQL on 5432).
The data is kept in a Docker volume between restarts.

### 3. Configure the API

Copy the example environment file:

```sh
# macOS / Linux / Git Bash
cp apps/api/.env.example apps/api/.env
```

```powershell
# Windows PowerShell
Copy-Item apps/api/.env.example apps/api/.env
```

The default values already work with the database from step 2:

| Variable             | Default                           | What it is                                      |
| -------------------- | --------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL on `localhost:5433`    | Database connection                             |
| `JWT_SECRET`         | a placeholder with 32+ characters | Key that signs the login tokens (min. 32 chars) |
| `JWT_EXPIRES_IN`     | `3600`                            | Token lifetime, in seconds                      |
| `SEED_USER_EMAIL`    | `admin@dynamox.com`               | Login user created by the seed                  |
| `SEED_USER_PASSWORD` | `dynapredict123`                  | Password of that user (min. 8 chars)            |
| `HOST` / `PORT`      | `localhost` / `3000` (optional)   | Where the API listens                           |

For anything other than local development, replace `JWT_SECRET` with a random
value, for example the output of
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
The API checks these variables when it starts and does not start with an
invalid configuration.

### 4. Prepare the database

```sh
cd apps/api
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
cd ../..
```

- `generate` creates the Prisma client, which is not committed.
- `migrate deploy` creates the tables.
- `db seed` creates the login user. Running it again is safe: it only updates
  the password of the existing user.

### 5. Start the API and the web app

Use two terminals, both in the `dynapredict/` folder:

```sh
npx nx serve api
```

```sh
npx nx serve web
```

The API runs on <http://localhost:3000> and the web app on
<http://localhost:4200>. Vite forwards every `/api` request from the web app
to the API, so no CORS setup is needed.

### 6. Log in

Open <http://localhost:4200> and log in with:

- **E-mail:** `admin@dynamox.com`
- **Password:** `dynapredict123`

A quick tour through every feature:

1. **Máquinas** → **Nova máquina**: create a `Pump` and a `Fan`.
2. **Pontos de monitoramento** → **Novo ponto**: create two or more points.
3. Click the sensor icon of a point and add a sensor, e.g. model `HF+` with
   serial number `DyL4.01.A0001`. On a pump, `TcAg` and `TcAs` are disabled.
4. Sort the list by any column and move between pages (5 points per page).
5. Click a point name → **Enviar série** → **Baixar um exemplo** to download
   a sample CSV, then upload it.
6. Click the series name to see the chart and its metrics.

The user interface is in Brazilian Portuguese.

### Troubleshooting

- **Port 5433 is already in use:** change the left side of `ports` in
  `docker-compose.yml` (e.g. `'5434:5432'`) and the port in `DATABASE_URL`.
- **`Unknown file extension ".ts"` when starting the API:** your Node.js is
  older than 22.18. Check it with `node --version`.
- **The API says the environment variables are invalid:** check
  `apps/api/.env` (step 3). The message lists each wrong variable.
- **Stopping everything:** `Ctrl+C` in both terminals, then
  `docker compose down`. Add `-v` to also delete the database data.

## Running the tests

The API code imports the generated Prisma client, so first do steps 1, 3 and
the `npx prisma generate` of step 4. The database does not need to be
running: the tests do not use it.

```sh
npx nx run-many -t lint test typecheck
```

This runs ESLint, the unit tests and the TypeScript checks of the three
projects: **36** tests in `shared`, **81** in `api` and **141** in `web`.
To run a single project, use its name, e.g. `npx nx test api`.

What is tested:

- **shared:** every validation rule (machines, sensors and serial numbers,
  list parameters, time series).
- **api:** the services with a mocked Prisma client (business rules and
  database errors), the routes through real HTTP requests to the Express app
  (status codes, validation, authentication) and the middlewares.
- **web:** the Redux slices with a mocked API client, and the pages and
  dialogs with React Testing Library, the way a user uses them: typing,
  clicking and reading the screen.

## Project structure

```text
dynapredict/
├── apps/
│   ├── api/                  # Express REST API
│   │   ├── prisma/           # schema and migrations
│   │   └── src/
│   │       ├── config/       # environment variables, validated with Zod
│   │       ├── lib/          # Prisma client, JWT, query parsing
│   │       ├── middlewares/  # authentication, body validation, errors
│   │       ├── modules/      # one folder per resource: routes + service
│   │       └── seed.ts       # creates the login user
│   └── web/                  # React app (Vite)
│       ├── public/           # includes the sample CSV (exemplo-serie.csv)
│       └── src/
│           ├── app/          # store, routes, layout, theme
│           ├── components/   # reusable components
│           ├── features/     # one folder per feature: slice, pages, dialogs
│           └── lib/          # API client, token storage, formatting
├── libs/
│   └── shared/               # Zod schemas and business rules used by both apps
└── docker-compose.yml        # PostgreSQL
```

## Design decisions

- **One set of validation rules for both sides.** The Zod schemas in
  `libs/shared` validate the forms in the web app and the request bodies in
  the API. A rule such as "a pump does not accept TcAg or TcAs sensors" is
  written only once.
- **Feature folders.** Each feature keeps its Redux slice, pages, dialogs and
  tests together (`features/machines`, `features/time-series`...). In the API,
  each resource has a routes file (HTTP) and a service file (business rules
  and database access).
- **Redux Toolkit with thunks** for all server data. The monitoring points
  list, the point page and the time-series page cancel their requests when the
  user leaves them or asks for other data, so a late answer never replaces a
  newer one.
- **Reusable components**, such as `ConfirmDeleteDialog`, used by every
  delete confirmation.
- **One error format.** Every error answer has the shape
  `{ "error": { "code", "message", "details"? } }`, and the web app shows the
  `message` to the user.
- **The database also protects the rules:** unique serial numbers, one sensor
  per point, a `CHECK` constraint on the sensor model, and cascading deletes
  (machine → points → sensor and time series → samples).
- **Time series built for speed** (see [Performance](#performance)): the
  samples are inserted with a single SQL statement, the metrics are computed
  by PostgreSQL, and a summary (number of samples, first and last instant) is
  saved with each series, so listing series never counts samples.
- **Responsive layout:** the side menu becomes a drawer on small screens, and
  tables scroll inside their own box instead of the whole page.

## API reference

All routes start with `/api`. Except for `/api/health` and
`/api/auth/login`, they require the header `Authorization: Bearer <token>`,
and answer `401` without a valid token.

| Method | Route                                     | What it does                                         | Success |
| ------ | ----------------------------------------- | ---------------------------------------------------- | ------- |
| GET    | `/health`                                 | API and database status                              | 200     |
| POST   | `/auth/login`                             | Log in; returns `{ token, user }`                    | 200     |
| GET    | `/auth/me`                                | The logged-in user                                   | 200     |
| GET    | `/machines`                               | List the machines, newest first                      | 200     |
| GET    | `/machines/:id`                           | One machine                                          | 200     |
| POST   | `/machines`                               | Create a machine: `{ name, type }`                   | 201     |
| PUT    | `/machines/:id`                           | Change the name and the type                         | 200     |
| DELETE | `/machines/:id`                           | Delete a machine and everything under it             | 204     |
| POST   | `/machines/:machineId/monitoring-points`  | Create a point on a machine: `{ name }`              | 201     |
| GET    | `/monitoring-points`                      | Paginated, sorted list (parameters below)            | 200     |
| GET    | `/monitoring-points/:id`                  | One point, with its machine and sensor               | 200     |
| DELETE | `/monitoring-points/:id`                  | Delete a point, its sensor and its time series       | 204     |
| PUT    | `/monitoring-points/:id/sensor`           | Set or replace the sensor: `{ model, serialNumber }` | 200     |
| DELETE | `/monitoring-points/:id/sensor`           | Remove the sensor                                    | 204     |
| GET    | `/monitoring-points/:pointId/time-series` | Time series of a point (summaries, latest first)     | 200     |
| POST   | `/monitoring-points/:pointId/time-series` | Store a time series: `{ name, unit?, samples }`      | 201     |
| GET    | `/time-series/count`                      | Number of stored time series: `{ count }`            | 200     |
| GET    | `/time-series/:id`                        | A full time series, samples in time order            | 200     |
| GET    | `/time-series/:id/metrics`                | Count, min, max, mean, standard deviation and RMS    | 200     |
| DELETE | `/time-series/:id`                        | Delete a time series and its samples                 | 204     |

**Parameters of `GET /monitoring-points`:** `page` (from 1, default `1`),
`pageSize` (1 to 50, default `5`), `sortBy` (`machineName`, `machineType`,
`pointName` or `sensorModel`, default `machineName`) and `order` (`asc` or
`desc`, default `asc`). The answer is `{ items, total, page, pageSize }`.

**Errors:**

| Status | When                                                                                                                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Invalid body, invalid JSON or invalid list parameters (`details` says which field)                                                     |
| 401    | Missing, invalid or expired token; wrong e-mail or password                                                                            |
| 404    | The machine, point, sensor or time series does not exist; unknown route                                                                |
| 409    | Serial number already used by another sensor; time series sent to a point without a sensor; machine type change blocked by its sensors |
| 413    | Request body over 2 MB                                                                                                                 |
| 422    | Sensor model not accepted by the machine type (TcAg or TcAs on a pump)                                                                 |

## Time-series data

A **time series** is a batch of readings sent at once for a monitoring point,
such as a day of temperature readings. It has a name (e.g. `Temperatura`), an
optional unit (e.g. `°C`) and from 1 to 10,000 **samples**. Each sample is an
instant and a number:

```json
{
  "name": "Velocidade RMS",
  "unit": "mm/s",
  "samples": [
    { "timestamp": "2026-11-22T10:00:00Z", "value": 2.2 },
    { "timestamp": "2026-11-22T07:15:00-03:00", "value": 2.35 }
  ]
}
```

In the web app, a series is uploaded from a **CSV file** with one sample per
line, `instant,value`:

```text
instante,valor
2026-11-22T00:00:00-03:00,1.680
2026-11-22T00:15:00-03:00,1.740
```

- The header line is optional, and blank lines are ignored.
- The CSV that Excel saves in Portuguese also works: `;` as the separator and
  a comma as the decimal mark (`2026-11-22T00:00:00-03:00;1,68`).
- A sample file can be downloaded in the upload dialog (**Baixar um
  exemplo**). It is `apps/web/public/exemplo-serie.csv`.
- Errors point to the line of the file, for example:
  `Linha 5: Use data e hora com fuso, ex.: 2026-11-22T10:00:00Z`.

The **metrics** (`GET /time-series/:id/metrics`) are computed over all the
samples of the series: number of samples, minimum, maximum, mean, population
standard deviation and RMS (root mean square, `sqrt(avg(value²))`).

The **chart** shows the samples on a time axis, in the browser's time zone,
with a dashed line at the mean. Hovering over it shows the exact instant and
value.

## Assumptions

The challenge leaves some points open. These are the choices I made.

### Authentication

- There is **one fixed user**, created by the seed from `SEED_USER_EMAIL` and
  `SEED_USER_PASSWORD`. There is no sign-up and no password change.
- Since there is a single user, all data belongs to that user: machines and
  points are not linked to a user account.
- Logging in returns a **JWT** that lasts 1 hour (`JWT_EXPIRES_IN`). The web
  app keeps it in `localStorage`, so the session survives a page reload.
- **Logout happens in the browser:** the token is discarded. The API is
  stateless and keeps no list of revoked tokens, so a copied token stays valid
  until it expires.
- When the token expires, the next request answers `401`. The app then logs
  the user out and, after a new login, goes back to the page they were on.
- A wrong e-mail and a wrong password get the same answer, in about the same
  time, so the login does not reveal which e-mails exist.

### Machines

- Names are trimmed, have 1 to 100 characters and **do not need to be
  unique**.
- The pump rule works both ways. Besides refusing a TcAg or TcAs sensor on a
  pump, the API refuses to turn a fan into a pump while it has TcAg or TcAs
  sensors (`409`): those sensors have to be replaced or removed first.
- Deleting a machine deletes its points, sensors and time series. The
  confirmation dialog says so.

### Monitoring points

- "At least two monitoring points" is read as "a machine can have several
  points": there is no minimum or maximum per machine.
- Point names follow the same rules as machine names (1 to 100 characters,
  not unique).
- A point belongs to the same machine for its whole life. Editing points was
  not required, so points can be created and deleted, but not renamed.
- The list shows 5 points per page. The database sorts all the points, not
  only the visible page. Ties are broken by machine name and then point name,
  so the order never changes between pages.
- Sorting details:
  - Machine types are sorted alphabetically (`Fan` before `Pump`).
  - Sensor models are sorted as text: `HF+`, `TcAg`, `TcAs`.
  - Points **without a sensor** come last in ascending order and first in
    descending order.
- When the last point of a page is deleted, the list goes back to the
  previous page.

### Sensors

- The sensor's **unique ID is its serial number**, in the format of real
  Dynamox sensors: `DyL<model digit>.<2 digits>.<letter><4 digits>`, e.g.
  `DyL4.01.A0001`. The digit after `DyL` must match the model: `1` for TcAg,
  `0` for TcAs and `4` for HF+.
- Serial numbers are accepted in any letter case and saved in the standard
  form (`dyl4.01.a0001` becomes `DyL4.01.A0001`), so the same sensor cannot be
  registered twice with a different case.
- A point has **at most one sensor**, and a serial number can be on one point
  only. Setting a sensor on a point that already has one replaces it.
- Removing a sensor keeps the time series it sent.

### Time series

- A time series belongs to the **monitoring point**, not to the sensor, and
  saves the serial number of the sensor that was installed when it was
  uploaded. This way the history stays when a sensor is replaced or removed.
- The data comes from a sensor, so a point needs a sensor to receive a time
  series (`409` otherwise).
- A series has from 1 to 10,000 samples; larger data sets can be sent as more
  than one series. This keeps each upload fast (see
  [Performance](#performance)).
- Instants must include a time zone (`Z` or `-03:00`): without one, the same
  text would mean different instants on different computers. Instants before
  1970 and repeated instants in the same series are refused. Values must be
  finite numbers.
- A series cannot be edited after the upload, only deleted.
- "The number of time series I've stored" is the total for the whole system.
  The web app shows it under the title of the monitoring points page.
- The time series of a point are shown in a single list, without pagination.
- Dates are shown in the user's time zone, in the Brazilian format.

## Performance

The challenge asks for every request to take less than 350 ms. These numbers
were measured on a local machine (Windows 11, PostgreSQL 17 in Docker
Desktop), with a new database holding 20 machines and 60 monitoring points,
calling the API directly 30 times for each request:

| Request                                                         | Median | 95th percentile | Slowest |
| --------------------------------------------------------------- | ------ | --------------- | ------- |
| `POST /auth/login`                                              | 72 ms  | 78 ms           | 79 ms   |
| `GET /auth/me`                                                  | 3 ms   | 4 ms            | 4 ms    |
| `GET /machines`                                                 | 3 ms   | 4 ms            | 4 ms    |
| `POST /machines`                                                | 5 ms   | 6 ms            | 6 ms    |
| `PUT /machines/:id`                                             | 7 ms   | 11 ms           | 16 ms   |
| `DELETE /machines/:id`                                          | 6 ms   | 7 ms            | 9 ms    |
| `POST /machines/:machineId/monitoring-points`                   | 6 ms   | 7 ms            | 7 ms    |
| `GET /monitoring-points` (every column, both orders)            | 6 ms   | 8 ms            | 8 ms    |
| `GET /monitoring-points/:id`                                    | 4 ms   | 5 ms            | 6 ms    |
| `PUT /monitoring-points/:id/sensor`                             | 7 ms   | 9 ms            | 10 ms   |
| `DELETE /monitoring-points/:id/sensor`                          | 6 ms   | 7 ms            | 7 ms    |
| `DELETE /monitoring-points/:id`                                 | 5 ms   | 6 ms            | 6 ms    |
| `POST /monitoring-points/:pointId/time-series` (10,000 samples) | 124 ms | 182 ms          | 214 ms  |
| `GET /monitoring-points/:pointId/time-series`                   | 4 ms   | 5 ms            | 7 ms    |
| `GET /time-series/:id` (10,000 samples)                         | 47 ms  | 56 ms           | 69 ms   |
| `GET /time-series/:id/metrics` (10,000 samples)                 | 5 ms   | 7 ms            | 9 ms    |
| `GET /time-series/count`                                        | 3 ms   | 4 ms            | 4 ms    |
| `DELETE /time-series/:id` (10,000 samples)                      | 57 ms  | 77 ms           | 92 ms   |

Logging in is slower on purpose: checking the password with bcrypt is meant
to be expensive, to make guessing passwords slow.

The heaviest request is storing a series with the maximum of 10,000 samples.
Two choices keep it fast:

- **One `INSERT` for all the samples.** With Prisma's `createMany`, storing
  10,000 samples took about 270 ms (median), with peaks over 350 ms.
  Inserting them with PostgreSQL's `unnest` in a single statement, in the same
  transaction that creates the series, takes about half of that.
- **A limit of 10,000 samples per series**, which also keeps the request body
  under 1 MB (the API accepts up to 2 MB).

A known limit: in a stress test that wrote and deleted more than a million
samples in a few minutes, some uploads took up to a few seconds while
PostgreSQL cleaned up the deleted rows in the background (autovacuum), on
Docker Desktop. Once the cleanup finished, the times went back to the ones
above. That load is far beyond normal use, and I did not tune the database
for it.

## Challenge checklist

| Section               | Status                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1. Authentication     | Done: fixed user, logout, every private route requires login (in the web app and in the API)                                      |
| 2. Machines           | Done: create, edit and delete, with type `Pump` or `Fan`                                                                          |
| 3. Points and sensors | Done: several points per machine, sensors with a unique ID and a model, the pump rule, 5 points per page, sorting by every column |
| 4. Ambiguity          | Done: see [Assumptions](#assumptions)                                                                                             |
| 5. Technical          | Done: TypeScript, React, Redux Toolkit with thunks, Vite, Material UI 5, reusable components, responsive layout, unit tests       |
| 6. Back-end           | Done: Node.js, PostgreSQL with Prisma, REST endpoints, validation and error handling, unit tests, requests under 350 ms           |
| 7. Time series        | Done: store, metrics, delete, count, full series and chart                                                                        |
| 8. Bonus              | Nx monorepo only. Cypress e2e tests, cloud deploy, prediction, load balancer and load tests were not implemented                  |

## Development notes

- **Commit history.** Before I had access to this repository, I built a local
  prototype. Once I had access, I rebuilt that part here by hand, one commit
  at a time: from `chore: scaffold nx workspace with react app` to
  `feat(web): validate session and log out on expired token`. Everything after
  that was developed directly in this branch.
- **Use of AI.** I used an AI assistant (Claude) as a guide during the whole
  project: it explained concepts and proposed the steps and some of the code.
  I applied every change myself, ran the tests and checks, tested the app in
  the browser and reviewed each commit before pushing it.
- **Language.** The user interface and the code comments are in Brazilian
  Portuguese. Code identifiers, commit messages and this README are in
  English.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/).
