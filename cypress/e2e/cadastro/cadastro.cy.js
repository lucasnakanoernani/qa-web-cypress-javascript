import homePage from '../../pages/home.page';
import cadastroPage from '../../pages/cadastro.page';
import { gerarPessoa } from '../../services/dados_pessoa.api';

describe('Cadastro de usuário', () => {
  beforeEach(() => {
    homePage.abrir();
    homePage.acessoCadastroLogin.click();

    cy.location('pathname').should('eq', '/login');
  });

  it('deve apresentar o formulário inicial de cadastro', () => {
    cy.contains('New User Signup!').should('be.visible');

    cadastroPage.campoNome.should('be.visible');
    cadastroPage.campoEmail.should('be.visible');
    cadastroPage.botaoSignup.should('be.enabled');
  });

  it('deve cadastrar um usuário com dados gerados pela API', () => {
    return gerarPessoa().then((pessoa) => {
      const nomeCompleto =
        `${pessoa.nome} ${pessoa.sobrenome}`.trim();

      cadastroPage.iniciarCadastro(nomeCompleto, pessoa.email);

      cy.location('pathname').should('eq', '/signup');

      cy.contains('Enter Account Information', {
        matchCase: false,
      }).should('be.visible');

      cy.get('[data-qa="name"]')
        .should('have.value', nomeCompleto);

      cy.get('[data-qa="email"]')
        .should('have.value', pessoa.email);

      cadastroPage.preencherDadosConta(pessoa);
      cadastroPage.criarConta();

      cy.contains('Account Created!', {
        matchCase: false,
      }).should('be.visible');

      cadastroPage.continuar();
    });
  });
});