describe('Web GUI Test - Header', () => {
  it('Gets, types and asserts', () => {
    cy.visit('https://frontend-test-for-qa.vercel.app/')

    //  Checking header: 
    // 1. Header items - assert that 'Máquina' and 'Ponto' are present 
    // on the web page without any 'null' values
    cy.contains('.MuiTypography-caption', 'Máquina');
    cy.contains('.MuiTypography-caption', 'Ponto');
    cy.get('.MuiTypography-caption').then($Object => {
      const text = $Object.text();

    if (!text.includes('Máquina') || !text.includes('Ponto') || text.toLowerCase().includes('null')) {
      throw new Error('Header issues');
    }
    //cy.log('Text: ' + $Object.text());
    });

    // 2. Máquina ID:
    cy.contains('.MuiTypography-caption', 'Máquina').invoke('text').then(text => {
      const num = parseInt(text.replace('Máquina', '').trim(), 10);
      expect(Number.isInteger(num), 'Machine ID is OK').to.be.true;
      //cy.log(text);
      //cy.log(num);
    });

    // 3. Ponto ID:
    cy.contains('.MuiTypography-caption', 'Ponto').invoke('text').then(text => {
      const num = parseInt(text.replace('Ponto', '').trim(), 10);
      expect(Number.isInteger(num), 'Ponto ID is OK').to.be.true;
      //cy.log(text);
      //cy.log(num);
    });
  })
})