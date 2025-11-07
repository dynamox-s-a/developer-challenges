# QA Test for Web Applications

In this challenge, we will evaluate your ability to develop automated tests for a web application responsible for displaying data from a vibration and temperature sensor.

Consider the following development flow. The Product team has created the functional requirements and provided the following [file](https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste?type=design&node-id=1001%3A3&mode=design&t=JLnbGmQJcSlnYYE2-1) containing the screen prototype. The product requirements are:

1. As a user, I want to view a screen containing a small header with machine information and some charts.
2. As a user, I want to view 3 time series charts for RMS Acceleration, RMS Velocity, and Temperature.
3. As a user, I want the data to be refreshed every time I access the page.
4. As a user, when hovering over the time series, I want to see a tooltip displaying the data values.

To obtain the data, the following requests are made:

* **GET** request to the */data* route. Contains time series data that will be displayed in the charts. For the purposes of this test, the data is static.
* **GET** request to the */metadata* route. Contains information associated with the monitoring point that will be displayed in the header.

The web application is available at this [link](https://frontend-test-for-qa.vercel.app/).

## Test Requirements

The product requirements represent macro-journeys, so also consider implementation details:

* Can the user complete this journey?
* Does the implementation meet all specifications of the prototype?
* Are there any strange or unexpected behaviors?

Implement automated tests for each scenario you find appropriate. Tests are expected to pass where the criteria are met and fail where they are not.

## Evaluation Criteria

The following items will be evaluated:

* Organization and structure of the test repository.
* Code documentation and readability.
* Test quality and coverage.

Also consider:

* Found a defect but don’t know how to create an automated test for it? Describe how you would report the issue to the developer.
* Found a product requirement not specified in the prototype? Describe how you would report it to the designer.
* There is no minimum or maximum number of tests. Find a balance between software robustness and test execution time.
* The choice of framework is up to you.

## Ready to Begin the Challenges?

* Fork this repository to your own Github account.
* Create a new branch using your first name and last name. For example: `caroline-oliveira`.
* After completing the challenge, create a pull request to this repository (https://github.com/dynamox-s-a) pointing to the main branch.
* We will receive a notification about your pull request, review your solution and get in touch with you.
<br>

**Good luck! We look forward to reviewing your submission.** 🚀

## Frequently Asked Questions

* Is it necessary to fork the project?
  **Yes, this allows us to see how much time you spent on the challenge.**

* If I have more questions, who can I contact?
  **Please reply to the email who sent you this test.**
