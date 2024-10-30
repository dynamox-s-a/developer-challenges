This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Assumptions

1. A sensor can be associated with a single monitoring point.
2. Users can name their monitoring points with arbitrary names, as long as they are not left blank.
3. For sensor association, only one sensor can be associated with a monitoring point at a time.
4. The list of monitoring points can be sorted by any column, regardless of how many monitoring points there are.

## Remarks / future implementations

1. I haven't had time to clean up the project and organize it into clean code and clean architecture
2. Standardize the code in English
3. After I added the back-end and the database, the registration of sensors is not working, when creating the monitoring point, immediately afterwards, press cancel or refresh the page.
4. I haven't had time to implement unit tests.
5. The front end must run on port 3001 and the back end on port 3000. To run the front end just use the command npm run dev and for the back end npm run start:dev
6. The default user is login: admin password: admin
