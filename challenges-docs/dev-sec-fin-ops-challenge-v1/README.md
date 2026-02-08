# Dynamox Dev-Sec-Fin-Ops Developer Challenge

[< back to Dynamox Developer Challenges](https://github.com/dynamox-s-a/developer-challenges)

In order to contribute to the enhancement of Dynamox solutions, we present you with the following challenge:

Build a robust and intuitive infrastructure developed using Terraform, Kubernetes, Docker, and Google Cloud. It should include two Kubernetes workloads and brief analysis about DevOps, SecOps and FinOps. **This workloads are extremously complex: an extractor and an API that counts the number of successful requests. Please use this merely as a case of study.**

While going through the challenge, you should be able to handle ambiguous situations, adhere to best practices in cloud development, and demonstrate excellent problem-solving skills. Effective communication through well-documented code, code quality, readability, and maintainability will also be evaluated.

## User Stories and Functional Requirements

Here you have the functional requirements for the application. You are free to make any assumptions you consider necessary to complete the challenge. If you have any questions, reply to the email who sent you this test.

---

It is not mandatory to implement all the listed requirements before submitting your implementation. Just keep in mind that the more requirements you implement, the more you will be able to demonstrate your skills and knowledge. **Plan yourself to demonstrate what you want. Planning for future implementantion that are not required is also encoraged.**

We will expect candidates applying to more senior levels to demonstrate a deeper understanding of the requirements and to implement / plan / propose more of them for the same deadline.

---

You can use the following user stories as a guide to implement the application features. [Use dev-sec-fin-ops-challenge-answer-template.md as your answer template](./challenge-answer-template.md).

1 - Backend Deployment

1. [ ] As an user, I want to request (via a REST API) the number of successful requests received by the Backend Deployment.
1. [ ] As a developer, I want to run the service locally.
1. [ ] As a developer, I want to run the service in docker environment.
1. [ ] As a developer, I want to run the service in minikube environment.

2 - Extraction Cronjob

1. [ ] As an user, I want to access the requests that were extracted from Backend Deployment in a frequency of every-15-minutes by the Extractor Cronjob.
1. [ ] As a developer, I want to run the service locally.
1. [ ] As a developer, I want to run the service in docker environment.
1. [ ] As a developer, I want to run the service in minikube environment.

3 - DevOps Analysis

1. [ ] Describe the process to release a new version of these services and propose/implement automation pipelines.

4 - SecOps Analysis

1. [ ] List any security risks involving these services and propose mitigation actions.

5 - FinOps Analysis

1. [ ] Make 30-days and 365-days cost estimative of the services on Google Cloud, considering the following configurations.
**Attention! Do not use this number of pods in your test configuration, avoid cloud charges whenever is possible**

| Attributes     | Backend Deployment | Extraction Cronjob |
| -------------- | ------------------ | ------------------ |
| Machine Type   | n1-highcpu-4       | n1-highmem-2       |
| Number of Pods | 55                 | 28                 |
| CPU            | 1250m              | 0.5                |
| Memory         | 512Mi              | 2Gi                |

6 - Bonus

1. [ ] Draw a architectural diagram for this test.
1. [ ] Implement your own back-end code (NodeJS JavaScript runtime or Python is a differentiator).
1. [ ] Use Nest.js Framework (JS) or FastApi Framework (Python) for the back-end.
1. [ ] Use either PostgreSQL, MongoDB, or filesystem bucket-like solution (for example, Google Storage) as a persistence layer of your backend.
1. [ ] Implement logs for the applications (let us know how to find them, otherwise we won't be able to evaluate).
1. [ ] Implement unit tests for the application (let us know how to run them, otherwise we won't be able to evaluate).
1. [ ] Implement e2e tests (full user flow) with Cypress (NodeJs) or Pytest (Python).
1. [ ] If you were provided with a baseline code, identify any areas of bad code or suboptimal implementations, refactor them, and documment refactors.
1. [ ] Implement and document DevOps, SecOps, and FinOps improvements.
1. [ ] Implement an authentication/authorization layer.
1. [ ] Use service monitoring tools (such as Prometheus, Grafana).
1. [ ] Deploy your application to a cloud provider (Google Cloud is a differentiator) and provide a link for the running app.

7 - Tips

1. [ ] Not familiar with Terraform? Check out [these tutorials](https://developer.hashicorp.com/terraform/tutorials) to get started.
1. [ ] Not familiar with MiniKube? Check out [these tutorials](https://minikube.sigs.k8s.io/docs/tutorials/) to get started.
1. [ ] Not familiar with Docker? Check out [these tutorials](https://docs.docker.com/get-started/) to get started.
1. [ ] You can mock your back-end using a docker image like [nginx](https://hub.docker.com/_/nginx) or a package like [json-server](https://www.npmjs.com/package/json-server), which creates a fake REST API. Bear in mind that those implementing their own back-end will check more boxes in the evaluation process.

</br>

## Evaluation Criteria

The items listed above will have different weights in the evaluation process. Each one of them will be evaluated as "Not Implemented", "Implemented with Issues", "Implemented", or "Implemented with Excellence". Use your judgement to prioritize the requirements you will implement in the time you have available.

In general we will be looking for the following:

1. [ ] Anyone should be able to follow the instructions and run the applications.
1. [ ] User stories were implemented according to the functional requirements.
1. [ ] Infrastructure code is successfully integrated with a backend APIs (either a fake one, or one you built yourself).
1. [ ] Infrastructure code is successfully integrated with local or cloud infrastructure.
1. [ ] Documment future implementations in a clear way.
1. [ ] Ability to refactor existing code (if applicable) and write tests for the written code.
1. [ ] Adherence to best practices in cloud development.
1. [ ] Problem-solving skills and ability to handle ambiguity.
1. [ ] Code quality, readability, and maintainability.

## Ready to Begin the Challenges?

1. [ ] Fork this repository to your own Github account.
1. [ ] Create a new branch using your first name and last name. For example: `caroline-oliveira`.
1. [ ] After completing the challenge, create a pull request to this repository (https://github.com/dynamox-s-a/dev-sec-fin-ops-developer-challenge), aimed at the main branch.
1. [ ] We will receive a notification about your pull request, review your solution, and get in touch with you.

## Frequently Asked Questions

1. Is it necessary to fork the project?
  **Yes, this allows us to see how much time you spent on the challenge.**

1. If I have more questions, who can I contact?
  **Please reply to the email who sent you this test**

1. Can I build my own back-end API?
  **Yes, you can build your own back-end API, but it needs to use NodeJS or Python.**

1. Can I use any NodeJS framework to the back-end?
  **Yes, but we encourage you to use Nest.js. We are currently migrating away from pure ExpressJS and from Adonis.**

</br>

**Good luck! We look forward to reviewing your submission.** 🚀
