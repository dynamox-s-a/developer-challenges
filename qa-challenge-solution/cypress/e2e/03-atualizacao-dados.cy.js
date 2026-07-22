describe('US03 - Carregamento e Atualização de Dados', () => {
    it('Deve realizar as requisições de dados com sucesso ao carregar a página', () => {
        // Intercepta as chamadas de API/arquivos de dados antes de carregar
        cy.intercept('GET', '**/metadata.json').as('getMetadata');
        cy.intercept('GET', '**/data.json').as('getData');

        cy.visit('https://frontend-test-for-qa.vercel.app');

        // Valida que a aplicação respondeu 200 OK
        cy.wait('@getMetadata').its('response.statusCode').should('eq', 200);
        cy.wait('@getData').its('response.statusCode').should('eq', 200);
    });
});