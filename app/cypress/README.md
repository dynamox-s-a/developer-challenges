# Cypress End-to-End Testing

This project is configured with Cypress for end-to-end testing. Cypress is a modern testing framework that allows you to test your application as a real user would interact with it.

## Directory Structure

```
cypress/
├── e2e/                 # End-to-end test specs
├── component/          # Component test specs
├── fixtures/           # Test data and mock files
└── support/            # Support files and commands
    ├── e2e.ts         # E2E support configuration
    ├── component.ts   # Component test support configuration
    └── commands.ts    # Custom Cypress commands
```

## Available Scripts

### Interactive Testing

```bash
npm run cypress:open
```

Opens the Cypress Test Runner in interactive mode. You can:

- Browse and select which tests to run
- See live preview of your app
- Step through test execution
- Debug tests in real-time

### Headless Testing (E2E Tests)

```bash
npm run test:e2e
```

Runs all E2E tests in headless mode (without opening a browser). The dev server is automatically started and stopped.

### Headed Testing (E2E Tests with Browser)

```bash
npm run test:e2e:headed
```

Runs E2E tests with the browser visible and opens the Cypress UI for interactive testing.

### Cypress CLI

```bash
# Run all tests
npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/app.cy.ts"

# Run tests in a specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
```

## Writing Tests

### E2E Tests

Create files in `cypress/e2e/` with the `.cy.ts` extension:

```typescript
describe('My Feature', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should do something', () => {
    cy.get('.button').click();
    cy.get('.result').should('contain', 'Success');
  });
});
```

### Component Tests

Create files in `cypress/component/` with the `.cy.tsx` extension:

```typescript
import React from 'react';
import { MyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    cy.mount(<MyComponent />);
    cy.get('.my-element').should('exist');
  });
});
```

## Custom Commands

Custom commands are defined in `cypress/support/commands.ts`. To use them in your tests:

```typescript
describe('Using Custom Commands', () => {
  it('should use custom command', () => {
    cy.login('user@example.com', 'password');
    cy.navigateTo('/dashboard');
  });
});
```

## Key Best Practices

1. **Use data-testid attributes** - Make your elements easier to find in tests:

   ```tsx
   <button data-testid="submit-btn">Submit</button>
   ```

2. **Wait for elements properly** - Cypress automatically waits for elements, but you can be explicit:

   ```typescript
   cy.get('[data-testid="submit-btn"]').should('be.visible');
   ```

3. **Test user behavior** - Test what users actually do, not implementation details:

   ```typescript
   cy.get('input[type="email"]').type('user@example.com');
   cy.get('button[type="submit"]').click();
   ```

4. **Use fixtures for test data** - Store test data in the `cypress/fixtures/` directory

5. **Keep tests focused** - Each test should verify one specific behavior

## Configuration

The Cypress configuration is defined in `cypress.config.ts`:

- **baseUrl**: `http://localhost:5173` (your dev server URL)
- **defaultCommandTimeout**: 5 seconds
- **requestTimeout**: 5 seconds
- **responseTimeout**: 10 seconds

## Running Tests in CI/CD

For continuous integration pipelines, use the headless mode:

```bash
npm run test:e2e
```

This command:

1. Starts the dev server
2. Waits for it to be ready
3. Runs all tests
4. Closes the server

## Troubleshooting

### Tests timeout

- Increase `defaultCommandTimeout` in `cypress.config.ts`
- Check if the dev server is running
- Verify network requests are completing

### Elements not found

- Use `cy.debug()` to pause test execution
- Use the Cypress UI to inspect elements
- Add `data-testid` attributes to your components

### Cross-origin issues

- Ensure all requests are made to the same domain
- Use `cy.intercept()` to mock external API calls

## Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
