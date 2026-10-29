
import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-[#17120F] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">

        <Link to="/" className="text-2xl font-black tracking-widest">
          KURIO<span className="text-orange-500">.</span>
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-orange-500">
            Início
          </Link>
          <a href="/mercado" className="hover:text-orange-500">
            Mercado
          </a>
          <a href="/criadores" className="hover:text-orange-500">
            Criadores
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Buscar NFTs..."
            aria-label="Buscar NFTs"
            className="w-44 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-orange-500"
          />

          <Link to="/carrinho" className="text-sm hover:text-orange-500">
            Carrinho
          </Link>

          <Link
            to="/login"
            className="rounded-md bg-orange-500 px-5 py-2 text-sm font-bold text-black hover:bg-orange-400"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  )
}
