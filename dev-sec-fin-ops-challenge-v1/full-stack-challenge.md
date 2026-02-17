# Dynamox Full-Stack Developer Challenge

[< back to README](./README.md)

In order to contribute to the enhancement of our Corporate Channels and asset condition monitoring platform, DynaPredict, we present you with the following challenge: 

Build a robust and intuitive full-stack application developed using React and TypeScript for the frontend, and a suitable backend technology. The application should include authentication, machine management, sensor management, time-series data processing, and general user-friendly features.

To properly address this challenge, you must deliver a fully integrated end‑to‑end flow, with frontend components connected to real backend endpoints and persistent storage. Implementing features only halfway — such as building UI components without backend integration — will not meet the challenge requirements. Complete integration between frontend and backend is more important than implementing isolated or unfinished client‑side features.

While going through the challenge, you should be able to handle ambiguous situations, adhere to best practices in both front-end and back-end development, and demonstrate excellent problem-solving skills. Effective communication through well-documented code, code quality, readability, and maintainability will also be evaluated.

## User Stories and Functional Requirements

Here you have the functional requirements for the application. You are free to make any assumptions you consider necessary to complete the challenge.

---

It is not mandatory to implement all the listed requirements before submitting your implementation. Just keep in mind that the more requirements you implement, the more you will be able to demonstrate your skills and knowledge.

We will expect candidates applying to more senior levels to demonstrate a deeper understanding of the requirements and to implement more of them for the same deadline.

---

You can use the following user stories as a guide to implement the application features:

1 - Authentication

1. [ ] As a user, I want to log in using a fixed email and password so that I can access private routes.
1. [ ] As a user, I want to be able to log out of the system so that I can prevent unauthorized access to my account.
1. [ ] No private routes should be accessible without authentication.

2 - Machine Management

1. [ ] As a user, I want to create a new machine with an arbitrary name and with a type selected from a list ["Pump", "Fan"] so that I can manage it later.
1. [ ] As a user, I want to change the attributes (name and type) of a machine after creating it so that I can keep the machine information updated.
1. [ ] As a user, I want to delete a machine when it is no longer in use so that it doesn't clutter the system.

3 - Monitoring Points and Sensors Management

1. [ ] As a user, I want to create at least two monitoring points with arbitrary names for an existing machine, so that I can monitor the machine's performance.
1. [ ] As a user, I want to associate a sensor to an existing monitoring point so that I can monitor the machine's performance. The sensor should have a unique ID, and the sensor model name should be one of ["TcAg", "TcAs", "HF+"].
1. [ ] As a user, I want the system to prevent me from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump".
1. [ ] As a user, I want to see all my monitoring points in a paginated list so that I can manage them. The list should display up to 5 monitoring points per page and should include the following information: "Machine Name", "Machine Type", "Monitoring Point Name", and "Sensor Model".
1. [ ] As a user, I want to sort the monitoring points list by any of its columns in ascending or descending order, so that I can easily find the information I'm looking for.

4 - Ambiguity Handling

1. [ ] Make reasonable assumptions and design the application accordingly for any ambiguities in the challenge.
1. [ ] Document your assumptions in the README file.

5 - Technical requirements

1. [ ] Use TypeScript.
1. [ ] Use React.
1. [ ] Use Redux for managing global states.
1. [ ] Use Redux Thunks or Redux Saga for managing asynchronous side effects.
1. [ ] Use Next.js or Vite.
1. [ ] Use Material UI 5 for styling the application.
1. [ ] Create reusable components.
1. [ ] The code is well-organized and documented.
1. [ ] The application layout is responsive.
1. [ ] Ensure correct business logic and behavior with automated unit tests.

6 - Back-end Requirements

1. [ ] Implement your own back-end code using NodeJS JavaScript runtime (not Java, not PHP...). Although we also work with Python here, we are looking for JavaScript related skills in this test.
1. [ ] Use either PostgreSQL or MongoDB as a persistence layer.
1. [ ] If you choose to use PostgreSQL, use Prisma ORM (or even try Drizzle, or Kysely) to interact with PostgreSQL.
1. [ ] If you choose to use MongoDB, use Mongoose ORM to interact with the database.
1. [ ] Implement RESTful API endpoints for all required functionality (authentication, machine management, sensor management).
1. [ ] Implement time-series data storage and retrieval functionality for sensor data.
1. [ ] Ensure the API has proper error handling and validation.
1. [ ] Implement unit tests for backend code.
1. [ ] The latency between client and the server side should be below 350ms for all requests.

