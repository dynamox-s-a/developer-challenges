// Cenários para validar funcionamento e resposta da api GET /metadata
describe('Validar API /metadata.json', () => {

  // Loop para acessar o site antes de cada cenário e evitar repetição de código
  beforeEach(() => {
    cy.openApp();
  });

  // Valida status de resposta da API 
  it('Deve retornar status 200', () => {
    cy.request('/metadata.json')
      .its('status')
      .should('eq', 200);
  });

  // Valida se a API está retornando todos os dados necessários para o header
  it('Deve conter os campos machine, spot, rpm, dynamicRange e interval', () => {
    cy.request('/metadata.json').then((response) => {

      expect(response.body).to.have.property('machine');
      expect(response.body).to.have.property('spot');
      expect(response.body).to.have.property('rpm');
      expect(response.body).to.have.property('dynamicRange');
      expect(response.body).to.have.property('interval');
      expect(response.body.machine).to.not.be.empty;
      expect(response.body.spot).to.not.be.empty;
      expect(response.body.rpm).to.not.be.empty;
      expect(response.body.dynamicRange).to.not.be.empty;

    });
  });

  // Valida se é feito um novo request quando a página é recarregada
  it('Deve realizar uma nova request após recarregar a página', () => {
    cy.intercept('GET', '/metadata.json').as('getUser')
    cy.wait('@getUser')
    cy.reload()
    cy.wait('@getUser')
    cy.get('@getUser.all').then((calls) => {
      expect(calls.length).to.eq(2)
    });
  });
});