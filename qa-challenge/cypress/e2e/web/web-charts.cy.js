describe('Web GUI Test - Charts', () => {
  it('Gets, types and asserts', () => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')

    //  Checking charts: 
    // 1. Charts titles:
    cy.contains('.MuiTypography-subtitle2', 'Aceleração RMS');
    cy.contains('.MuiTypography-subtitle2', 'Temperatura');
    cy.contains('.MuiTypography-subtitle2', 'Velocidade RMS');

    // 2. Must have at least three visible charts:
    cy.get('.highcharts-root').should('have.length.at.least', 3);
    cy.get('.highcharts-graph').eq(0).should('be.visible');
    cy.get('.highcharts-graph').eq(1).should('be.visible');
    cy.get('.highcharts-graph').eq(2).should('be.visible');

    // 3. Charts hovering:
    
    // Aceleração RMS chart - mouse bouncing to trigger the tooltip  
    cy.get('rect.highcharts-background').eq(0).then(($rect) => {
      const width = parseFloat($rect.attr('width'));
      const height = parseFloat($rect.attr('height'));

      const centerX = width / 2;
      const centerY = height / 2;

      const $el = cy.wrap($rect);

      $el.realMouseMove(centerX, centerY);

      const moves = [
        { x: centerX + 5, y: centerY },
        { x: centerX + 5, y: centerY + 5 },
        { x: centerX, y: centerY + 5 },
        { x: centerX - 5, y: centerY },
        { x: centerX, y: centerY - 5 },
        { x: centerX, y: centerY }
      ];

      moves.forEach((pos) => {
        $el.realMouseMove(pos.x, pos.y);
      });
    });

    // Aceleração RMS chart -checking tooltip
    cy.get('.highcharts-container').eq(0).find('path.highcharts-label-box.highcharts-tooltip-box')
    .then(($el) => {
      if ($el.length === 0) {
        cy.log('Hovering/tooltip issues for Aceleração RMS chart');
        throw new Error('Hovering/tooltip issues for Aceleração RMS chart');
      }
    });

    // Temperatura - mouse bouncing to trigger the tooltip  
    cy.get('rect.highcharts-background').eq(1).then(($rect) => {
      const width = parseFloat($rect.attr('width'));
      const height = parseFloat($rect.attr('height'));

      const centerX = width / 2;
      const centerY = height / 2;

      const $el = cy.wrap($rect);

      $el.realMouseMove(centerX, centerY);

      const moves = [
        { x: centerX + 5, y: centerY },
        { x: centerX + 5, y: centerY + 5 },
        { x: centerX, y: centerY + 5 },
        { x: centerX - 5, y: centerY },
        { x: centerX, y: centerY - 5 },
        { x: centerX, y: centerY }
      ];

      moves.forEach((pos) => {
        $el.realMouseMove(pos.x, pos.y);
      });
    });

    // Temperatura - checking tooltip
    cy.get('.highcharts-container').eq(1).find('path.highcharts-label-box.highcharts-tooltip-box')
    .then(($el) => {
      if ($el.length === 0) {
        cy.log('Hovering/tooltip issues for Temperatura chart');
        throw new Error('Hovering/tooltip issues for Aceleração RMS chart');
      }
    });

    // Velocidade RMS - mouse bouncing to trigger the tooltip  
    cy.get('rect.highcharts-background').eq(2).then(($rect) => {
      const width = parseFloat($rect.attr('width'));
      const height = parseFloat($rect.attr('height'));

      const centerX = width / 2;
      const centerY = height / 2;

      const $el = cy.wrap($rect);

      $el.realMouseMove(centerX, centerY);

      const moves = [
        { x: centerX + 5, y: centerY },
        { x: centerX + 5, y: centerY + 5 },
        { x: centerX, y: centerY + 5 },
        { x: centerX - 5, y: centerY },
        { x: centerX, y: centerY - 5 },
        { x: centerX, y: centerY }
      ];

      moves.forEach((pos) => {
        $el.realMouseMove(pos.x, pos.y);
      });
    });

    // Velocidade RMS -checking tooltip
    cy.get('.highcharts-container').eq(2).find('path.highcharts-label-box.highcharts-tooltip-box')
    .then(($el) => {
      if ($el.length === 0) {
        cy.log('Hovering/tooltip issues for Velocidade RMS chart');
        throw new Error('Hovering/tooltip issues for Aceleração RMS chart');
      }
    });
  })
})