// cypress/e2e/charts.cy.js

// cypress/e2e/charts.cy.js

// cypress/e2e/charts.cy.js

describe('Gráficos da aplicação', () => {
  it('deve exibir os gráficos e validar os dados de data.json', () => {
    // intercepta a chamada ao data.json
    cy.intercept('GET', '**data.json').as('getData');

    // abre a aplicação
    cy.visit('https://frontend-test-for-qa.vercel.app/');

    // espera a resposta da API
    cy.wait('@getData').then((interception) => {
      const response = interception.response.body;

      // ✅ valida que o gráfico foi renderizado (canvas ou svg)
      cy.get('canvas, svg', { timeout: 10000 }).should('be.visible');

      // ✅ valida que os dados chegaram corretamente
      expect(response.data).to.be.an('array').that.is.not.empty;

      // exemplo: valida que a série de temperatura tem valores numéricos
      const temperatureSerie = response.data.find(s => s.name === 'temperature');
      expect(temperatureSerie).to.exist;
      expect(temperatureSerie.data[0].max).to.be.a('number');
    });
  });
});




