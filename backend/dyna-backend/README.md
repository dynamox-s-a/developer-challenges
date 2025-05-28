<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


-------

Comando para subir o Docker para essa aplicação:

```bash
docker run --name dyna-postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

```bash
PORT=5432
DATABASE=postgres
USER=postgres
PASSWORD=123456
```

Informações para rodar as migrations:

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started



You can use the following user stories as a guide to implement the application features:

11 - Authentication

1. [x] As a user, I want to log in using a fixed email and password so that I can access private routes.
1. [ ] As a user, I want to be able to log out of the system so that I can prevent unauthorized access to my account.
1. [x] No private routes should be accessible without authentication.

2 - Machine Management

1. [x] As a user, I want to create a new machine with an arbitrary name and with a type selected from a list ["Pump", "Fan"] so that I can manage it later.
1. [x] As a user, I want to change the attributes (name and type) of a machine after creating it so that I can keep the machine information updated.
1. [x] As a user, I want to delete a machine when it is no longer in use so that it doesn't clutter the system.

3 - Monitoring Points and Sensors Management

1. [ ] As a user, I want to create at least two monitoring points with arbitrary names for an existing machine, so that I can monitor the machine's performance.
1. [x] As a user, I want to associate a sensor to an existing monitoring point so that I can monitor the machine's performance. The sensor should have a unique ID, and the sensor model name should be one of ["TcAg", "TcAs", "HF+"].
1. [ ] As a user, I want the system to prevent me from setting up "TcAg" and "TcAs" sensors for machines of the type "Pump".
1. [ ] As a user, I want to see all my monitoring points in a paginated list so that I can manage them. The list should display up to 5 monitoring points per page and should include the following information: "Machine Name", "Machine Type", "Monitoring Point Name", and "Sensor Model".
1. [ ] As a user, I want to sort the monitoring points list by any of its columns in ascending or descending order, so that I can easily find the information I'm looking for.

4 - Ambiguity Handling

1. [ ] Make reasonable assumptions and design the application accordingly for any ambiguities in the challenge.
1. [ ] Document your assumptions in the README file.

5 - Technical requirements

1. [x] Use TypeScript.
1. [ ] Use React.
1. [ ] Use Redux for managing global states.
1. [ ] Use Redux Thunks or Redux Saga for managing asynchronous side effects.
1. [ ] Use Next.js or Vite.
1. [ ] Use Material UI 5 for styling the application.
1. [ ] Create reusable components.
1. [x] The code is well-organized and documented.
1. [ ] The application layout is responsive.
The choice of remaining tools is at your discretion.

6 - Bonus

1. [ ] Implement unit tests for the application (let us know how to run them, otherwise we won't be able to evaluate).
1. [ ] Implement your own back-end code. If you pick this option, write it using NodeJS JavaScript runtime (not Java, not PHP...). Although we also work with Python here, we are looking for JavaScript related skills in this test.
1. [ ] If you choose to implement your own back-end, we encourage you to use either PostgreSQL or MongoDB as a persistence layer.
1. [ ] If you choose to use PostgreSQL, use Prisma ORM (or even try Drizzle, or Kysely) to interact with PostgreSQL.
1. [ ] If you choose to use MongoDB, use Mongoose ORM to interact with the database;
1. [x] Use Nest.js Framework for the back-end (we are moving some services to that tool).
1. [ ] Use Nx to manage the whole application as a monorepo (we use that tool a lot here).
1. [ ] Add e2e tests with Cypress (use it to test a full user flow).
1. [ ] If you were provided with a baseline code, identify any areas of bad code or suboptimal implementations and refactor them.
1. [ ] Deploy your application to a cloud provider and provide a link for the running app.

7 - Tips

1. [ ] There is no need to reinvent the wheel. You can use a Material UI 5 free template like [Devias Kit](https://mui.com/store/items/devias-kit/) to speed up the development process.
1. [ ] Not familiar with Redux? Check out [this tutorial](https://egghead.io/courses/modern-redux-with-redux-toolkit-rtk-and-typescript-64f243c8) to get started.
1. [ ] Not familiar with Cypress? Check out [these tutorials](https://learn.cypress.io/) to get started.
1. [ ] You can mock your back-end using a package like [json-server](https://www.npmjs.com/package/json-server), which creates a fake REST API. Bear in mind that those implementing their own back-end will check more boxes in the evaluation process.

