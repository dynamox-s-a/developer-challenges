describe('DynaPredict critical flow', () => {
  const machineName = `Cypress Pump ${Date.now()}`;

  it('logs in, creates a machine and opens monitoring points', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').clear().type('admin@dynamox.test');
    cy.get('input[type="password"]').clear().type('Dynamox@123');
    cy.contains('button', 'Login').click();

    cy.contains('Welcome', { timeout: 15000 }).should('be.visible');

    cy.contains('Machines').click();
    cy.contains('button', 'New machine').click();
    cy.get('label').contains('Name').parent().find('input').clear().type(machineName);
    cy.contains('button', 'Create').click();
    cy.contains(machineName).should('be.visible');

    cy.contains('Monitoring Points').click();
    cy.contains('h4', 'Monitoring Points').should('be.visible');
    cy.contains('button', 'New monitoring point').should('be.enabled');
  });
});
