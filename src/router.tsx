
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  Link,
  useNavigate,
} from '@tanstack/react-router'

import Header from './components/Header'
import NFTCard from './components/NFTCard'
import { useQuery } from '@tanstack/react-query'
import { getNFTs } from './services/nftService'
import { useParams } from '@tanstack/react-router'
import { useCart } from './contexts/CartContext'
import { ethToWei, weiToEth } from './utils/eth'
import { useState } from 'react'
import { createOrder, type Order } from './services/checkoutService'

// Estrutura compartilhada entre as páginas
function RootLayout() {
  return (
    <div className="min-h-screen bg-[#17120f] text-white">
      <Header />
      <Outlet />
    </div>
  )
}

// Página inicial


function HomePage() {
  const {
    data: nfts = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['nfts'],
    queryFn: getNFTs,
  })
  
  console.log('NFTs recebidos:', nfts)
console.log('É um array?', Array.isArray(nfts))

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-5xl font-bold">
        Seja dono do futuro da arte digital
      </h1>

      <p className="mt-6 text-gray-400">
        Descubra, colecione e explore NFTs exclusivos.
      </p>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">
          Explore NFTs
        </h2>

        {isPending && (
          <p className="text-gray-400">
            Carregando NFTs...
          </p>
        )}

        {isError && (
          <div>
            <p className="text-red-400">
              Não foi possível carregar os NFTs.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded bg-orange-500 px-4 py-2 text-black"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isPending && !isError && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nfts.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                creator={nft.creator}
                price={nft.price}
                image={nft.image}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}



// Página de login (provisória)
function LoginPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">Entrar no Kurio</h1>
      <p className="mt-4 text-gray-400">
        Aqui construiremos o formulário de login.
      </p>
    </main>
  )
}

// Página do carrinho

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  
const [isCheckingOut, setIsCheckingOut] = useState(false)
const [checkoutError, setCheckoutError] = useState('')
const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

const [idempotencyKey] = useState(() => {
  const savedKey = sessionStorage.getItem('kurio-checkout-key')

  if (savedKey) return savedKey

  const newKey = crypto.randomUUID()
  sessionStorage.setItem('kurio-checkout-key', newKey)

  return newKey
})

async function handleCheckout() {
  if (isCheckingOut || cart.length === 0 || confirmedOrder) return

  setIsCheckingOut(true)
  setCheckoutError('')

  try {
  const order = await createOrder(cart, idempotencyKey)

  sessionStorage.setItem(
    'kurio-confirmed-order',
    JSON.stringify(order)
  )

  setConfirmedOrder(order)

  clearCart()

  sessionStorage.removeItem('kurio-checkout-key')

  await navigate({ to: '/confirmacao' })
} catch (error) {
  console.error('Erro ao finalizar compra:', error)
  setCheckoutError('Não foi possível finalizar a compra. Tente novamente.')
} finally {
    setIsCheckingOut(false)
  }
}


  const {
    data: nfts = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['nfts'],
    queryFn: getNFTs,
  })

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p>Carregando carrinho...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-red-400">
          Não foi possível carregar o carrinho.
        </p>
      </main>
    )
  }

  const cartNFTs = nfts.filter((nft) =>
    cart.includes(nft.id)
  )

  
const totalWei = cartNFTs.reduce(
  (total, nft) => total + ethToWei(nft.price),
  0n
)

