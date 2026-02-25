describe('Edit Event Flow', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=';

  let currentEventName = '';
  let currentEventId = '';

  beforeEach(() => {
    currentEventId = `cypress-edit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    currentEventName = `Event To Be Edited ${currentEventId}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockEvent = {
      id: currentEventId,
      name: currentEventName,
      description:
        'This description needs to be exactly or more than fifty characters long to pass the Zod schema validation correctly.',
      dateTime: '2200-02-26T16:32',
      location: 'Original Location',
      category: 'Webinar',
      createdBy: 'admin@events.com',
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/events',
      body: mockEvent,
      failOnStatusCode: false,
    });

    cy.setCookie('token', fakeToken);

    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', fakeToken);
        win.document.cookie = `token=${fakeToken}; path=/;`;
      },
    });
  });

  it('Should successfully edit an existing event', () => {
    cy.url().should('include', '/events');

    cy.get(`[data-testid="edit-button-${currentEventId}"]`).click();

    cy.url().should('include', '/edit');

    cy.get('[data-testid="name-input"]').find('input').clear().type('Event After Edition');
    cy.get('[data-testid="location-input"]').find('input').clear().type('Edited Location - RJ');

    cy.get('[data-testid="category-input"]').click();
    cy.get('[role="option"]').contains('Networking').click();

    cy.get('[data-testid="save-button"]').click();

    cy.url().should('include', '/events');
    cy.contains('Event After Edition').should('be.visible');
    cy.contains(currentEventName).should('not.exist');
    cy.contains('Edited Location - RJ').should('be.visible');
  });

  it('Should validate required fields and zod rules during edition', () => {
    cy.url().should('include', '/events');
    cy.get(`[data-testid="edit-button-${currentEventId}"]`).click();

    cy.url().should('include', '/edit');
    cy.get('[data-testid="description-input"]').find('textarea').first().clear().type('Short text');
    cy.get('[data-testid="save-button"]').click();

    cy.contains('A descrição deve ter pelo menos 50 caracteres').should('be.visible');
    cy.url().should('include', '/edit');
  });

  it('Should cancel edition and not change data', () => {
    cy.url().should('include', '/events');
    cy.get(`[data-testid="edit-button-${currentEventId}"]`).click();

    cy.url().should('include', '/edit');

    cy.get('[data-testid="name-input"]').find('input').clear().type('Cancelled Title Modification');
    cy.get('[data-testid="cancel-button"]').click();

    cy.url().should('include', '/events');

    cy.contains(currentEventName).should('be.visible');
    cy.contains('Cancelled Title Modification').should('not.exist');
  });
});
