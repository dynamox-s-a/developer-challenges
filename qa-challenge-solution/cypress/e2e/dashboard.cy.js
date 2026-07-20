describe('Desafio Técnico - Dashboard de Sensores', () => {

    beforeEach(() => {
        // Acessa a aplicação
        cy.visit('https://frontend-test-for-qa.vercel.app');
    });

    it('Deve exibir as informações da máquina (Metadata) no topo', () => {
        // Validações diretas baseadas no texto que está visível na tela
        cy.contains('Máquina 1023').should('be.visible');
        cy.contains('Ponto 20192').should('be.visible');
        cy.contains('200').should('be.visible');
        cy.contains('16g').should('be.visible');
    });

    it('Deve renderizar os 3 gráficos de séries temporais', () => {
        // Valida os títulos principais dos gráficos na tela
        cy.contains('Aceleração RMS').should('be.visible');
        cy.contains('Temperatura').should('be.visible');
        cy.contains('Velocidade RMS').should('be.visible');

        // Valida a presença física dos 3 containers do Highcharts
        cy.get('.highcharts-container').should('have.length', 3);
    });

    it('Deve exibir o tooltip com os valores ao passar o mouse sobre o gráfico', () => {
        // Pegamos o primeiro gráfico e usamos o realHover com coordenadas (x, y) 
        // relativas ao próprio container para garantir que tocaremos na área do gráfico
        cy.get('.highcharts-container').first().realHover({ pointerPosition: { x: 200, y: 150 } });

        // Valida se a estrutura de tooltip ativa do Highcharts aparece na tela
        cy.get('.highcharts-tooltip').should('be.visible');
    });
});