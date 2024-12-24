# Full-Stack Challenge Solution for Dynamox

Welcome to my solution for the Dynamox Full-Stack Challenge! This project demonstrates a modern web application architecture using **Next.js** for the frontend, **NestJS** for the backend, and **Prisma** with **PostgreSQL** for database management.

## Tech Stack

- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- ORM: Prisma
- Containerization: Docker

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## Getting Started

Follow these steps to get the application running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Set Up the Database

First, start the PostgreSQL container using Docker:

```bash
docker run --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:latest
```

This command creates a PostgreSQL container with the following configuration:
- Database name: mydb
- Username: admin
- Password: admin
- Port: 5432 (accessible locally)

### 3. Backend Setup (NestJS)

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the backend server in development mode
npm run start:dev
```

The backend server will be running at http://localhost:3001

To view and manage your database using Prisma Studio:
```bash
npx prisma studio
```
This will open Prisma Studio at http://localhost:5555

### 4. Frontend Setup (Next.js)

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

The frontend application will be running at http://localhost:3000

## Project Structure

```
project-root/
├── frontend/          # Next.js frontend application
├── backend/           # NestJS backend application
└── docker/            # Docker configuration files
```

## Environment Variables

Make sure to set up the following environment variables:

### Backend (.env)
```
DATABASE_URL="postgresql://admin:admin@localhost:5432/mydb"
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Scripts

### Backend
- `npm run start:dev` - Start the development server
- `npm run build` - Build the application

### Frontend
- `npm run dev` - Start the development server
- `npm run start` - Start the production server
- `npm run lint` - Run linting

## Database Management

- Access Prisma Studio: `npx prisma studio`
- Generate Prisma Client: `npx prisma generate`
- Run Migrations: `npx prisma migrate dev`

## Troubleshooting

1. **Database Connection Issues**
   - Ensure Docker is running
   - Verify PostgreSQL container is active: `docker ps`
   - Check container logs: `docker logs postgres`

2. **Port Conflicts**
   - Make sure ports 3000, 3001, and 5432 are available
   - To check running containers: `docker ps`
   - To stop the PostgreSQL container: `docker stop postgres`
