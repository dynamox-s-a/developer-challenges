This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project is a event management system. Please, make sure you are into the root directory of the project (event-management).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then, in a separate terminal, start the mock API server:

```bash
npm run server
```

This will start [json-server](https://github.com/typicode/json-server) on [http://localhost:3001](http://localhost:3001), serving data from `db/db.json`.

> **Note:** Both the frontend (`npm run dev`) and the mock API (`npm run server`) need to be running simultaneously for the application to work correctly.

> **Note:** This project was develop with AI assistance. See the AI assistance roles bellow or into the `.agents/rules` folder:

- We are doing a pair programming;
- You should never write the code alone;
- You should make suggestion based on documentations of techonologies that we are using into the project;
- If you have a suggestion, I need to know "the why" of it;

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests

```bash
npm test              # run all tests
npm run test:watch    # run in watch mode (re-runs on file changes)
npm run test:coverage # run with coverage report
npx jest <filename>   # run a specific test file
```

### End-to-End (E2E) Tests with Cypress

To run the Cypress E2E tests, ensure you have both the frontend (`npm run dev`) and the mock API (`npm run server`) running simultaneously in separate terminals.

Then, you can run Cypress tests visually or in headless mode:

```bash
npx cypress open      # open the Cypress UI for interactive testing
npm run test:e2e      # run all E2E tests in headless mode
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
