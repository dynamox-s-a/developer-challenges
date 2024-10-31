## 🚀 Welcome to my Solution of the Full-Stack Challenge at Dynamox

> Since the original README was written in English, I'll continue in English to effectively document my efforts throughout this project.

---

### 📋 Summary

Nx was used to set up this repository.

- **API**: [https://dynapredict-api.onrender.com](https://dynapredict-api.onrender.com)

  - Built with **TypeScript**, **Nest.js**, **Prisma**, **PostgreSQL**, **Jest**, **Passport**, and helper libraries (JWT auth).
  - **CI/CD** implemented using **GitHub Actions** and **Docker**.
  - Deployment on **Render**.

- **Client**: [https://developer-challenges-kappa.vercel.app/](https://developer-challenges-kappa.vercel.app/)
  - Built with **Next.js**, **Redux Toolkit**, **Material-UI (MUI)**, **Devias Kit** (https://mui.com/store/items/devias-kit/), **React Hook Form** and **Zod**.
  - Deployment on **Vercel**.

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
>    pnpm install
>    ```
>
> 3. **Create an `.env` file in /apps/dynapredict-api/, on /apps/dynapredict-api/prisma and on /apps/dynapredict-next**
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
>    In the root directory of the next project, create another `.env` file and add the following environment variables:
>
>    ```env
>    NEXT_PUBLIC_API_URL="http://localhost:3000/api"
>    ```
>
>    **Note:** The `NEXT_PUBLIC_API_URL` must point to the API's base URL, **including the `/api` path**.
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
>       This will apply the database migrations and set up your development database.
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
> ### Running the client application
>
> Use the following commands to interact with the client application:
>
> - **Run the client application**
>
>   ```bash
>   nx dev dynapredict-next
>   ```
>
> ### Other commands
>
> - **Run the NX command to see available commands for the project**
>
>   ```bash
>   nx show projects
>   nx show name_of_the_project
>   ```

<hr>

## Comments

This will act as a logger for my progress at the project. Not everything written here is necessarily a linear message.

> I am currently writing this first version of documentation at _11:00 AM_ on Thursday, Oct 24. I'll make a commit right after I finish here to save it as the timestamp marking the beginning of this journey.
>
> My chain of thoughts can be read [here](/thoughts.md).

> Hey, I'm back. It's _5:30 PM_ on Monday, Oct 28, and I have just completed everything I aimed to achieve for my backend.
>
> While the backend took more time than anticipated, I'm really satisfied with the outcome. I successfully implemented all the requirements and went beyond.
>
> I will now start building the frontend using the template suggested in the Markdown.

<hr>

This is the commit right before I submit the PR to the developer challenges repository. I found this challenge really nice but also really hard, so I'm happy to make it through achieving all of the requirements and most of the bonus requirements. I'm also happy to have learned a lot of new things and to have improved my skills.

Even though I had not worked with Nest.js before, I think the outcome looked really nice, and it was the smoothest part of the project. In the final days, I thought that, because of my experience with Next.js, I could handle everything pretty effortlessly, but I was wrong, given the time constraints and some initial difficulties to leverage the template with Nx. MUI is a bliss to work with, and I think the Devias Kit is a really nice template to build a solid project with.

There are huge improvements that can be made, specially on the frontend and that I'd be happy to discuss in the future, but I'm confident that I was able to showcase many skills here. I tried to focus in achieving the requirements and using some code that was already provided by the template, so there were points of bottlenecks of my understanding of the codebase and assessing their problems. Right before the deploy I saw how many flags the Vercel linter was throwing and I was able to fix all of the problems, resulting in a clean deploy and hopefully a good UX for my reviewer!

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
