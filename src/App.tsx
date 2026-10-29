import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-[#17120f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-5xl font-bold">
          Seja dono do futuro da arte digital
        </h1>

        <p className="mt-6 text-gray-400">
          Descubra, colecione e explore NFTs exclusivos.
        </p>
      </main>
    </div>
  )
}

export default App