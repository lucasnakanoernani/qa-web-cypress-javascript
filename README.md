# Automação web com Cypress e JavaScript

Projeto de automação de testes no [Automation Exercise](https://automationexercise.com/), desenvolvido para estudos e portfólio de QA.

A implementação reúne um smoke da página inicial e um fluxo de cadastro de usuário com dados gerados pelo 4Devs. Os testes utilizam JavaScript, Page Objects e validações funcionais com Cypress.

## Tecnologias e práticas

- **Cypress e JavaScript:** execução dos testes de interface e requisições HTTP.
- **Page Objects:** organização dos seletores e das ações de cada página.
- **Integração com o 4Devs:** geração de massa de dados para os testes.
- **Validações funcionais:** conferência de elementos, navegação, dados e resultado do cadastro.
- **Git e npm:** versionamento do código e gerenciamento de dependências.

## Escopo atual

| Área | Implementação |
| --- | --- |
| Home | Smoke de abertura da página inicial e verificação do acesso a cadastro/login |
| Formulário inicial | Verificação dos campos de nome e e-mail e do botão Signup |
| Cadastro | Preenchimento dos dados da conta e endereço com massa da API e valores fixos de teste |
| Dados transportados | Conferência de nome e e-mail após avançar para os dados da conta |
| Resultado e limpeza | Fluxo de confirmação da criação, verificação do usuário conectado e exclusão da conta de teste |
| Serviço de pessoa | Requisição ao 4Devs e transformação dos dados para uso no cadastro |
| Serviço de cartão | Gerador disponível para uso futuro; ainda sem cenário de pagamento implementado |

O fluxo de cadastro utiliza a sessão aberta após a criação da conta. Isso não representa um cenário independente de login com e-mail e senha.

Este README descreve o escopo do projeto, sem declarar uma quantidade de execuções aprovadas. Os resultados devem ser consultados no relatório de cada execução do Cypress.

## Organização do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `cypress/e2e/smoke/home.cy.js` | Smoke da página inicial |
| `cypress/e2e/cadastro/cadastro.cy.js` | Cenários do formulário inicial e cadastro de usuário |
| `cypress/pages/home.page.js` | Seletores e ações da home |
| `cypress/pages/cadastro.page.js` | Seletores e ações de cadastro, continuação e exclusão da conta |
| `cypress/services/dados_pessoa.api.js` | Geração e tratamento dos dados de pessoa |
| `cypress/services/dados_cartao.api.js` | Geração e tratamento dos dados de cartão |
| `cypress/fixtures/` | Espaço para massas estáticas; o cadastro obtém a pessoa pelo serviço de API |
| `cypress/support/commands.js` | Arquivo destinado a comandos compartilhados |
| `cypress/support/e2e.js` | Inicialização comum dos testes |
| `cypress/screenshots/` | Capturas geradas nas execuções; não devem ser versionadas |
| `cypress.config.js` | URL base e configurações do Cypress |
| `jsconfig.json` | Configuração do projeto JavaScript para o editor |
| `package.json` | Dependências e scripts de execução |
| `package-lock.json` | Registro das versões instaladas das dependências |
| `.nvmrc` | Versão de Node.js indicada pelo projeto |
| `.gitignore` | Exclusões de arquivos locais e gerados |
| `.editorconfig` | Padronização de edição dos arquivos |

As ações de interface ficam nos Page Objects. Os specs organizam a sequência dos cenários e as validações de resultado. Os serviços concentram as requisições usadas para gerar massa.

## Pré-requisitos

- Node.js na versão indicada em `.nvmrc` — o ambiente inicial foi preparado com Node.js 24.
- npm, incluído na instalação do Node.js.
- Acesso à internet para instalar as dependências e acessar Automation Exercise e 4Devs.
- Chrome instalado caso queira executar o script `test:chrome`. Também é possível usar o Electron incluído no Cypress.

Os comandos abaixo podem ser executados no PowerShell do Windows. Este projeto testa uma aplicação web e não depende de emulador Android ou Appium.

## Instalação

Baixe ou clone o projeto, abra sua pasta no VS Code e execute no terminal, no diretório que contém `package.json`:

```powershell
npm ci
npx cypress install
```

O segundo comando garante a instalação do aplicativo Cypress, caso ela ainda não tenha sido concluída.

Para abrir a interface:

```powershell
npm run cy:open
```

Selecione **E2E Testing**, escolha um navegador e execute `home.cy.js` ou `cadastro.cy.js`.

## Comandos de execução

| Comando | Finalidade |
| --- | --- |
| `npm run cy:open` | Abrir a interface do Cypress |
| `npm run test:smoke` | Executar o smoke pelo terminal |
| `npm test` | Executar todos os specs configurados |
| `npm run test:chrome` | Executar os testes no Chrome instalado |
| `npm test -- --spec "cypress/e2e/cadastro/cadastro.cy.js"` | Executar somente os testes de cadastro |

## Integração com a API

Os serviços enviam requisições ao endpoint do 4Devs por meio de `cy.request()`:

```text
https://www.4devs.com.br/ferramentas_online.php
```

O gerador de pessoa retorna dados como nome, sobrenome, e-mail, data de nascimento, endereço, CEP e celular. O teste acessa esses dados dentro de `.then()`:

```javascript
import { gerarPessoa } from '../../services/dados_pessoa.api';

// Dentro de um teste ou hook do Cypress:
gerarPessoa().then((pessoa) => {
  const nomeCompleto = `${pessoa.nome} ${pessoa.sobrenome}`.trim();

  // Use nomeCompleto e as demais propriedades nas ações da página.
});
```

O caminho do exemplo considera um spec dentro de `cypress/e2e/cadastro/`.

- A integração não exige Playwright ou Axios.
- O e-mail é obtido da API e não tem garantia de exclusividade nem de caixa de entrada acessível.
- A data de nascimento é tratada para preencher os selects de dia, mês e ano.
- Alguns campos, como empresa, país, estado e cidade, usam valores fixos de demonstração. O cenário atual não valida consistência geográfica do endereço.
- O gerador de cartão está preparado para uma etapa futura. Sua presença não representa cobertura de checkout ou pagamento.

## Validações e limpeza

O cenário completo de cadastro preenche os dados, envia o formulário e verifica a confirmação de criação da conta. Depois de continuar, confere o nome do usuário conectado e exclui a conta criada.

A exclusão ao final limpa os dados quando o fluxo chega a essa etapa. Se a execução falhar antes, uma conta pode permanecer no site. Uma limpeza independente por API é uma melhoria futura.

Os testes não devem depender de uma conta criada por outro spec nem da ordem de execução dos arquivos.

## Evidências e versionamento

Na execução pelo terminal, o Cypress pode gerar capturas automáticas de falhas em `cypress/screenshots/`, conforme a configuração do projeto. A gravação de vídeo está desativada na configuração inicial.

Mantenha fora do Git:

```gitignore
node_modules/
cypress/screenshots/
cypress/videos/
cypress/downloads/
.env
.env.*
!.env.example
cypress.env.json
*.log
```

Versione o código dos testes, os Page Objects, os serviços, as configurações e o `package-lock.json`. Não publique credenciais, dados de clientes ou arquivos de projetos empresariais.

## Próximas etapas

- Implementar cenários independentes de login válido e inválido.
- Cobrir validações negativas do cadastro, como e-mail já cadastrado.
- Evoluir a preparação e a limpeza de contas via API.
- Automatizar produtos, carrinho e checkout.
- Usar o gerador de cartão no formulário de pagamento de demonstração.
- Configurar execução automatizada em CI.

Esses itens são planejamento e não fazem parte da cobertura atual.

## Referências

- [Automation Exercise](https://automationexercise.com/)
- [Cenários de teste do site](https://automationexercise.com/test_cases)
- [APIs de contas do Automation Exercise](https://automationexercise.com/api_list)
- [4Devs](https://www.4devs.com.br/)
- [Documentação do Cypress](https://docs.cypress.io/)
- [Requisições com cy.request()](https://docs.cypress.io/api/commands/request)

O Automation Exercise e o 4Devs são serviços externos. Indisponibilidade, mudanças de interface, anúncios ou alterações nas respostas podem afetar os testes. Investigue a causa da falha antes de alterar seletores ou adicionar tratamentos de exceção.
