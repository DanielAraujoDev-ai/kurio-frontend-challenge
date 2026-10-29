
import hero from '../assets/hero.png'

export type NFT = {
  id: string
  name: string
  creator: string
  price: string
  image: string
}

export const nfts: NFT[] = [
  {
    id: '1',
    name: 'Golden Ape',
    creator: 'Kurio Creator',
    price: '0.25',
    image: hero,
  },
  {
    id: '2',
    name: 'Cyber Ape',
    creator: 'Digital Studio',
    price: '0.48',
    image: hero,
  },
  {
    id: '3',
    name: 'Future Ape',
    creator: 'Meta Artist',
    price: '0.32',
    image: hero,
  },
]
