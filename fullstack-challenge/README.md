# Fullstack challenge

This directory contains implementations for a webpage, containing both the frontend and backend services.

---

## Setup

The development and tests were done both in an Arch-based Linux environment. Here are the tools/packages that are needed to run all the services for this project:

- make
- npm
- NodeJs (^25.3.0)

The frontend was based on a [Devias Kit](https://github.com/devias-io/material-kit-react) template, which runs using Next.js. Also, some component examples found in the [MUI documentation](https://v6.mui.com/base-ui/getting-started/) were utilized to speed up the process, such as tables and buttons.

The backend server was made from scratch using Nest.js. For data persistence, I choose to use Drizzle + SQLite to maintain the database.

---

## Instructions

In this folder you will find a makefile containing targets to build and deploy the page and the backend server. There is no target to simultaneously run both targets, so you need to run each in a separate terminal.

With both services running, the page will be provided in `localhost:3000` and the backend server will listen to `localhost:3001`.

### Running the backend server

Build the service:

``` bash
make build_server
```

When the build is finished, if successful, run the service with:

``` bash
make run_server
```

Alternatively, you can use a target that builds and then runs the service:

``` bash
make server
```

### Running the frontend

Build the pages:

```bash
make build_app
```

When the build is finished, if successful, run the application with:

```bash
make run_app
```

Alternatively, you can use a target that builds and then runs the application:

```bash
make app
```

---

## Notes

### Development process

The project was developed from frontend to backend. After spending some time to understand the structure of the sample project, I've done research on MUI components that I could use to build the UI. I experimented with the idea of modal components to handle the user actions, such as creating and deleting elements, but opted to use a table component ([DataGrid](https://mui.com/x/react-data-grid/editing/)) with the actions UI already provided so I could just implement them on the component.

While implementing the pages and components to display the machine and monitoring points data, I decided to turn the table component into a reusable component, that as inputs would require structures and functions needed to display and interact with the tables, so I could use the same table component for both machines and monitoring points (while also giving support to easily create new pages), changing only the structures and functions provided.

For the backend, I started exploring the Drizzle module and implementing the structure for the methods that would have to exist to provide the features that the frontend needed. With the database working, I focused on getting the backend working, using curl to manually test all routes.

With both the frontend and backend working (mostly) as expected by themselves, I tackled the task of integrating them so that the frontend would fetch the data from the backend and any changes done to the data (add, update or delete) would be stored in the database. This process required many tweaks in both the frontend and backend but there were no significant architectural changes.

### QA sessions

In this section, I aim to analyze some aspects of the project that could be improved, such as:

- The login/logout feature is handled exclusively in the frontend. This does not provide a strong security layer. A table such as `User` should be created in the database, and the login and access validation should be handled in the backend;
- The frontend architecture could be revised to provide more maintainability, flexibility, and reusability for its components and methods, such as the backend that was made from scratch already has;
- The frontend aesthetic could be improved for better user experience, such as the tables rows and columns better occupy the component space;
- Some interactions could be better provided for better user experience, such as:
  - When clicking on the plus icon to create a new item, the table should refresh to display the new entry;
  - When clicking on the trash icon, would be interesting to have a confirmation box/dialog to prevent user errors;
  - When deliting a machine, the user should be notified that this cascade to the monitoring points, deleting any entry that references that machine;
  - When sacing changes to a row, the user should be kept in the table page it was instead of being moved back to the first;
  - When providing invalid data for a row, such as giving a invalid `Machine ID` for a monitoring point, the page should notify the user instead of silently receiving the failure from the backend;
  - The `Machine ID` value should include a selector for the valid options;
- In the `InteractiveTable` component, the could be some improvements:
  - The component include some definitions based on the `any` type. This represents a safety issue and could be fixed using generics, to keep the component flexibility while maintaining type safety;
  - With the proper changes, the `rowTemplate` argument could be removed, easing the reusability of the component;
  - The code could be rearranged for better readability;
- Would be helpful to implement logging mechanisms to help during debugging and troubleshooting;
- The project should have unit and integration tests, as well as targets that run them before building;
