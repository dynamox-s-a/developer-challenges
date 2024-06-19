describe('GraficosComponent', () => {
    beforeEach(() => {
      cy.visit('/'); // Supondo que você tenha uma rota configurada para renderizar o componente GraficosComponent
    });
  
    it('deve renderizar o gráfico corretamente com os dados fornecidos', () => {
      // Simula dados para o teste
      const data = [
        { data: [{ datetime: '2023-06-01T12:00:00Z', max: 10 }, { datetime: '2023-06-02T12:00:00Z', max: 15 }] },
        { data: [{ datetime: '2023-06-01T12:00:00Z', max: 5 }, { datetime: '2023-06-02T12:00:00Z', max: 8 }] },
      ];
      const seriesLabels = ['accelerationRmsx', 'accelerationRmsy'];
  
      // Verifica se o gráfico é renderizado com as legendas corretas
      cy.get('.MuiLineChart-root').should('exist');
      cy.get('.MuiLineChart-root').within(() => {
        cy.get('.MuiLegend-label').eq(0).should('contain.text', 'Axial');
        cy.get('.MuiLegend-label').eq(1).should('contain.text', 'Horizontal');
      });
  
      // Verifica se as séries do gráfico têm os dados corretos
      cy.get('.MuiLineChart-root').within(() => {
        cy.get('.MuiLineChart-series').should('have.length', 2);
  
        cy.get('.MuiLineChart-series').eq(0).within(() => {
          cy.get('.MuiLineChart-line').should('have.css', 'stroke', 'rgb(65, 132, 205)');
        });
  
        cy.get('.MuiLineChart-series').eq(1).within(() => {
          cy.get('.MuiLineChart-line').should('have.css', 'stroke', 'rgb(189, 64, 124)');
        });
      });
    });
  });