describe('Fluxo de Usuário Completo', () => {
  // Variável para guardar o ID que o servidor vai criar
  let createdMachineId: string;

  // Dados da máquina de teste
  const machineToDelete = {
    name: 'Maquina Teste',
    type: 'Fan'
  };

  beforeEach(() => {
    // 1. CRIAR via API (Backdoor) para garantir que existe
    cy.request('POST', 'http://localhost:3000/machines', machineToDelete)
      .then((response) => {
        expect(response.status).to.eq(201); // Garante que criou
        createdMachineId = response.body.id; 
      });

    //Acessar o sistema
    cy.visit('http://localhost:5173'); 
  });

  it('Deve logar e deletar a máquina buscando pelo ID único', () => {

    cy.get('#email').type('admin@dynamox.net');
    cy.get('#password').type('admin');
    cy.get('button[type="submit"]').click();

    // Validação visual que o login funcionou
    cy.contains('DynaPredict'); 


    // Interceptar a rota usando o ID capturado (Template String)
    // Isso garante que o teste só passa se o front chamar a URL com o ID certo
    cy.intercept('DELETE', `**/machines/${createdMachineId}`).as('deleteRequest');

    // Encontrar a linha (TR) que contém o ID na tela
    // Ao invés do nome, procura pelo ID "uuid-1234..."
    cy.contains('tr', createdMachineId).within(() => {
      // Clica no botão de erro (lixeira) DESSA linha
      cy.get('button.MuiIconButton-colorError').click();
    });

    // Confirmar que a requisição saiu com sucesso (200)
    cy.wait('@deleteRequest').its('response.statusCode').should('eq', 200);

    // Prova Real: O ID não pode mais estar na tela
    cy.contains('tr', createdMachineId).should('not.exist');
  });
});