# Dynamox Front-end Developer Challenge

[< back to README](./README.md)

Dynamox front-end development team presents you with the following challenge:

**Using React and TypeScript, develop two modern web applications that demonstrate your expertise in frontend development.**

---

Keep in mind the challenge aims to reproduce an environment where you could demonstrate your skills. 

In order to help guiding your development process we will provide some requirements. It is not mandatory to fulfill all requirements to submit your implementation. The more requirements you implement, the more resources we will have to assess your skills and knowledge. 

Use your best judgement to prioritize tasks to meet the time you have available. Feel free to make any assumptions you consider necessary to complete the task.

## Challenge 1: Landing Page 🌐

### Overview
In this challenge, you will create a modern and performant landing page that showcases your expertise in frontend development, SEO optimization. The landing page should be visually appealing, highly performant, and follow modern web development best practices.

### Functional Requirements and User Stories

In today's digital landscape, a well-crafted landing page is crucial for business success. Your challenge is to create a landing page that not only looks great but also performs exceptionally well in terms of loading speed, SEO, and user experience.

1 - User Stories
1. [ ] As a user, I want to view a landing page that follows the provided [Figma design](https://www.figma.com/design/nN7CabevxBoFEoje0XZJ84/Test---Frontend---2025?node-id=365-20626&t=17l4SwF33pbLEndT-1).
1. [ ] As a user, I want the page to be fully responsive on all devices.
1. [ ] As a user, I want the page to load quickly with optimized images and assets.
1. [ ] As a user, I want to be able to change the images in the first section carousel by clicking on the respective image.
1. [ ] As a user, I want to click on the buttons with label "+ Leia mais" and be redirected to https://dynamox.net/blog.
1. [ ] As a user, in the footer, I want to click on the respective social media icons, text links and be redirected to the listed links on the Figma design.


2 - Technical Requirements
1. [ ] Use TypeScript.
1. [ ] Use React.
1. [ ] Use Next.js for building the app. [Check out](https://nextjs.org/docs/getting-started) to get started.
1. [ ] Implement comprehensive SEO best practices:
   - Meta tags optimization
   - Semantic HTML structure
   - Social media meta tags
1. [ ] Use Material UI 6 for styling with custom theme configuration.


3 - Bonus
1. [ ] Add unit tests with Vitest. [Check out](https://vitest.dev/guide/) to get started.
1. [ ] Add e2e tests with Cypress. [Check out](https://learn.cypress.io/) to get started.
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.
1. [ ] Achieve 95+ score on Lighthouse (Desktop). 
1. [ ] Add smooth animations and micro-interactions.


---

## Challenge 2: Event Management System 🎟️

### Overview
In this challenge, you will develop a comprehensive event management system with role-based access control. The system should allow administrators to manage events while providing a good user experience for readers to view event information.

### Functional Requirements and User Stories

Event management systems require careful consideration of user roles, data management, and user experience. Your challenge is to create a system that handles these aspects effectively while maintaining high performance and security standards.

1 - User Stories

#### Authentication & Authorization
1. [ ] As a user, I want to authenticate using fixed email and password with fake JWT.
1. [ ] As a user, I want to logout of the system.
1. [ ] As a user, I want to be redirected to appropriate pages based on my role.

#### Admin Features
1. [ ] As an admin, I want to create new events with detailed information:
   - Event name
   - Date and time
   - Location
   - Description
   - Category
   - Capacity
1. [ ] As an admin, I want to edit existing event details.
1. [ ] As an admin, I want to delete events when necessary.
1. [ ] As an admin, I want to view a dashboard with event statistics.

#### Reader Features
1. [ ] As a reader, I want to view a list of all upcoming events.
1. [ ] As a reader, I want to search and filter events.
1. [ ] As a reader, I want to view detailed information about specific events.
1. [ ] As a reader, I want to sort events by date, name, or category.

2 - Technical Requirements
1. [ ] Use Next.js with TypeScript for the frontend.
1. [ ] Implement state management using Redux Toolkit:
   - Proper action creators
   - Type-safe reducers
   - Middleware configuration
1. [ ] Create a mock REST API using JSON Server:
   - Define proper data models
   - Implement CRUD operations
   - Add data validation
1. [ ] Use Material UI 6 for creating a responsive and modern UI.
1. [ ] Implement comprehensive role-based access control:
   - Route protection
   - Component-level access control
   - API endpoint protection
1. [ ] Add proper error handling and loading states:
   - Loading skeletons
   - Error messages
   - Fallback UI
1. [ ] Ensure responsive design for all screen sizes.

3 - Bonus
1. [ ] Add unit tests for critical functionalities.
1. [ ] Implement role-based route protection using HOCs or middleware.
1. [ ] Deploy to Vercel with environment configuration.

We encourage using our frontend stack tooling to make the challenge resemble our everyday tasks.

## Evaluation Criteria

Each one of the items above will be evaluated as "Not Implemented", "Implemented with Issues", "Implemented", or "Implemented with Excellence". In order to assess different profiles and experiences, we expect candidates applying to more senior levels demonstrate a deeper understanding of the requirements and implement more of them in the same deadline.

In general we will be looking for the following:
1. [ ] Anyone should be able to follow the instructions and run the application.
1. [ ] Code quality, organization, and readability.
1. [ ] Front-end code is successfully integrated with a fake REST API.
1. [ ] Proper use of React, Next.js, and Material UI.
1. [ ] State management implementation with Redux Toolkit.
1. [ ] Authentication and role-based access control.
1. [ ] Application layout is responsive.
1. [ ] Performance optimization and SEO practices.
1. [ ] Testing coverage and quality.
1. [ ] Problem-solving skills and ability to handle ambiguity.
1. [ ] Code is well-organized and documented.

## Ready to Begin the Challenges?

* Fork this repository to your own Github account.
* Create a new branch using your first name and last name. For example: `caroline-oliveira`.
* After completing the challenge, create a pull request to this repository (https://github.com/dynamox-s-a/js-ts-full-stack-test) pointing to the main branch.
* We will receive a notification about your pull request, review your solution and get in touch with you.
<br>

**Good luck! We look forward to reviewing your submission.** 🚀

## Frequently Asked Questions

* Is it necessary to fork the project?
  **Yes, this allows us to see how much time you spent on the challenge.**

* If I have more questions, who can I contact?
  **Please reach out to <adriano.junior@dynamox.net> (Fullstack dev).**
