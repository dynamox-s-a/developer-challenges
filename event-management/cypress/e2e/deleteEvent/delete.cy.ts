describe('Delete Event Flow', () => {
  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJhZG1pbkBldmVudHMuY29tIiwicm9sZSI6ImFkbWluIn0=';

  let currentEventName = '';
  let currentEventId = '';

  beforeEach(() => {
    // Gerar IDs únicos impede que o json-server quebre com 'duplicate id' antes do hook global limpar o db.json
    currentEventId = `cypress-delete-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    currentEventName = `Event To Be Deleted ${currentEventId}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockEvent = {
      id: currentEventId,
      name: currentEventName,
      description:
        'This description needs to be exactly or more than fifty characters long to pass the Zod schema validation correctly.',
      dateTime: tomorrow.toISOString(),
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

  it('Should successfully delete an existing event', () => {
    cy.url().should('include', '/events');

    // O evento recém-criado deve estar visível
    cy.contains(currentEventName).should('be.visible');

    // Acha o botão de deleção direto pelo data-testid concatenado com o id do evento (que definimos no beforeEach)
    cy.get(`[data-testid="delete-button-${currentEventId}"]`).click();

    // Verificamos que continuamos na lista de eventos, mas o evento sumiu
    cy.url().should('include', '/events');

    // O Cypress pode precisar de um momento para o refetch do Redux atualizar a UI,
    // .should('not.exist') tem retry automático
    cy.contains(currentEventName).should('not.exist');
  });
});