7 - Time-Series Data Management

1. [ ] As a user, I want to be able to store raw sensor data as time-series for my monitoring points.
1. [ ] As a user, I want to be able to retrieve metrics about the time-series data for my sensors.
1. [ ] As a user, I want to be able to delete time-series data I've sent to the server.
1. [ ] As a user, I want to be able to retrieve the number of time-series I've stored in the server.
1. [ ] As a user, I want to be able to retrieve a full time-series I've stored.
1. [ ] As a user, I want to be able to visualize time-series data in a chart or graph format.

8 - Bonus

1. [ ] Use Nx to manage the whole application as a monorepo (we use that tool a lot here).
1. [ ] Add e2e tests with Cypress (use it to test a full user flow).
1. [ ] If you were provided with a baseline code, identify any areas of bad code or suboptimal implementations and refactor them.
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.
1. [ ] Implement a functionality that gives a future prediction of the time-series data.
1. [ ] Add load balancer to the application.
1. [ ] Add load tests to the application.

9 - Tips

1. [ ] There is no need to reinvent the wheel. You can use a Material UI 5 free template like [Devias Kit](https://mui.com/store/items/devias-kit/) to speed up the development process.
1. [ ] Not familiar with Redux? Check out [this tutorial](https://egghead.io/courses/modern-redux-with-redux-toolkit-rtk-and-typescript-64f243c8) to get started.
1. [ ] Not familiar with Cypress? Check out [these tutorials](https://learn.cypress.io/) to get started.
1. [ ] For time-series data visualization, consider using libraries like [Recharts](https://recharts.org/), [Chart.js](https://www.chartjs.org/), or [D3.js](https://d3js.org/).
</br>


## Evaluation Criteria

The items listed above will have different weights in the evaluation process. Each one of them will be evaluated as "Not Implemented", "Implemented with Issues", "Implemented", or "Implemented with Excellence". Use your judgement to prioritize the requirements you will implement in the time you have available. 

In general we will be looking for the following:

1. [ ] Anyone should be able to follow the instructions and run the application.
1. [ ] User stories were implemented according to the functional requirements.
1. [ ] Front-end code is successfully integrated with a back-end API.
1. [ ] Back-end code successfully integrates with a persistent storage solution.
1. [ ] Time-series data is properly stored, processed, and visualized.
1. [ ] Ability to refactor existing code (if applicable) and write unit tests for both front-end and back-end code.
1. [ ] Adherence to best practices in both front-end and back-end development.
1. [ ] API performance meets the latency requirements.
1. [ ] Problem-solving skills and ability to handle ambiguity.
1. [ ] Code quality, readability, and maintainability.
1. [ ] Code is well-organized and documented.
1. [ ] Use of atomic and semantic commits following a clear commit message convention (e.g., Conventional Commits).

## Ready to Begin the Challenges?

1. [ ] Fork this repository to your own Github account.
1. [ ] Create a new branch using your first name and last name. For example: `caroline-oliveira`.
1. [ ] After completing the challenge, create a pull request to this repository (https://github.com/dynamox-s-a/js-ts-full-stack-test), aimed at the main branch.
1. [ ] We will receive a notification about your pull request, review your solution, and get in touch with you.

## Frequently Asked Questions

1. Can I use create-react-app to complete the challenge?
  **No, create-react-app is not acceptable for this challenge.**
  
1. Can I use Next.js or Vite to complete the challenge?
  **Yes, you should use of either Next.js or Vite for this challenge.**

1. Is it necessary to fork the project?
  **Yes, this allows us to see how much time you spent on the challenge.**

1. Can I use Material UI in the project?
  **Yes, the use of Material UI 5 is mandatory for this challenge.**

1. If I have more questions, who can I contact?
  **Please reply to the email who sent you this test.**

1. Is implementing a back-end API required?
  **Yes, implementing your own back-end API is now a core requirement, not a bonus. It needs to use NodeJS.**

1. Can I use AI to complete the challenge?
  **Yes, however, keep in mind you will need to explain your decisions and code.**

</br>

**Good luck! We look forward to reviewing your submission.** 🚀
