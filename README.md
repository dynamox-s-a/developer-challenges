# Full-Stack Challenge: Sensory Application

This repository contains a full-stack application built for the Dynamox Full-Stack Developer Challenge. The project is a robust and intuitive platform for managing industrial assets, including machines, sensors, and their associated time-series data. It features a complete end-to-end flow, from a React-based frontend to a Next.js backend with a persistent MongoDB database.

## Live Demo

A deployed version of the application is available for demonstration:

[**https://fullstack-dynamox.vercel.app**](https://fullstack-dynamox.vercel.app)

## Features

-   **Authentication:** Secure user registration and login system using JWT for session management.
-   **Machine Management:** Full CRUD (Create, Read, Update, Delete) functionality for machines.
-   **Sensor Management:** Create and associate sensors with specific monitoring points, including business logic to prevent invalid associations (e.g., "TcAg" sensors on a "Pump" machine).
-   **Monitoring Point Management:** Create and view monitoring points associated with machines and sensors.
-   **Time-Series Data:** Store, retrieve, visualize, and analyze time-series data from sensors. Includes features for viewing metrics (average, min, max), data counts, and deleting data points.
-   **Data Visualization:** An interactive dashboard displaying all monitoring points in a paginated, sortable data table, alongside statistical cards and detailed chart views for time-series analysis.

## Tech Stack

-   **Framework:** Next.js (App Router for frontend and API routes)
-   **Language:** TypeScript
-   **Frontend:** React, Redux Toolkit
-   **UI/Styling:** Material-UI 5, Tailwind CSS
-   **Data Visualization:** Recharts
-   **Backend:** Next.js API Routes
-   **Database:** MongoDB with Mongoose ORM
-   **Authentication:** JSON Web Tokens (JWT)
-   **Validation:** Zod
-   **Testing:** Jest & React Testing Library
-   **Containerization:** Docker

## Getting Started

You can run the project locally using either Docker or a manual setup.

### 1. Running with Docker (Recommended)

This is the simplest way to get the application and its database running.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nandoschlemper/fullstack-challenge.git
    cd fullstack-challenge/web
    ```

2.  **Create an environment file:**
    Copy the example environment file. The default values are configured for the Docker Compose setup.
    ```bash
    cp .env.example .env
    ```

3.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

### 2. Manual Setup

If you prefer to run the application and database separately.

1.  **Prerequisites:**
    -   Node.js (v20 or later)
    -   pnpm (`npm install -g pnpm`)
    -   A running MongoDB instance.

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/nandoschlemper/fullstack-challenge.git
    cd fullstack-challenge/web
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file by copying `.env.example` and update the variables with your local configuration, especially `MONGODB_URI` and `JWT_SECRET`.
    ```bash
    cp .env.example .env
    ```
    *Example `.env` content:*
    ```
    MONGODB_URI=mongodb://localhost:27017/your_db_name
    JWT_SECRET=a-very-strong-secret-key
    JWT_EXPIRES_IN=1d
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```

6.  **Access the application:**
    Open your browser and navigate to `http://localhost:3000`.

## Project Structure

The project follows a feature-driven structure within the Next.js App Router paradigm.

```
web/
├── src/
│   ├── app/                # Next.js App Router (Pages and API Routes)
│   │   ├── api/            # Backend API endpoints
│   │   │   ├── auth/       # Authentication (login, register)
│   │   │   ├── machine/    # Machine CRUD and sensor association
│   │   │   ├── monitoring/ # Monitoring points and analysis
│   │   │   └── time-series/# Time-series data management
│   │   ├── (auth)/         # Authentication pages (login, register)
│   │   └── dashboard/      # Main application dashboard and layouts
│   ├── components/         # Reusable React components
│   │   ├── auth/           # Authentication forms and theme registry
│   │   ├── dashboard/      # Dashboard-specific components (forms, charts, tables)
│   │   ├── ui/             # Generic UI elements (Sidebar, Buttons, etc.)
│   │   └── time-series/    # Components for time-series data
│   ├── hooks/              # Custom React hooks for API interaction and state
│   ├── lib/                # Core logic and configurations
│   │   ├── database/       # Mongoose schemas and repository layers
│   │   └── http/           # API service abstractions
│   ├── types/              # TypeScript types and Zod schemas
│   └── utils/              # Utility functions (env, jwt, validation)
├── .env.example            # Environment variable template
├── docker-compose.yaml     # Docker services configuration
├── Dockerfile              # Application Docker image configuration
└── next.config.ts          # Next.js configuration
```

## API Endpoints

The application exposes a RESTful API for all its functionalities.

| Method | Endpoint                                    | Description                                           |
| :----- | :------------------------------------------ | :---------------------------------------------------- |
| `POST` | `/api/auth/login`                           | Authenticates a user and returns a JWT.               |
| `POST` | `/api/auth/register`                        | Registers a new user.                                 |
| `GET`  | `/api/machine`                              | Retrieves all machines.                               |
| `POST` | `/api/machine`                              | Creates a new machine.                                |
| `DELETE`|`/api/machine`                              | Deletes a machine and its associated data by ID.      |
| `PUT`  | `/api/machine/[id]`                         | Updates a specific machine.                           |
| `POST`  | `/api/machine/sensors`                      | Retrieves all sensors for a specific machine.         |
| `POST` | `/api/sensor`                               | Creates a new sensor.                                 |
| `POST` | `/api/monitoring/point`                     | Creates a new monitoring point.                       |
| `GET`  | `/api/monitoring/point/analysis`            | Retrieves populated data for all monitoring points.   |
| `POST` | `/api/time-series`                          | Creates a single or a batch of time-series points.    |
| `GET`  | `/api/time-series/[monitoringPointId]`      | Retrieves paginated time-series data for a point.     |
| `DELETE`|`/api/time-series/[monitoringPointId]`      | Deletes all time-series data for a monitoring point.  |
| `GET`  | `/api/time-series/[monitoringPointId]/count`| Gets the total count of data points for a point.      |
| `GET`  | `/api/time-series/[monitoringPointId]/metrics`| Retrieves statistical metrics for a monitoring point. |
| `DELETE`|`/api/time-series/data-point/[dataPointId]` | Deletes a single time-series data point.              |
