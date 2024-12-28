### Thoughts on the Development Process
This document was created during the development of the project to outline how I addressed key ambiguities, my reasoning behind certain decisions, and reflections on the challenges I encountered. I hope it provides some clarity on my thought process and development approach.

**Frontend**
Initially, I started developing the frontend from scratch using **MUI** components without relying on pre-built templates. After implementing authentication, the main pages, and the navigation menu, I realized that the design was not aligning with my expectations. Due to time constraints and the need for a more structured project following essential design standards, I decided to switch to the **Devias Kit**. This choice resolved many of my initial design challenges and helped streamline the development process.

**Navigation**
I chose to separate the project into two distinct pages: **Machines** and **Monitoring Points**. While they are part of the same context, I felt it was important to differentiate them, as users might want to register a machine without necessarily adding monitoring points to it. This separation enhances usability and provides clearer navigation.

**Page Design**
The structure of the Machines and Monitoring Points pages was designed to be practical and user-friendly. When the page loads, users immediately see a form on the left side for creating new entries and a table on the right for viewing existing ones.

Initially, I planned to use a modal for the creation process, triggered by a button at the top of the screen. However, I decided against it because it would require an additional step every time users wanted to create a machine or monitoring point. By keeping the forms always visible, I aimed to simplify the user experience.

**Key Decision: Mandatory Sensors for Monitoring Points**

A significant decision was making sensor creation mandatory when adding a monitoring point. This reflects the practical use case of wind turbines and industrial machinery, where a monitoring point without an associated sensor serves no purpose. Since the primary goal is to collect and analyze sensor data, this requirement ensures data integrity and prevents incomplete monitoring points from being created.

**Design**
From a design perspective, I am satisfied with the outcome. Although I had several ideas to make the aesthetics more visually appealing, I prioritized an **intuitive and minimalist design** that would enhance usability and focus on functionality.

**Code Architecture**
For the frontend code architecture, I followed a **Domain-Driven Design (DDD)** approach. This architecture is easy to implement, maintain, and highly suitable for small projects using **Next.js** and **React**. It allowed me to maintain a clean and organized structure throughout the development process.

**Backend**

The backend was the most challenging part of the project, as it was my first time building one from scratch using the required technologies. I faced numerous configuration errors during the setup due to my lack of experience, but I learned a lot throughout this journey and am proud of the final result.

**Areas for Improvement**
While I am satisfied with what I achieved, there are areas I would have liked to enhance:

- **Error Handling**: The current error-handling implementation is basic and could be significantly improved.
- **Validations**: Adding more robust validations, especially for user registration, would improve the backend's reliability.
- **Cookie Persistence**: Implementing cookie persistence upon page refresh would enhance the user experience.
- **End-to-End Tests**: Adding E2E tests to ensure the application works as expected.
- **Deployment**: Deploying the application to make it accessible for demonstration purposes.
- **Nx for Organization**: Utilizing Nx to better organize the entire application.

**Final Thoughts**
While the decision to make sensors mandatory for monitoring points was logical in this context, I acknowledge the benefits of allowing optional sensors in future iterations. For example, it could simplify sensor maintenance, support phased implementations, and offer more flexible system configurations. This could involve schema changes, new API endpoints, and updates to the frontend to support a multi-step process with clear status indicators for incomplete monitoring points.

Despite the challenges, I believe this project demonstrates my creativity, problem-solving skills, and dedication. It reflects my ability to navigate ambiguities, learn new technologies, and deliver results under tight deadlines. While there is always room for improvement, I am pleased with the outcome and grateful for the learning experience.