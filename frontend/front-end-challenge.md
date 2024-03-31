# Dynamox Front-end Developer Challenge

[< back to README](./README.md)

Dynamox front-end development team presents you with the following challenge:

**Using React and TypeScript, develop a robust and intuitive dashboard application that allows assessing the data acquired by our sensors.**

---

Keep in mind the challenge aims to reproduce an environment where you could demonstrate your skills. 

In order to help guiding your development process we will provide some requirements. It is not mandatory to fulfill all requirements to submit your implementation. The more requirements you implement, the more resources we will have to assess your skills and knowledge. 

Use your best judgement to prioritize tasks to meet the time you have available. Feel free to make any assumptions you consider necessary to complete the task.

## Functional Requirements and User Stories

In maintenance industry, vibration analysis plays a main role: It uses physical quantities like acceleration and velocity to find evidences that help predict occurence of faults or degradations in machines. 

The page that displays this information in DynaPredict, our asset condition monitoring platform, is designed pretty much like [this](https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste?type=design&node-id=1001%3A3&mode=design&t=JLnbGmQJcSlnYYE2-1).

Use the figma as a reference to build an interface and develop the following user stories:

1 - User Stories
1. [ ] As an user I want to acess the route */data* of my app and view a screen containing a small header with information about the machine and a couple of time-series charts.

1. [ ] As an user I want to view 3 time-series charts of the following metrics: *acceleration, velocity and temperature*. Each time series should have a horizontal axis for the time and a vertical axis for the metric magnitude.

1. [ ] As an user I want that the data that will populate these charts should be fetched each time I access the route */data*. Use the data available in [Responses](./response.json) as a mock and use a package like [json-server](https://www.npmjs.com/package/json-server) to build an REST API.

1. [ ] As an user I want to hover over a point of a chart and see a vertical crosshair marking equivalent timestamps in all time-series charts, with a tooltip describing that point. [Check out](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/synchronized-charts) to view a sample of this feature.


2 - Technical requirements
1. [ ] Use TypeScript.
1. [ ] Use React.
1. [ ] Use Redux for managing global states. [Check out](https://redux-toolkit.js.org/introduction/getting-started) to get started.
1. [ ] Use Redux Saga for asynchronous side effects. [Check out](https://redux-saga.js.org/docs/introduction/GettingStarted) to get started.
1. [ ] Use Vite for building the app. [Check out](https://vitejs.dev/guide/) to get started.
1. [ ] Use Material UI 5 for styling the application. [Check out](https://mui.com/material-ui/getting-started/) to get started.
1. [ ] Use Highcharts, Plotly, D3 or any similar library to display the plots. [Check out](https://www.highcharts.com/docs/index) to get started.

We encourage using our frontend stack tooling to make the challenge resemble our everyday tasks.

3 - Bonus
1. [ ] Add unit tests with Vitest. [Check out](https://vitest.dev/guide/) to get started.
1. [ ] Add e2e tests with Cypress. [Check out](https://learn.cypress.io/) to get started.
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.

## Evaluation Criteria

Each one of the itens above will be evaluated as "Not Implemented", "Implemented with Issues", "Implemented", or "Implemented with Excellence". In order to assess different profiles and experiences, we expect candidates applying to more senior levels demonstrate a deeper understanding of the requirements and implement more of them in the same deadline.

In general we will be looking for the following:
1. [ ] Anyone should be able to follow the instructions and run the application.
1. [ ] Front-end code is successfully integrated with a fake REST API.
1. [ ] Stories were implemented according to the functional requirements.
1. [ ] Problem-solving skills and ability to handle ambiguity.
1. [ ] Code quality, readability, and maintainability.
1. [ ] Code is well-organized and documented.
1. [ ] Application layout is responsive.

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
  **Please reach out to <rafael.schmitz@dynamox.net> (Front end dev).**