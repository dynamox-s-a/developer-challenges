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
2. [ ] As a user, I want the page to be fully responsive on all devices.
3. [ ] As a user, I want the page to load quickly with optimized images and assets.
4. [ ] As a user, I want to be able to change the images in the first section carousel by clicking on the respective image.
5. [ ] As a user, I want to click on the buttons with label "+ Leia mais" and be redirected to https://dynamox.net/blog.
6. [ ] As a user, in the footer, I want to click on the respective social media icons, text links and be redirected to the listed links on the Figma design.


2 - Technical Requirements
1. [ ] Use TypeScript.
2. [ ] Use React.
3. [ ] Implement comprehensive SEO best practices:
   - Meta tags optimization
   - Semantic HTML structure
   - Social media meta tags


3 - Bonus
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.
2. [ ] Achieve 95+ score on Lighthouse (Desktop). 
3. [ ] Add smooth animations and micro-interactions.


---

## Challenge 2: Event Management System 🎟️

### Overview
In this challenge, you will develop a comprehensive event management system with role-based access control. The system should allow administrators to manage events while providing a streamlined experience for readers to view event information.

### Authentication and User Roles

#### Pre-configured Users
The system should have two pre-configured users in the JSON Server database:
1. Admin User
   - Email: admin@events.com
   - Password: admin123
   - Role: admin

2. Reader User
   - Email: reader@events.com
   - Password: reader123
   - Role: reader

### Functional Requirements and User Stories

#### Authentication & Authorization
1. [ ] As a user, I want to authenticate using the pre-configured email and password
   - [ ] Implement fake JWT token generation
   - [ ] Store token in localStorage
   - [ ] Include token in API requests headers
2. [ ] As a user, I want to only access protected routes if I am authenticated
3. [ ] As a user, I want to logout of the system
4. [ ] As a user, I want to be redirected based on my role
   - Admin -> Admin Dashboard
   - Reader -> Events List

#### Admin Features (Role: admin)
1. [ ] As an admin, I want to create new events with the following information:
   - [ ] Event name (required)
   - [ ] Date and time (required, must be future date)
   - [ ] Location (required)
   - [ ] Description (required, min 50 characters)
   - [ ] Category (required, select from: Conference, Workshop, Webinar, Networking, Other)
2. [ ] As an admin, I want to edit existing event details
3. [ ] As an admin, I want to delete events
4. [ ] As an admin, I want to view events

#### Reader Features (Role: reader)
1. [ ] As a reader, I want to view events
2. [ ] As a reader, I want to search and filter events
3. [ ] As a reader, I want to sort events by:
   - [ ] Date
   - [ ] Name

### Technical Requirements
1. [ ] Use TypeScript.
1. [ ] Use React.
2. [ ] Use Next.js [Check out](https://nextjs.org/docs/getting-started) to get started.
3. [ ] Implement state management using Redux Toolkit:
4. [ ] Create a mock REST API using JSON Server:
5. [ ] Use Material UI 6 for styling with custom theme configuration.
6. [ ] Ensure responsive design for all screen sizes.

### Bonus
1. [ ] Add unit tests with Jest. [Check out](https://jestjs.io/docs/getting-started) to get started.
2. [ ] Add e2e tests with Cypress. [Check out](https://docs.cypress.io/guides/getting-started/installing-cypress) to get started.
3. [ ] Implement role-based route protection using HOCs or middleware.
4. [ ] Deploy your application to a cloud provider and provide a link for the running app.
5. [ ] Add Storybook documentation for UI components.

## Evaluation Criteria

Each one of the items above will be evaluated as "Not Implemented", "Implemented with Issues", "Implemented", or "Implemented with Excellence". In order to assess different profiles and experiences, we expect candidates applying to more senior levels demonstrate a deeper understanding of the requirements and implement more of them in the same deadline.

In general we will be looking for the following:
1. [ ] Anyone should be able to follow the instructions and run the application.
2. [ ] Front-end code is successfully integrated with a fake REST API.
3. [ ] Stories were implemented according to the functional requirements.
4. [ ] Problem-solving skills and ability to handle ambiguity.
5. [ ] Code quality, readability, and maintainability.
6. [ ] Code is well-organized and documented.
7. [ ] Application layout is responsive.

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

* Can I use create-react-app to complete the challenge?
  **No, create-react-app is not acceptable for this challenge.**

* If I have more questions, who can I contact?
  **Please reach out to <adriano.junior@dynamox.net> (Fullstack dev).**
