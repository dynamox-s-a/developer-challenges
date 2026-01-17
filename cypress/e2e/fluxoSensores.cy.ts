describe('Fluxo de Gerenciamento de Sensores', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');

    cy.get('#email').type('admin@dynamox.net');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();

    // Navega para a tela de sensores
    cy.contains('button', 'Sensores').click();
    cy.url().should('include', '/sensors');
  });

  it('Deve BLOQUEAR a seleção de sensores proibidos para máquinas Pump', () => {
    // abre o Modal
    cy.contains('button', 'Novo Ponto').click();

    // Preenche o Nome
    cy.contains('label', 'Nome do Ponto').parent().find('input').type('Teste Bloqueio Pump');

    // Seleciona uma Máquina do tipo "Pump"
    // Deve existir uma máquina "Pump" no db.json, ex: "Bomba de Ar")
    cy.contains('label', 'Selecione a Máquina').parent().click();
    // O Cypress procura na lista suspensa uma opção que contenha "Pump"
    cy.get('li').contains('Pump').click(); 

    // Tenta selecionar o Sensor Proibido
    cy.contains('label', 'Modelo do Sensor').parent().click();
    
    // A opção TcAg deve estar desabilitada ou não clicável
    cy.get('li[data-value="TcAg"]').should('have.attr', 'aria-disabled', 'true');
    
    // Clica fora para fechar o select
    cy.get('body').click(0, 0);

    // Deve aparecer o alerta amarelo de aviso
    cy.contains('Máquinas Pump só aceitam HF+').should('be.visible');
  });

  it('Deve PERMITIR criar um sensor válido (HF+) em máquina Pump', () => {
    // Abre o Modal
    cy.contains('button', 'Novo Ponto').click();

    // Preenche os dados válidos
    cy.contains('label', 'Nome do Ponto').parent().find('input').type('Sensor de Pressão 01');

    // Seleciona Pump
    cy.contains('label', 'Selecione a Máquina').parent().click();
    cy.get('li').contains('Pump').first().click(); 

    // Seleciona HF+ (Permitido)
    cy.contains('label', 'Modelo do Sensor').parent().click();
    cy.get('li[data-value="HF+"]').click();

    cy.contains('button', 'Salvar').click();

    // Clica no seletor de paginação
    cy.get('.MuiTablePagination-select').first().click(); 
    
    // Clica na opção "20" na lista que abriu
    cy.get('li[data-value="20"]').click();

    // Verifica se apareceu na tabela
    cy.contains('Sensor de Pressão 01').should('be.visible');
    cy.contains('HF+').should('be.visible');
  });
});