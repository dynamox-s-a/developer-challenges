

# Deploy Overview

This document outlines the deployment setup for the project, detailing the backend deployment on Railway and the frontend deployment on Netlify.

- **Backend Deployment:** Hosted on [Railway] - (dynamox-fullstack-test-production.up.railway.app)
- **Frontend Deployment:** Hosted on [Netlify]

### Application Access
You can access the application login page here: [Dynamox Test Login](https://dynamox-test.netlify.app/routes/login)

# Back-End Overview

 1. **Machine Management**:
    - Create, read, update, and delete machines.
    - Machines can be of type `FAN` or `PUMP`, validated on creation and update.
    - Checks for existing machines based on machine name to avoid duplicates.

2. **Monitoring Points Management**:
    - Create, read, update, and delete monitoring points.
    - Each monitoring point is associated with a machine and sensor, with data validation to ensure compatibility.
    - Returns detailed information about associated machines and sensors in response.

3. **Authentication**:
    - Every endpoint is protected by authentication middleware using JWT.
    - Users must authenticate to interact with the API.

4. **Validation**:
    - Data validation is applied to ensure that only valid machines and monitoring points are created or updated.
    - Monitoring points are only allowed for specific machine types based on sensor compatibility.

5. **Database Integration**:
    - Data is stored in a PostgreSQL database.
    - Prisma ORM is used to manage schema migrations and communicate with the PostgreSQL database.

## Endpoints

### Authentication Endpoints

- **Create user**:
- `Post /auth/register`
- Used to register a new user

- **Login**:
- `Post /auth/login`
- Used to login a user  

- **Create Machine**:  
  `POST /machines`  
  Creates a new machine. Only 'FAN' and 'PUMP' types are allowed. If a machine with the same name exists, it throws an error.

- **Get All Machines**:  
  `GET /machines`  
  Retrieves a list of all machines.

- **Get Machine by ID**:  
  `GET /machines/:id`  
  Retrieves details of a machine by its ID.

- **Update Machine**:  
  `PUT /machines`  
  Updates an existing machine, checking for name conflicts and ensuring the type is either 'FAN' or 'PUMP'.

- **Delete Machine**:  
  `DELETE /machines/:id`  
  Deletes a machine by its ID. Throws an error if the machine has any associated monitoring points.

### Machine Endpoints

- **Create Machine**:  
  `POST /machines`  
  Creates a new machine. Only 'FAN' and 'PUMP' types are allowed. If a machine with the same name exists, it throws an error.

- **Get All Machines**:  
  `GET /machines`  
  Retrieves a list of all machines.

- **Get Machine by ID**:  
  `GET /machines/:id`  
  Retrieves details of a machine by its ID.

- **Update Machine**:  
  `PUT /machines`  
  Updates an existing machine, checking for name conflicts and ensuring the type is either 'FAN' or 'PUMP'.

- **Delete Machine**:  
  `DELETE /machines/:id`  
  Deletes a machine by its ID. Throws an error if the machine has any associated monitoring points.

### Monitoring Points Endpoints

- **Create Monitoring Point**:  
  `POST /monitoringPoints`  
  Creates a new monitoring point, validating the compatibility between the sensor and the machine.

- **Get All Monitoring Points**:  
  `GET /monitoringPoints`  
  Retrieves a list of all monitoring points, including machine and sensor details.

- **Get Monitoring Point by ID**:  
  `GET /monitoringPoints/:id`  
  Retrieves details of a monitoring point by its ID.

- **Update Monitoring Point**:  
  `PUT /monitoringPoints`  
  Updates an existing monitoring point, validating sensor and machine compatibility.

- **Delete Monitoring Point**:  
  `DELETE /monitoringPoints/:id`  
  Deletes a monitoring point by its ID.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prisma ORM**: A next-generation ORM for Node.js and TypeScript that helps developers build faster and make fewer errors.
- **JWT**: Used for securing endpoints and handling authentication.
- **PostgreSQL**: Used how database

## Error Handling

The system uses `InternalServerErrorException` to handle various cases of errors, such as invalid machine types, machine name conflicts, and errors related to monitoring point creation or updates. Custom messages are included to help identify the root cause of failures.

## Running the Project

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the environment variables (e.g., database URL, authentication keys).
4. Run the Prisma migrations using `npx prisma migrate dev`.
5. Start the application using `npm run start`.

## Prisma Migrations

To generate Prisma migrations automatically upon application startup, the following command is executed:

```bash
npx prisma migrate dev
```

# Front-End Overview

This project implements key functionalities for a monitoring system, focusing on authentication, responsive design, form validation, and dynamic UI elements. Below is a detailed explanation of the features implemented on the frontend.

## Features Implemented

### 1. Authentication
- **JWT for session control**: The login system uses JSON Web Tokens (JWT) to manage user sessions securely.
- **Bcrypt for password hashing**: User passwords are encrypted using Bcrypt before being stored, ensuring a high level of security.
- **CryptoJS for payload encryption**: The form payload, including sensitive information like the password, is encrypted before being sent. You can observe that the password appears as a hash in the request payload.

### 2. Responsive Design
- The application is fully responsive, supporting devices with a minimum width of 320px. If any responsiveness issues are encountered in Chrome's emulator, simply refresh the page (F5).

### 3. Form Validation
- Form validation has been implemented using **HookForm** in combination with **YUP**. This approach provides better control and error handling across forms.

### 4. Dynamic Color System
- A simple system for switching colors has been integrated, allowing basic customization of the user interface.

### 5. Column Hiding in Main Grid
- A column-hiding feature has been added to the main grid, specifically in the machines table. This functionality serves as a demonstration and does not affect the display of monitoring point data, which remains intact as per requirements.

## How to Run

To run the project, ensure you have the necessary dependencies installed. You can start the application by running the following commands:

```bash
npm install
npm run dev
```