const totalETH = weiToEth(totalWei)


  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        Meu carrinho
      </h1>

      {cartNFTs.length === 0 ? (
        <p className="mt-8 text-gray-400">
          Seu carrinho está vazio.
        </p>
      ) : (
        <>
          <div className="mt-10 space-y-6">
            {cartNFTs.map((nft) => (
              <article
                key={nft.id}
                className="flex items-center gap-6 rounded-xl border border-white/10 bg-[#241b16] p-5"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold">
                    {nft.name}
                  </h2>

                  <p className="mt-2 text-orange-400">
                    {nft.price} ETH
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(nft.id)}
                  className="rounded-lg border border-red-500 px-4 py-2 text-red-400 hover:bg-red-500/10"
                >
                  Remover
                </button>
              </article>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span className="text-orange-400">
                {totalETH} ETH
              </span>
            </div>

            
{checkoutError && (
  <p role="alert" className="mt-6 text-red-400">
    {checkoutError}
  </p>
)}

{confirmedOrder && (
  <div className="mt-6 rounded-lg border border-green-500/40 p-5">
    <h2 className="text-xl font-bold text-green-400">
      Pedido confirmado!
    </h2>

    <p className="mt-2 text-gray-300">
      Pedido: {confirmedOrder.id}
    </p>

    <p className="mt-2 text-gray-300">
      Total: {confirmedOrder.totalEth} ETH
    </p>
  </div>
)}

<button
  type="button"
  onClick={handleCheckout}
  disabled={isCheckingOut || confirmedOrder !== null}
  className="mt-8 rounded-lg bg-orange-500 px-8 py-4 font-bold text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isCheckingOut
    ? 'Processando compra...'
    : confirmedOrder
      ? 'Compra confirmada'
      : 'Finalizar compra'}
</button>

          </div>
        </>
      )}
    </main>
  )
}


function ConfirmationPage() {
  const savedOrder = sessionStorage.getItem('kurio-confirmed-order')

  if (!savedOrder) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-white">
        <h1 className="text-3xl font-bold">Pedido não encontrado</h1>
        <p className="mt-4 text-gray-400">
          Nenhuma compra confirmada foi encontrada nesta sessão.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-bold text-black"
        >
          Voltar ao início
        </Link>
      </main>
    )
  }

  const order = JSON.parse(savedOrder) as {
    id: string
    totalEth: string
    status: string
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-white">
      <div className="rounded-xl border border-green-500/30 bg-zinc-900 p-8">
        <h1 className="text-3xl font-bold text-green-400">
          Pedido confirmado!
        </h1>

        <p className="mt-4 text-gray-300">
          Sua compra foi registrada com sucesso.
        </p>

        <p className="mt-6 break-all text-gray-300">
          <strong>Número do pedido:</strong> {order.id}
        </p>

        <p className="mt-3 text-xl font-bold">
          Total: {order.totalEth} ETH
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-bold text-black hover:bg-orange-400"
        >
          Voltar ao mercado
        </Link>
      </div>
    </main>
  )
}


function NFTDetailsPage() {
  const { nftId } = useParams({
    from: '/nft/$nftId',
  })
  const { addToCart, cart } = useCart()

  const {
    data: nfts = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ['nfts'],
    queryFn: getNFTs,
  })

  if (isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p>Carregando NFT...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-red-400">
          Erro ao carregar o NFT.
        </p>
      </main>
    )
  }

  const nft = nfts.find((item) => item.id === nftId)

  if (!nft) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          NFT não encontrado
        </h1>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2">
      <img
        src={nft.image}
        alt={nft.name}
        className="w-full rounded-xl object-cover"
      />

      <div>
        <p className="text-orange-400">
          {nft.creator}
        </p>

        <h1 className="mt-4 text-5xl font-bold">
          {nft.name}
        </h1>

        <p className="mt-8 text-gray-400">
          Preço atual
        </p>

        <p className="mt-2 text-3xl font-bold text-orange-400">
          {nft.price} ETH
        </p>

        
<button
  type="button"
  onClick={() => addToCart(nft.id)}
  disabled={cart.includes(nft.id)}
  className="mt-10 rounded-lg bg-orange-500 px-8 py-4 font-bold text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {cart.includes(nft.id)
    ? 'Adicionado ao carrinho'
    : 'Adicionar ao carrinho'}
</button>

      </div>
    </main>
  )
}



// Rota principal
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Rota da página inicial
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Rota da página de login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// Rota do carrinho
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/carrinho',
  component: CartPage,
})

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmacao',
  component: ConfirmationPage,
})

const nftDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NFTDetailsPage,
})


// Agrupamento das rotas
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  cartRoute,
  nftDetailsRoute,
  confirmationRoute,
])

// Criação do roteador
export const router = createRouter({
  routeTree,
})

// Registro dos tipos para o TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
