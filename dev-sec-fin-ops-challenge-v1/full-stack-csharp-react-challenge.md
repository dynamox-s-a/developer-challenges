# Full-Stack Development Challenge - C# and React

## Overview
To help us evolve our asset condition monitoring platform, **DynaPredict**, we present the following challenge:

Build a robust and intuitive application (front-end and back-end) for managing industrial machines. With this system, a user should be able to register, view, and manage their industry's machines.

Throughout the challenge, we expect you to demonstrate familiarity with the proposed technologies, apply development best practices, and showcase your problem-solving skills. **Code quality, clarity, readability, and maintainability** will be the main evaluation points.

---

## User Stories and Functional Requirements
Below are the functional requirements for the application. Feel free to make any assumptions you deem necessary to complete the challenge, documenting them in the README.

### 1 - Machine Management
- [ ] As a user, I want to register a new machine by providing its **Name**, **Serial Number**, **Description**, and selecting a **Machine Type** from a predefined list (e.g., "Press", "Lathe", "Milling Machine"), so that I can manage it later.  
- [ ] As a user, I want to view a list of all registered machines, displaying at least the **Name**, **Serial Number**, and **Type**, to get an overview of my factory floor.  
- [ ] As a user, I want to click on a machine in the list to see its full details on a dedicated page.  
- [ ] As a user, I want the system to prevent the registration of a machine without the required fields (**Name**, **Serial Number**, **Type**).  

---

## Mandatory Technical Requirements

### 2 - Back-end
- [ ] The application must be written in **C#**, using **.NET 6 (or higher)** and **ASP.NET Core**.  
- [ ] Use a data persistence mechanism. File or preferably **SQL Server** or **PostgreSQL** databases.   
- [ ] Expose a **RESTful API** with the following endpoints:  
  - `GET /api/machines` — returns all machines.  
  - `GET /api/machines/{id}` — returns the machine with the specified ID.  
  - `POST /api/machines` — creates a new machine.  
- [ ] If you use database, provide **Entity Framework Core migrations** or a **SQL script** to create the entire database structure.  

### 3 - Front-end
- [ ] The application must be developed in **React with TypeScript**.  
- [ ] Implement the following screens:  
  - A screen for **machine creation** (form).  
  - A screen to **display the list of machines**.  
  - A screen to **display the details of a single machine**.  
- [ ] The creation form must have **validation for required fields**.  

---

## Bonus Points (Optional Requirements)
These items (4 and 5) are not mandatory, but implementing them will significantly enhance the quality of your evaluation.

### 4 - Best Practices & Architecture (Back-end)
- [ ] Use **Dependency Injection** to manage the application's dependencies.  
- [ ] Divide the solution into **layers of responsibility** (e.g., Api, Application, Domain, Infrastructure).  
- [ ] Use **Entity Framework Core** as the ORM.  
- [ ] Implement the **Repository Pattern**.  
- [ ] Generate API documentation using **Swagger (Swashbuckle)**.  
- [ ] Implement **consistent error handling**, with appropriate HTTP status codes (e.g., `400` for validation, `404` for not found, `500` for unexpected errors).  

### 5 - Quality & DevOps
- [ ] Write **unit or integration tests** for the main business logic.  
- [ ] Provide **Dockerfile(s)** and a **docker-compose.yml** file to initialize the API, database, and front-end.  
- [ ] Create a **README.md** file with clear instructions to run the project locally (either with Docker or manually).  

---

## Evaluation Criteria
Your solution will be evaluated based on the following criteria:

- **Functionality**: The user stories were implemented correctly.  
- **Back-end Quality**: Clean, well-structured code, application of design patterns and architecture.  
- **Front-end Quality**: Componentization, folder structure, state management, and responsiveness.  
- **Best Practices**: Adherence to technical requirements and implementation of optional items.  
- **Documentation and Ease of Execution**: Clarity of the README and ease of setting up and running the project.  

---

## Submission Instructions
1. **Fork** this repository to your personal GitHub account.  
2. Create a new **branch** from `main` with your name (e.g., `firstname-lastname`).  
3. After completing the challenge, open a **Pull Request** from your branch to the original repository's `main` branch.  
4. Our team will be notified, review your solution, and get in touch with you.  
