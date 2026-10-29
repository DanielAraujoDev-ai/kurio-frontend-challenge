
import axios from 'axios'

export type Order = {
  id: string
  nftIds: string[]
  totalEth: string
  status: 'confirmed'
}

export async function createOrder(
  nftIds: string[],
  idempotencyKey: string
): Promise<Order> {
  const response = await axios.post<Order>(
    '/api/checkout',
    { nftIds },
    {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    }
  )

  return response.data
}
