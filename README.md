# Dynamox Developer Challenges - Solutions

This repository contains my solutions for the Dynamox Developer Challenges. Below you'll find details about each implemented project.

## Challenge 1: Landing Page

A modern and responsive landing page developed with React and TypeScript.

🌐 **Demo:** [renato-marinho.vercel.app](https://renato-marinho.vercel.app/)

### Technologies Used

- React (v19.0.0)
- TypeScript (v5.7.2)
- Vite (v6.3.1)
- Framer Motion (v12.9.2)
- TailwindCSS (v4.1.4)
- ESLint

### Key Features

- Modern UI design
- Responsive layout
- Smooth animations
- TypeScript integration
- Code quality assurance with ESLint

## Challenge 2: Events Management Platform

A platform for managing events with authentication and role-based access.

🌐 **Demo:** [renato-marinho-challenge-2.vercel.app](https://renato-marinho-challenge-2.vercel.app)

### Technologies Used

#### Frontend
- Next.js 15
- TypeScript
- Redux Toolkit
- Material UI
- TailwindCSS
- React Hook Form
- Zod

#### Testing
- Cypress (E2E)
- Jest (Unit Tests)

#### Documentation & Quality
- Storybook
- Biome
- Husky

### Key Features

- User authentication
- Role-based access (Admin/Reader)
- Event management (CRUD operations)
- Comprehensive test coverage
- Component documentation
- Mock API integration

### Authentication Credentials

**Admin Access:**
- Email: admin@events.com
- Password: admin123

**Reader Access:**
- Email: reader@events.com
- Password: reader123

## Running the Projects Locally

### Challenge 1: Landing Page

```bash
git clone https://github.com/renatomarinhofr/renato-marinho.git
cd challenge-1
npm install
npm run dev
```

### Challenge 2: Events Platform

```bash
git clone https://github.com/renatomarinhofr/renato-marinho.git
cd challenge-2
npm install
npm run dev # Start frontend and mock API
```

For Challenge 2's component documentation:
```bash
npm run storybook
```

## Testing

Both projects include comprehensive testing setups. Challenge 2 features both E2E and unit tests:

```bash
npm run cypress # Open Cypress UI
npm run cypress:run # Run tests headless
npm run test # Run unit tests
```

## Deployment

Both projects are deployed on Vercel:
- Challenge 1: [renato-marinho.vercel.app](https://renato-marinho.vercel.app/)
- Challenge 2: [https://renato-marinho-production.up.railway.app/login](https://renato-marinho-production.up.railway.app/login)

