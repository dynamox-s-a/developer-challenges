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

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## Getting Started

Follow these steps to get the application running on your local machine:

### 1. Setup Docker

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start PostgreSQL container
 docker run --name postgres-db \ 
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:latest

# Verify container is running
docker ps
```

Create a `.env` file in the backend folder with the following content:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"
PORT=3001
SESSION_SECRET="dynapredict"
NODE_ENV=development
```

### 2. Setup Prisma

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Launch Prisma Studio in browser
npx prisma studio
```

### 3. Run Backend

```bash
# Ensure you're in the backend directory
cd backend

# Start the development server
npm run start:dev
```

### 4. Run Frontend

```bash
# Navigate to frontend directory
cd frontend

# Create frontend .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env

# Start the development server
npm run dev
```

### 5. Seed Database

```bash
# Populate database with initial data
npx prisma db seed
```

## Additional Information

The application should now be running with:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Prisma Studio: http://localhost:5555

Make sure all services are running properly before accessing the application.

## Troubleshooting

### Docker Issues

1. **Port 5432 Already in Use**

   ```bash
   # Check what's using the port
   sudo lsof -i :5432

   # Stop existing PostgreSQL service if running
   sudo service postgresql stop
   ```

2. **Container Won't Start**

   ```bash
   # Stop existing container
   docker stop postgres-db

   # Remove existing container
   docker rm postgres-db

   # Check container logs
   docker logs postgres-db
   ```

### Database Connection Issues

1. **Prisma Can't Connect to Database**

   - Verify PostgreSQL container is running: `docker ps`
   - Check DATABASE_URL in .env file
   - Try connecting using psql:
     ```bash
     psql postgresql://postgres:postgres@localhost:5432/mydb
     ```
     
### Backend Issues

1. **TypeScript Compilation Errors**

   ```bash
   # Clear dist folder
   rm -rf dist

   # Rebuild
   npm run build
   ```

2. **Session Errors**
   - Verify SESSION_SECRET in .env
   - Clear browser cookies and localStorage
   - Restart the backend server

### Frontend Issues

1. **API Connection Errors**

   - Verify backend is running
   - Check NEXT_PUBLIC_API_URL in frontend .env
   - Ensure no CORS issues in browser console


### Common Solutions

- **General Reset Process**
  ```bash
  # Stop all services
  docker stop postgres-db

  # Remove container
  docker rm postgres-db

  # Clean install dependencies
  npm clean-install

  # Restart setup process from step 1
  ```

- **Verify Ports**
  - Frontend: 3000
  - Backend: 3001
  - Database: 5432
  - Prisma Studio: 5555

If you continue to experience issues, please:

1. Check the console logs in both frontend and backend
2. Verify all environment variables are correctly set
3. Ensure all required services are running
4. Check for any conflicting processes on required ports

Well, this is the last commit before sending my PR for review. Although I know that many things in the project could have been improved, I am satisfied with the final result. I had never had experience using Nest, Prisma, and Docker before, so it was super challenging and I learned a lot during this journey.

I believe there are many improvements that could have been made to the project, both on the Front End and the Back End. Unfortunately, I didn’t have time to deploy the application, something I would have loved to do, but I ended up focusing on other aspects. I hope you have a good experience reviewing this project.