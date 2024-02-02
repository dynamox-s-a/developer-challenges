# Dynamox Front-end Developer Challenge

[< back to README](../README.md)

Dynamox front-end development team presents you with the following challenge:

**Using React and TypeScript, develop a robust and intuitive dashboard application that allows assessing the data acquired by our sensors.**

---

## Instructions

[link to the running app in Vercel](https://dynamox-deploy.vercel.app/)

### Run dev environment

Open terminal, navigate to project folder:

```
cd frontend-challenge
```

start the app

```
npm run dev
```

---

## Functional Requirements and User Stories

1 - User Stories

1. [x] As an user I want to acess the route _/data_ of my app and view a screen containing a small header with information about the machine and a couple of time-series charts.

2. [x] As an user I want to view 3 time-series charts of the following metrics: _acceleration, velocity and temperature_. Each time series should have a horizontal axis for the time and a vertical axis for the metric magnitude.

3. [x] As an user I want that the data that will populate these charts should be fetched each time I access the route _/data_. Use the data available in [Responses](./response.json) as a mock and use a package like [json-server](https://www.npmjs.com/package/json-server) to build an REST API.

4. [ ] As an user I want to hover over a point of a chart and see a vertical crosshair marking equivalent timestamps in all time-series charts, with a tooltip describing that point. [Check out](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/synchronized-charts) to view a sample of this feature.

The last user story couldn't be completely satisfied due to inexperience using HighCharts. There's a need to use useRef() and add event listeners in order to synchronize the crosshairs across all charts

2 - Technical requirements

1. [x] Use TypeScript.
2. [x] Use React.
3. [x] Use Redux for managing global states. [Check out](https://redux-toolkit.js.org/introduction/getting-started) to get started.
4. [ ] Use Redux Saga for asynchronous side effects. [Check out](https://redux-saga.js.org/docs/introduction/GettingStarted) to get started.
5. [x] Use Vite for building the app. [Check out](https://vitejs.dev/guide/) to get started.
6. [x] Use Material UI 5 for styling the application. [Check out](https://mui.com/material-ui/getting-started/) to get started.
7. [x] Use Highcharts, Plotly, D3 or any similar library to display the plots. [Check out](https://www.highcharts.com/docs/index) to get started.

Redux saga was substituted by an async thunk due to inexperience with Redux saga and time saving.

3 - Bonus

1. [ ] Add unit tests with Vitest. [Check out](https://vitest.dev/guide/) to get started.
1. [ ] Add e2e tests with Cypress. [Check out](https://learn.cypress.io/) to get started.
1. [x] Deploy your application to a cloud provider and provide a link for the running app (link at the start of the document).
