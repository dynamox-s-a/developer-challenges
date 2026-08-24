import './commands';

afterEach(() => {
	cy.get('@consoleError').should('not.have.been.called');
});
