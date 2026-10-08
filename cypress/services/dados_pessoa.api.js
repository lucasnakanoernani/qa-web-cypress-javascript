// Chame dentro de um teste/hook Cypress: gerarPessoa().then((pessoa) => { ... });
export function gerarPessoa() {
  return cy.request({
    method: 'POST',
    url: 'https://www.4devs.com.br/ferramentas_online.php',
    form: true,
    body: {
      acao: 'gerar_pessoa',
      sexo: 'I',
      idade: 'S',
      txt_qtde: '1',
    },
  }).then(({ body }) => {
    // O Cypress pode entregar JSON já convertido ou uma string,
    // dependendo do Content-Type enviado pelo servidor.
    let dados = body;
    if (typeof dados === 'string') {
      try {
        dados = JSON.parse(dados);
      } catch {
        throw new Error('4Devs: a resposta de pessoa não contém JSON válido.');
      }
    }

    const pessoa = Array.isArray(dados) ? dados[0] : null;
    if (!pessoa || typeof pessoa.nome !== 'string' || !pessoa.nome.trim()) {
      throw new Error('4Devs: a resposta não contém uma pessoa com nome.');
    }
    if (typeof pessoa.email !== 'string' || !pessoa.email.includes('@')) {
      throw new Error('4Devs: e-mail ausente ou inválido.');
    }

    const nascimento = String(pessoa.data_nasc ?? '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!nascimento) {
      throw new Error('4Devs: data_nasc deve estar no formato DD/MM/AAAA.');
    }
    const [, dia, mes, ano] = nascimento;
    const partesNome = pessoa.nome.trim().split(/\s+/);

    // Mantém os nomes das propriedades usados no seu projeto Playwright.
    return {
      nome: partesNome[0],
      sobrenome: partesNome.slice(1).join(' '),
      email: pessoa.email,
      CPF: pessoa.cpf,
      RG: pessoa.rg,
      sexo: pessoa.sexo,
      celular: pessoa.celular,
      dataNascimento: `${ano}-${mes}-${dia}`,
      CEP: pessoa.cep,
      numero: String(pessoa.numero ?? ''),
      endereco: pessoa.endereco,
    };
  });
}
