# Fullstack challenge

This directory contains implementations for a webpage, containing both the frontend and backend services.

---

## Setup

The development and tests were done both in a Linux environment. Here are the tools/packages that are needed to run all the services for this project:

- make
- npm
- npx
- drizzle-kit
- sqlite

The frontend was based on a [Devias Kit](https://github.com/devias-io/material-kit-react) template, which runs using Next.js. Also, some component examples found in the [MUI documentation](https://v6.mui.com/base-ui/getting-started/) were utilized to speed up the process, such as tables and buttons.

The backend server was made from scratch using Nest.js. For data persistence, I choose to use Drizzle + SQLite to maintain the database.

---

## Instructions

In this folder you will find a makefile containing targets to build and deploy the page and the backend server. There is no target to simultaneosly run both target, so you need to run each in a separate terminal.

### Running the backend server

Build the service:

```
make build_server
```

When the build is finished, if succesful, run the service with:

```
make run_server
```

Alternatively, you can use a target that build and then run the service:

```
make server
```

### Running the frontend

Build the pages:

```
make build_app
```

When the build is finished, if succesful, run the application with:

```
make run_app
```

Alternatively, you can use a target that build and then run the application:

```
make app
```

---

## Notes