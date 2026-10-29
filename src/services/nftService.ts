
import axios from 'axios'
import type { NFT } from '../data/nfts'

export async function getNFTs(): Promise<NFT[]> {
  const response = await axios.get<NFT[]>('/api/nfts')
  return response.data
}
