describe('Fluxo de Edição de Máquina', () => {
  let createdMachineId: string;

  // Dados Iniciais (Como a máquina nasce)
  const initialMachine = {
    name: 'Máquina Velha',
    type: 'Pump'
  };

  // Dados Finais (Como ela deve ficar após a edição)
  const updatedMachine = {
    name: 'Máquina Renomeada Pro',
    type: 'Fan'
  };

  beforeEach(() => {
    // Criar a máquina via API para garantir que tem o que editar
    cy.request('POST', 'http://localhost:3000/machines', initialMachine)
      .then((response) => {
        expect(response.status).to.eq(201);
        createdMachineId = response.body.id;
      });

    cy.visit('http://localhost:5173'); 
    cy.get('#email').type('admin@dynamox.net');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();
    cy.contains('DynaPredict'); 
  });

  it('Deve editar o nome e o tipo da máquina com sucesso', () => {
    cy.intercept('PUT', `**/machines/${createdMachineId}`).as('editRequest');

    //Encontrar a linha pelo ID e clicar no botão AZUL (Editar)
    cy.contains('tr', createdMachineId).within(() => {
      cy.get('button.MuiIconButton-colorPrimary').click();
    });


    // Verificar se o modal abriu com os dados antigos preenchidos
    cy.get('div[role="dialog"]').should('be.visible');
    
    // Editar o Nome
    // Seleciona o input que tem o valor antigo, limpa e digita o novo
    cy.get(`input[value="${initialMachine.name}"]`)
      .clear()
      .type(updatedMachine.name);

    cy.get('[role="dialog"]').within(() => {
      //  procurar pelo texto atual "Pump (Bomba)" que está visível no dropdown
      cy.get('.MuiSelect-select').click(); 
    });
    
    cy.get('li[data-value="Fan"]').click(); 

    // Salvar
    cy.get('[role="dialog"]').within(() => {
        cy.contains('button', 'Salvar').click();
    });

    // Esperar o servidor confirmar a edição
    cy.wait('@editRequest').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      // Validar se o payload enviado tinha os dados novos
      expect(interception.request.body).to.have.property('name', updatedMachine.name);
      expect(interception.request.body).to.have.property('type', updatedMachine.type);
    });

    // Validação Visual: A linha do ID deve mostrar o NOVO nome
    cy.contains('tr', createdMachineId).within(() => {
      cy.contains(updatedMachine.name).should('exist');
      cy.contains(initialMachine.name).should('not.exist'); // O nome velho deve sumir
      
      // Validar se o Chip mudou 
      cy.contains(updatedMachine.type).should('exist');
    });
  });
});