# Machine Track

Machine Track is a fullstack web application for managing machines, monitoring points, and sensors. It enables users to create, edit, and track various entities in a structured interface with a focus on machine maintenance and monitoring. 

This project was built with:

- **Frontend:** Next.js (React-based framework)
- **Backend:** Prisma with REST API endpoints
- **Database:** PostgreSQL for persistent data storage
- **Authentication:** JWT (JSON Web Tokens) for user session management

## **Setup Instructions**

Follow these steps to set up the project on your local machine:

### **Prerequisites**

1. Install [Node.js](https://nodejs.org/) (version 18 or above).
2. Install [PostgreSQL](https://www.postgresql.org/) and ensure it's running.
3. Install **Git** to clone the repository.

### **Running the project**

1. **Install dependencies**:

```
npm install
```

2. **Set up the database**:

- Create a PostgreSQL database.
- Save your database connection information (host, port, user, password) for the next step.

3. **Configure the environment**:

Create a .env file in the project root with the following content:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your_database
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"
SECRET_KEY="your_secret_key"
```

4. **Generate the Prisma client**:

```
npx prisma generate
```

5. **Run database migrations**:

```
npx prisma migrate dev --name init
```

This command applies all pending migrations and creates the necessary tables in your PostgreSQL database.

6. **Start the development server**:

Open http://localhost:3000 in your browser.

## **Project Structure**

### **Used folders**

- /prisma – Prisma schema and migration files.
- /src/app – Frontend pages and components.
- /src/app/api – Backend API routes for managing machines, monitoring points, and sensors.
- /src/lib – Utility functions (e.g., database client, middleware).

### **Available api routes**

1. **Users**

[POST] Login (http://localhost:3000/api/auth/login):

```
email: string
password: string
```

[POST] Sign up (http://localhost:3000/api/auth/signup):

```
email: string
password: string
```

[DELETE] Logout (http://localhost:3000/api/auth/logout)

2. **Machines**

[GET] Get one machine (http://localhost:3000/api/machines/{id})
[GET] List all machines (http://localhost:3000/api/machines)
[DELETE] Delete machine (http://localhost:3000/api/machines/{id})

[POST] Create machine (http://localhost:3000/api/machines):

```
name: string
type: enum(Pump, Fan)
```

[PUT] Edit machine (http://localhost:3000/api/machines/{id}):

```
name: string
type: enum(Pump, Fan)
```

3. **Monitoring points and Sensors**

[GET] List all monitoring points (http://localhost:3000/api/monitoring-points)
[GET] List all sensors (http://localhost:3000/api/sensors)

[POST] Create monitoring point (http://localhost:3000/api/monitoring-points)

```
name: string
machineId: foreign key for machines
```

[POST] Create sensor (http://localhost:3000/api/sensors)

```
uniqueId: string
modelName: enum(TcAg, TcAs, HFPlus)
monitoringPointId: foreign key for monitoring points
```

### **Authentication**

Upon successful login, a JWT token is saved in a cookie named token.
Protected routes and APIs require the token for access.

## **Contact**

For any questions or support, please contact:

- Author: Guilherme Scoz Girardi
- Email: gui.x.scoz@gmail.com