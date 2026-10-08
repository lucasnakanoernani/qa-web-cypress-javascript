import homePage from '../../pages/home.page';

describe('Teste smoke - página inicial', () => {
  it('deve abrir o site e exibir o acesso ao cadastro e login', () => {
    homePage.abrir();

    cy.location('pathname').should('eq', '/');
    homePage.acessoCadastroLogin
      .should('be.visible')
      .and('have.attr', 'href', '/login');
  });
});
