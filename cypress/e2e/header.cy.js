describe('Cabeçalho da aplicação', () => {
  it('teste dinâmico', () => {
    cy.intercept('GET', '**metadata.json').as('getMetadata');
    cy.visit('https://frontend-test-for-qa.vercel.app/');
    cy.wait('@getMetadata').then((interception) => {
      const data = interception.response.body;
      cy.contains(data.machine).should('be.visible');
      cy.contains(data.spot).should('be.visible');
      cy.contains(data.rpm).should('be.visible');
      cy.contains(data.dynamicRange).should('be.visible');
    });
  });

  /*
  it('teste fixo (desativado)', () => {
    cy.intercept('GET', '**metadata.json').as('getMetadata');
    cy.visit('https://frontend-test-for-qa.vercel.app/');
    cy.wait('@getMetadata').its('response.statusCode').should('eq', 200);
    cy.contains('Máquina 1023').should('be.visible');
    cy.contains('Ponto 20192').should('be.visible');
    cy.contains('200').should('be.visible');
    cy.contains('16g').should('be.visible');
  });
  */
});

 
