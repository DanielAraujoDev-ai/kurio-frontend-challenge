
import { http, HttpResponse } from 'msw'
import { nfts } from '../data/nfts'
import { ethToWei, weiToEth } from '../utils/eth'

type Order = {
  id: string
  nftIds: string[]
  totalEth: string
  status: 'confirmed'
}

const orders = new Map<string, Order>()

export const handlers = [
  // Buscar NFTs
  http.get('/api/nfts', () => {
    return HttpResponse.json(nfts)
  }),

  // Finalizar compra
  http.post('/api/checkout', async ({ request }) => {
    const idempotencyKey = request.headers.get('Idempotency-Key')

    if (!idempotencyKey) {
      return HttpResponse.json(
        { message: 'Chave de idempotência obrigatória' },
        { status: 400 }
      )
    }

    const existingOrder = orders.get(idempotencyKey)

    if (existingOrder) {
      return HttpResponse.json(existingOrder)
    }

    const body = await request.json() as {
      nftIds?: string[]
    }

    const nftIds = body.nftIds

    if (
      !Array.isArray(nftIds) ||
      nftIds.length === 0 ||
      nftIds.some((id) => typeof id !== 'string') ||
      new Set(nftIds).size !== nftIds.length
    ) {
      return HttpResponse.json(
        { message: 'Carrinho inválido' },
        { status: 400 }
      )
    }

    const selectedNFTs = nftIds.map((id) =>
      nfts.find((nft) => nft.id === id)
    )

    if (selectedNFTs.some((nft) => !nft)) {
      return HttpResponse.json(
        { message: 'NFT não encontrado' },
        { status: 404 }
      )
    }

    const totalWei = selectedNFTs.reduce(
      (total, nft) => total + ethToWei(nft!.price),
      0n
    )

    const order: Order = {
      id: crypto.randomUUID(),
      nftIds,
      totalEth: weiToEth(totalWei),
      status: 'confirmed',
    }

    orders.set(idempotencyKey, order)

    return HttpResponse.json(order, { status: 201 })
  }),
]
