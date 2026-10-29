
# Kurio — NFT Marketplace

Desafio técnico Frontend desenvolvido com React, TypeScript e Vite.

## Links

- Aplicação: https://kurio-frontend-challenge-six.vercel.app
- Repositório: https://github.com/DanielAraujoDev-ai/kurio-frontend-challenge

## Tecnologias implementadas

- React e TypeScript
- Vite
- TanStack Router
- TanStack Query
- Axios
- Tailwind CSS
- Mock Service Worker (MSW)
- Playwright
- Git e Vercel

## Funcionalidades implementadas

- Catálogo com três NFTs fictícios
- Página de detalhes de cada NFT
- Carrinho com adição e remoção de itens
- Persistência do carrinho no localStorage
- Cálculo de valores ETH usando bigint e wei
- Checkout simulado por API REST
- Chave de idempotência no checkout
- Confirmação de pedido com identificador
- Limpeza do carrinho após confirmação
- Rotas com acesso direto e refresh na Vercel
- Teste E2E do fluxo de compra

## Executar localmente

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

Abrir http://localhost:5173

Os mocks são iniciados automaticamente pelo MSW. Não é necessário conectar a um backend privado.

## Comandos

```bash
npm run dev
npm run build
npm run preview
npx tsc -b
npx playwright install chromium
npx playwright test
```

O teste Playwright pressupõe que o servidor Vite esteja disponível em http://localhost:5173.

## Variáveis de ambiente

Nenhuma variável de ambiente é necessária para executar a implementação atual.

## API REST simulada

### GET /api/nfts

Retorna o catálogo de NFTs.

### POST /api/checkout

Cabeçalho obrigatório:

Idempotency-Key: identificador único

Corpo:

```json
{
  "nftIds": ["1"]
}
```

Resposta de sucesso (HTTP 201):

```json
{
  "id": "uuid-do-pedido",
  "nftIds": ["1"],
  "totalEth": "0.25",
  "status": "confirmed"
}
```

Erros implementados:

- 400: chave de idempotência ausente ou carrinho inválido
- 404: NFT inexistente

Repetir uma chave já processada retorna o pedido armazenado na memória do mock.

## Persistência

- Carrinho: localStorage, chave `kurio-cart`
- Chave de checkout: sessionStorage, chave `kurio-checkout-key`
- Pedido confirmado: sessionStorage, chave `kurio-confirmed-order`

## Testes

O teste `tests/checkout.spec.ts` valida o fluxo de seleção do NFT, adição ao carrinho, checkout, confirmação e limpeza do carrinho.

## Limitações conhecidas

Esta é uma implementação parcial do desafio técnico.

Não foram concluídos autenticação, cadastro, perfil, carteiras, favoritos, filtros, paginação, integração Socket.IO, cenários configuráveis de falha, componentes shadcn/ui e auditoria Lighthouse.

O checkout utiliza um backend simulado com MSW, sem transações reais ou integração blockchain. Os pedidos são armazenados temporariamente na memória do mock.

Os três NFTs utilizam uma imagem ilustrativa compartilhada.

Consulte ARCHITECTURE.md para decisões técnicas, limitações e desvios do escopo.
