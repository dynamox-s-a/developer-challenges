describe('JSON Server Integration Test', () => {
  beforeEach(() => {
    // Interceptar requisições para verificar fonte dos dados
    cy.intercept('GET', 'http://localhost:3001/**').as('jsonServerRequest');
    cy.intercept('GET', '/response-challenge-v2.json').as('staticRequest');
  });

  it('should connect to json-server when available', () => {
    // Verificar se json-server está rodando
    cy.request('GET', 'http://localhost:3001/0').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('data');
    });
  });

  it('should load data from json-server endpoints', () => {
    // Testar diferentes endpoints do json-server
    const endpoints = ['/0', '/1', '/2', '/3', '/4', '/5', '/6'];
    
    endpoints.forEach(endpoint => {
      cy.request('GET', `http://localhost:3001${endpoint}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('array');
      });
    });
  });

  it('should verify json-server data structure', () => {
    cy.request('GET', 'http://localhost:3001/0').then((response) => {
      const sensor = response.body;
      
      // Verificar estrutura dos dados
      expect(sensor.name).to.be.a('string');
      expect(sensor.data).to.be.an('array');
      expect(sensor.data.length).to.be.greaterThan(0);
      
      // Verificar estrutura dos pontos de dados
      const dataPoint = sensor.data[0];
      expect(dataPoint).to.have.property('datetime');
      expect(dataPoint).to.have.property('max');
      expect(dataPoint.datetime).to.be.a('string');
      expect(dataPoint.max).to.be.a('number');
    });
  });

  it('should test json-server with different sensor types', () => {
    // Testar diferentes tipos de sensores
    cy.request('GET', 'http://localhost:3001/0').then((response) => {
      expect(response.body.name).to.include('acceleration');
    });

    cy.request('GET', 'http://localhost:3001/3').then((response) => {
      expect(response.body.name).to.include('velocity');
    });

    cy.request('GET', 'http://localhost:3001/6').then((response) => {
      expect(response.body.name).to.include('temperature');
    });
  });

  it('should verify CORS headers from json-server', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3001/0',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('access-control-allow-origin');
      expect(response.headers['access-control-allow-origin']).to.eq('*');
    });
  });
});
