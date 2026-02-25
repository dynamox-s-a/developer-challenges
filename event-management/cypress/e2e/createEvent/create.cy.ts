describe('Create Event Flow', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=';

  beforeEach(() => {
    cy.setCookie('token', fakeToken);

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
        win.document.cookie = `token=${fakeToken}; path=/;`;
      },
    });
  });

  it('Should successfully create a new event', () => {
    cy.contains('Upcoming Events').should('be.visible');
    cy.contains('Create event').click();

    cy.url().should('include', '/admin/create');
    cy.contains('Create Event').should('be.visible');

    cy.get('[data-testid="name-input"]').type('Cypress E2E Test Event');

    const validDescription =
      'This description is long enough to pass the zod validation of at least fifty characters required by the schema.';
    cy.get('[data-testid="description-input"]').type(validDescription);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().slice(0, 16);
    cy.get('[data-testid="date-input"]').type(dateString);

    cy.get('[data-testid="location-input"]').type('São Paulo - BR');

    cy.get('[data-testid="category-input"]').click();
    cy.get('[role="option"]').contains('Workshop').click();

    cy.get('[data-testid="save-button"]').click();

    cy.url().should('include', '/events');

    cy.get('[data-testid="event-name"]').contains('Cypress E2E Test Event').should('be.visible');
    cy.get('[data-testid="event-location"]').contains('São Paulo - BR').should('be.visible');
  });

  it('Should allow cancellation and return to events list', () => {
    cy.visit('/admin/create');
    cy.contains('Create Event').should('be.visible');

    cy.get('[data-testid="cancel-button"]').click();

    cy.url().should('include', '/events');
  });
});
