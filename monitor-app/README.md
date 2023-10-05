# MonitorApp

Code for Dynamox Full-Stack Developer Challenge

## Clone the Repository

```
git clone https://github.com/pagnojp/js-ts-full-stack-test.git
```

## Open the Project Directory

```
cd js-ts-full-stack-test/
```

## Checkout to Branch

```
git checkout joaopedro-pagno
```

## Install packages

Inside `monitor-app/` directory, run:

```
npm i
```

## Backend

Inside `apps/api/` directory, rename .env.example file to .env

```
mv .env.example .env
```

To start the database docker container, inside `apps/api/` directory run:

```
docker compose up -d monitor-app-postgres
```

Run prisma migrations:

```
npx prisma migrate dev
```

Run db seed:

```
npx prisma db seed
```

Start server:

```
nx start:prod api
```

## Frontend

Inside `apps/client/` directory, rename .env.example file to .env

```
mv .env.example .env
```

Inside `monitor-app/` directory, run:

```
nx build client
```

Start server:

```
nx serve client --configuration production
```

## Login

email: teste@dynamox.net

password: dynamox

## Tests (backend)

Inside `monitor-app/` directory, run:

```
nx test api
```

## Tests (frontend)

Inside `monitor-app/` directory, run:

```
nx test client
```

## Tests (frontend-e2e)

Stop database docker container:

```
docker compose stop
```

To start the test database docker container, inside `apps/api/` directory run:

```
docker compose up -d monitor-app-postgres-test
```

Run prisma migrations:

```
npx prisma migrate dev
```

Run db seed:

```
npx prisma db seed
```

Start server:

```
nx start:prod api
```

Inside `apps/client-e2e/` directory, rename cypress.env.json.example file to cypress.env.json

```
mv cypress.env.json.example cypress.env.json
```

Inside `apps/client-e2e/` directory, rename .env.example file to .env

```
mv .env.example .env
```

Inside `monitor-app/` directory, run:

```
nx e2e client-e2e --configuration production
```

## Online Access

You can access the online demo: <a href="https://monitor-app-orpin.vercel.app/" target="_blank">[monitor-app-orpin.vercel.app]</a>

and login with:

email: teste@dynamox.net

password: dynamox
