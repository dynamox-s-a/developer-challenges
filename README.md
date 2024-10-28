## 🚀 Welcome to my Solution of the Full-Stack Challenge at Dynamox

> Since the original README was written in English, I'll continue in English to effectively document my efforts throughout this project.

---

### 📋 Summary

Nx was used to set up this repository.

- **API**: [https://dynapredict-api.onrender.com](https://dynapredict-api.onrender.com)
  - Built with **TypeScript**, **Nest.js**, **Prisma**, **PostgreSQL**, **Jest**, **Passport**, and helper libraries (JWT auth).
  - **CI/CD** implemented using **GitHub Actions** and **Docker**.

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
>    git checkout joao-ferraz
>    ```
>
> 2. **Install Dependencies**
>
>    ```bash
>    npm install
>    ```
>
> 3. **Create an `.env` file in /apps/dynapredict-api/ and also on /apps/dynapredict-api/prisma**
>
>    In the root directory of the api project, create a `.env` file and add the following environment variables:
>
>    ```env
>    JWT_SECRET=your_jwt_secret
>    ```
>
>    In the prisma directory of the project, create another `.env` file and add a database_url for prisma to use:
>
>    ```env
>    DATABASE_URL=your_database_url
>    ```
>
> 4. **Setup Prisma and Run Development Commands**
>
>    Follow these steps to set up Prisma and prepare your local development environment:
>
>    1. **Generate Prisma Client**
>
>       ```bash
>       npx prisma generate
>       ```
>
>       This command generates the Prisma Client based on your schema, allowing you to interact with your database.
>
>    2. **Run Database Migrations**
>
>       ```bash
>       npx prisma migrate dev
>       ```
>
>       This will apply the database migrations and set up your development database. The `--name init` flag names the migration for reference.
>
> ### Running the API Application
>
> Use the following commands to interact with the API:
>
> - **Run the API Server Locally**
>
>   ```bash
>   nx serve dynapredict-api
>   ```
>
> - **Run Unit Tests for the Application**
>
>   ```bash
>   nx test dynapredict-api
>   ```
>
> - **Run End-to-End (E2E) Tests for the Application**
>
>   **Attention: your server needs to be running on localhost:3000 for this to work**
>
>   ```bash
>   nx run dynapredict-api-e2e:e2e
>   ```
>
> ### Additional Commands
>
> As the project evolves, additional commands may be added to facilitate development and deployment.

<hr>

## Comments

This will act as a logger for my progress at the project. Not everything written here is necessarily a linear message.

> I am currently writing this first version of documentation at _11:00 AM_ on Thursday, Oct 24. I'll make a commit right after I finish here to save it as the timestamp marking the beginning of this journey.
>
> My chain of thoughts can be read [here](/thoughts.md).

> Hey, I'm back. It's _5:30 PM_ on Monday, Oct 28, and I have just completed everything I aimed to achieve for my backend. The features include:

> **Unit Tests** > **CI/CD**:
> CI for linting, typechecking and unit testing;
> CD workflow that pushes a **Docker image** to Docker Hub and also interacts with the **Render Webhook** to trigger new deployments.
>
> While the backend took more time than anticipated, I'm really satisfied with the outcome. I successfully implemented all the requirements and went beyond.
>
> I will now start building the frontend using the template suggested in the Markdown.

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
