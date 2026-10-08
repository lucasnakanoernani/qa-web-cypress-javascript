class CadastroPage {
  get campoNome() {
    return cy.get('[data-qa="signup-name"]');
  }

  get campoEmail() {
    return cy.get('[data-qa="signup-email"]');
  }

  get botaoSignup() {
    return cy.get('[data-qa="signup-button"]');
  }

  iniciarCadastro(nome, email) {
    this.campoNome.type(nome);
    this.campoEmail.type(email);
    this.botaoSignup.click();
  }

  preencherDadosConta(pessoa) {
    const [ano, mes, dia] = pessoa.dataNascimento.split('-')

    cy.get('#id_gender1').check();
    cy.get('[data-qa="password"]').type('Teste123!', {
        log: false,
    });
    cy.get('[data-qa="days"]').select(String(Number(dia)));
    cy.get('[data-qa="months"]').select(String(Number(mes)));
    cy.get('[data-qa="years"]').select(ano);
    cy.get('[name="newsletter"]').check();
    cy.get('[name="optin"]').check();
    cy.get('[data-qa="first_name"]').type(pessoa.nome);
    cy.get('[data-qa="last_name"]').type(pessoa.sobrenome);
    cy.get('[data-qa="company"]').type('Empresa de Teste');
    cy.get('[data-qa="address"]').type(pessoa.endereco);
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Estado de Teste');
    cy.get('[data-qa="city"]').type('Cidade de Teste');
    cy.get('[data-qa="zipcode"]').type(String(pessoa.CEP));
    cy.get('[data-qa="mobile_number"]').type(String(pessoa.celular));
  }

  criarConta() {
    cy.get('[data-qa="create-account"]').click();
  }

  continuar() {
    cy.get('[data-qa="continue-button"]').click();
  }
}

export default new CadastroPage();