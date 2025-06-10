# Dynamox Developer Challenges - João Pedro Fernandes Borges

Here is my delivery for the challenge. I couldnt finish the project but I would like to continue on the selection process for the position.
I managed to set up the back and front end with User and Machine flows and resources. I didnt had much time because of work demands.
It was my first time dealing with NestJs and Prisma so I used the challenge as a learning opportunity.
I based myself on the challenge delivery of João Vitor (https://github.com/jvkf/developer-challenges) because I found it the most well organized and complete,
so I studied his documentation and tried to follow my own way of building the apps. Thank you for your time and attention!

### 📋 Summary

Nx was used to set up this repository.

  - Built with **TypeScript**, **Nest.js**, **Prisma**, **PostgreSQL**, **Jest**.

- **Client**:
  - Built with **Next.js**, **Redux Toolkit**, **Material-UI (MUI)**, **Devias Kit**, **React Hook Form** and **Zod**.

---

## Getting Started

> Make sure you have Git, Node.js and NPM available.
> Follow these steps to set up the project locally:
>
> 1. **Clone the Repository**
>
>    ```bash
>    git clone https://github.com/your-username/dynapredict.git
>    cd developer-challenges
>    git checkout joao-borges
>    ```
> 2. **Navigate to nx workspace and install Dependencies**
>
>   ```bash
>    cd ./development
>    pnpm install
>    ```
>
> 3. **Navigate to BE folder and install Dependencies** (PNPM)
>
>    ```bash
>    cd ./development/apps/dynapredict-api
>    pnpm install
>    ```
>
> 4. **Navigate to FE folder and install Dependencies** (NPM)
>
>    ```bash
>    cd ./development/apps/dynapredict-webapp
>    npm install
>    ```
>
> 5. **Create an `.env` file on /development/apps/dynapredict-api/prisma and on /development/apps/dynapredict-webapp**
>
>    In the prisma directory of the project (/development/apps/dynapredict-api/prisma), create an `.env` file and add a database_url for prisma to use:
>
>    ```env
>    DATABASE_URL=your_database_url
>    ```
>
>    In the root directory of the next project(/development/apps/dynapredict-webapp), create another `.env` file and add the following environment variables:
>
>    ```env
>    NEXT_PUBLIC_API_URL="http://localhost:3000/api"
>    ```
>
>    **Note:** The `NEXT_PUBLIC_API_URL` must point to the API's base URL, **including the `/api` path**.
>
> 6. **Setup Prisma and Run Development Commands** on (/development/apps/dynapredict-api)
>
>    Follow these steps to set up Prisma and prepare your local development environment:
>
>    1. **Generate Prisma Client** on (/development/apps/dynapredict-api)
>
>       ```bash
>       npx prisma generate
>       ```
>
>       This command generates the Prisma Client based on your schema, allowing you to interact with your database.
>
>    2. **Run Database Migrations** on (/development/apps/dynapredict-api)
>
>       ```bash
>       npx prisma migrate dev
>       ```
>
>       This will apply the database migrations and set up your development database.
>
> ### Running the API Application
>
> Use the following commands to interact with the API:
>
> - **Run the API Server Locally** on (/development/apps/dynapredict-api)
>
>   ```bash
>   nx serve
>   ```
>
> ### Running the client application
>
> Use the following commands to interact with the client application:
>
> - **Run the client application** (/development/apps/dynapredict-webapp)
>
>   ```bash
>   npm run dev dynapredict-webapp
>   ```
>

<hr>

## Comments

Step-by-step decision taking documentation and walktrough on the resolution of a practical development test for a fullstack developer position at Dynamox, Florianópolis - Brasil

First, Second and third Commits - Setting up raw backend(NestJs and prisma), e2e structure and frontend (NextJs, ReactJs, Devias kit);

4th Commit - Added User Model and CRUD Users resources to the backend, configured prisma and eslint. Made first testing in jest

5th Commit -  Set up of the user account sign up, current user query and deletion flow on the front-end, removed unneeded buttons and components cluttering the FE layout

6th commit - Added Machine Model and CRUD Machines resources on BE, set up machine registration and redux query structure on FE


<hr>

### 🛠️ Tech Stack

- **Frontend**:
  - **TypeScript**
  - **Next.js**
  - **Redux**
  - **Material-UI (MUI)**
- **Backend**:
  - **Node.js**
  - **TypeScript**
  - **Nest.js**
  - **Prisma**
  - **PostgreSQL**
- **Tools & Utilities**:
  - **Nx** for monorepo management
  - **Jest** for testing
  - **Docker** for containerization
  - **GitHub Actions** for CI/CD pipelines
