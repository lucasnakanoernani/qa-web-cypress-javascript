class HomePage {
  abrir() {
    return cy.visit('/');
  }

  get acessoCadastroLogin() {
    return cy.contains('a', 'Signup / Login');
  }
}

export default new HomePage();
