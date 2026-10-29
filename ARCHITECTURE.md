
# Arquitetura — Kurio

## Visão geral

Aplicação SPA construída com React, TypeScript e Vite, utilizando TanStack Router para navegação e TanStack Query para consultas de dados.

O frontend utiliza Axios para requisições REST interceptadas pelo Mock Service Worker (MSW). O projeto não depende de um backend privado.

## Organização

- src/components: componentes reutilizáveis
- src/contexts: estado compartilhado do carrinho
- src/data: catálogo fictício
- src/mocks: handlers REST e inicialização do MSW
- src/services: comunicação HTTP
- src/utils: conversão de ETH para wei
- src/router.tsx: páginas e rotas
- tests: testes automatizados E2E

## API e contratos

GET /api/nfts retorna a lista de NFTs.

POST /api/checkout recebe nftIds e o cabeçalho Idempotency-Key. Retorna um pedido confirmado ou um erro de validação.

Os pedidos são mantidos em um Map na memória do MSW. A implementação não representa um processamento financeiro real.

## Sessão e autenticação

Autenticação e controle de sessão de usuário não foram implementados.

O carrinho é persistido em localStorage. O identificador de tentativa de checkout e o último pedido confirmado são armazenados em sessionStorage.

## Estado do carrinho

O CartProvider centraliza as operações de adicionar, remover e limpar NFTs.

O carrinho armazena identificadores de NFTs. Os dados dos produtos são consultados no catálogo.

## Precisão monetária

Os valores ETH são convertidos para wei utilizando bigint, com 18 casas decimais.

A soma ocorre em unidades inteiras para evitar imprecisões de ponto flutuante.

## Cache

TanStack Query gerencia a consulta do catálogo com a chave ['nfts'].

Não foi implementada persistência do cache entre sessões.

## Tempo real

Socket.IO e eventos de atualização em tempo real não foram implementados.

Não existe reconciliação entre respostas REST e eventos Socket.IO nesta versão.

## Idempotência

O checkout utiliza uma chave de idempotência enviada no cabeçalho HTTP.

O mock reutiliza pedidos previamente associados à mesma chave, mas não implementa armazenamento persistente, proteção contra requisições concorrentes ou verificação de equivalência entre payloads.

## Tratamento de falhas

A interface apresenta mensagens para erros de carregamento e falhas no checkout.

Não há seletor de cenários de falha, fixtures configuráveis ou mecanismo de reset de cenários.

## UX e desvios do Figma

A implementação priorizou o fluxo funcional de catálogo, detalhes, carrinho e confirmação.

As páginas restantes, a responsividade completa e a fidelidade visual integral ao Figma não foram concluídas.

O catálogo possui apenas três itens fictícios com imagem compartilhada.

## Deploy

A aplicação é publicada na Vercel.

O arquivo vercel.json configura o fallback para index.html, permitindo atualizar rotas internas da SPA.

O MSW intercepta requisições no navegador, sem necessidade de backend externo.

## Testes e auditoria

Existe um teste Playwright para o fluxo completo de compra.

A compilação de produção foi validada com npm run build.

Não foram implementados testes abrangentes de autenticação, filtros, tempo real ou auditoria Lighthouse.
