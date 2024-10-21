# Dynamox Challenge
> This project allows users to manage machines, monitoring points, and sensors through a series of interconnected pages. The application includes several features accessible via a “+” button on each relevant page.

# Setup Instructions
## 1. Clone the repository 
```
git clone <https://github.com/fabianorong/fullstack-challenge.git>` 
cd <dynamox>`
```

## 2. Install dependencies:
```
`$ npm install
```

## 3. Configure environment variables:
Create a .env file at the root of the project and add the following environment variables:
```
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVsZXZhbnQtbGl6YXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_OLBBFOHjCBSbguEkYvumZRLCRtrQ5aHrbypoTLXGLV
NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/
```
## 4. Run database migrations
```
npx prisma migrate dev
```


# Running Locally
# 1. Start the development server:
```
`$ npm run dev
```

-  Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.