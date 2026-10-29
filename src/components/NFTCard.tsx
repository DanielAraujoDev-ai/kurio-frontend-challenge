
import { Link } from '@tanstack/react-router'

type NFTCardProps = {
  id: string
  name: string
  creator: string
  price: string
  image: string
}

export default function NFTCard({
  id,
  name,
  creator,
  price,
  image,
}: NFTCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-[#241b16]">
      <Link
        to="/nft/$nftId"
        params={{ nftId: id }}
        className="block"
      >
        <img
          src={image}
          alt={name}
          className="aspect-square w-full object-cover"
        />

        <div className="p-5">
          <p className="text-sm text-orange-400">{creator}</p>

          <h3 className="mt-2 text-xl font-bold">
            {name}
          </h3>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-gray-400">Preço</span>

            <span className="font-bold text-orange-400">
              {price} ETH
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
