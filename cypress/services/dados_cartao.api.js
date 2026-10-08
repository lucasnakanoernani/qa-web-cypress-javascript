// Massa para formulários de demonstração. Não representa um cartão de pagamento real.
export function gerarCartao() {
  return cy.request({
    method: 'POST',
    url: 'https://www.4devs.com.br/ferramentas_online.php',
    form: true,
    body: {
      acao: 'gerar_cc',
      pontuacao: 'S',
      bandeira: 'master',
    },
  }).then(({ body }) => {
    if (typeof body !== 'string') {
      throw new Error('4Devs: a resposta de cartão não contém HTML.');
    }

    // Lê o HTML sem inserir os elementos na página que está sendo testada.
    const documento = new DOMParser().parseFromString(body, 'text/html');
    const lerCampo = (id) => {
      const elemento = documento.getElementById(id);
      const valor = (elemento?.value || elemento?.textContent || '').trim();
      if (!valor) {
        throw new Error(`4Devs: não foi possível capturar ${id}.`);
      }
      return valor;
    };

    const numero = lerCampo('cartao_numero').replace(/[\s.-]/g, '');
    const validade = lerCampo('data_validade');
    const cvv = lerCampo('codigo_seguranca');

    // Aceita também MM/AAAA e MM/AA.
    const partes = validade.split('/').map((parte) => parte.trim());
    if (![2, 3].includes(partes.length)) {
      throw new Error('4Devs: formato de validade do cartão inesperado.');
    }
    const mes = partes[partes.length - 2];
    let ano = partes[partes.length - 1];
    if (!/^\d{1,2}$/.test(mes) || Number(mes) < 1 || Number(mes) > 12 ||
        !/^(\d{2}|\d{4})$/.test(ano)) {
      throw new Error('4Devs: validade do cartão inválida.');
    }
    if (ano.length === 2) ano = `20${ano}`;
    if (!/^\d{13,19}$/.test(numero) || !/^\d{3,4}$/.test(cvv)) {
      throw new Error('4Devs: número do cartão ou CVV em formato inesperado.');
    }

    return {
      numero,
      data: `${mes.padStart(2, '0')}/${ano}`,
      cvv,
      nome: 'Lucas Teste',
    };
  });
}
