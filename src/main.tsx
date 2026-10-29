
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { router } from './router'
import './index.css'
import { CartProvider } from './contexts/CartContext'

const queryClient = new QueryClient()

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </QueryClientProvider>
</StrictMode>,
  )
})
