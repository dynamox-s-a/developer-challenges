describe('US01 - Cabeçalho e Metadados da Máquina', () => {
    beforeEach(() => {
        cy.visit('https://frontend-test-for-qa.vercel.app');
    });

    it('Deve exibir as informações básicas da máquina no topo da página', () => {
        cy.contains('Máquina 1023').should('be.visible');
        cy.contains('Ponto 20192').should('be.visible');
        cy.contains('200').should('be.visible');
        cy.contains('16g').should('be.visible');
    });
});