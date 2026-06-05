const URL = 'https://frontend-test-for-qa.vercel.app/'

describe('Dashboard de Sensores', () => {

  beforeEach(() => {
    cy.visit(URL)
  })

  // CABEÇALHO
  describe('Cabeçalho', () => {
    it('deve exibir o cabeçalho com informações da máquina', () => {
      cy.contains('Análise de dados').should('be.visible')
    })

    it('deve carregar os metadados da máquina via API', () => {
      cy.request('https://frontend-test-for-qa.vercel.app/metadata.json').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.empty
      })
    })
  })

  // GRÁFICOS
  describe('Gráficos', () => {
    it('deve exibir 3 gráficos na página', () => {
      cy.get('svg').should('have.length.at.least', 3)
    })

    it('deve exibir o gráfico de Aceleração RMS', () => {
      cy.contains('Aceleração RMS').should('be.visible')
    })

    it('deve exibir o gráfico de Velocidade RMS', () => {
      cy.contains('Velocidade RMS').should('be.visible')
    })

    it('deve exibir o gráfico de Temperatura', () => {
      cy.contains('Temperatura').should('be.visible')
    })
  })

  // DADOS
  describe('Carregamento de Dados', () => {
    it('deve carregar os dados da API ao acessar a página', () => {
      cy.request('https://frontend-test-for-qa.vercel.app/data.json').then((response) => {
       expect(response.status).to.eq(200)
       expect(response.body).to.not.be.empty
      })
    })
  })

})