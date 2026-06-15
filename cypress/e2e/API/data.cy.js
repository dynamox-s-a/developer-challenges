// Cenários para validar funcionamento e resposta da api GET /data
describe('Validar API /data.json', () => {

// Loop para acessar o site antes de cada cenário e evitar repetição de código
  beforeEach(() => {
    cy.openApp();
  });

// Valida status de resposta da API 
  it('Deve retornar status 200', () => {
    cy.request('/data.json')
      .its('status')
      .should('eq', 200);
  });

// Valida se a API está retornando todos os dados necessários para o gráfico
  it('Deve retornar os campos de name, data, datetime e max corretamente', () => {
    cy.request('/data.json').then((response) => {

      const expectedNames = [
        'velocityRms/x',
        'velocityRms/y',
        'velocityRms/z',
        'accelerationRms/x',
        'accelerationRms/y',
        'accelerationRms/z',
        'temperature'
      ];

      const primeiroRegistro = response.body.data[0].data[0];
      
      response.body.data.forEach((item) => {
        expect(item).to.have.property('name');
        expect(item).to.have.property('data');
        expect(expectedNames).to.include(item.name);
        expect(primeiroRegistro.datetime).to.be.a('string');
        expect(primeiroRegistro.max).to.be.a('number'); 
      });
    });
  });

  // Valida se é feito um novo request quando a página é recarregada
  it('Deve realizar uma nova request após recarregar a página', () => {
    cy.intercept('GET', '/data.json').as('getUser')
    cy.wait('@getUser')
    cy.reload()
    cy.wait('@getUser')
    cy.get('@getUser.all').then((calls) => {
      expect(calls.length).to.eq(2)
    });
  });
});