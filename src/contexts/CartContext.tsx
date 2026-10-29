
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

type CartContextType = {
  cart: string[]
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'kurio-cart'

function readCart(): string[] {
  try {
    const saved = localStorage.getItem(CART_KEY)
    const parsed: unknown = saved ? JSON.parse(saved) : []

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode
}) {
  const [cart, setCart] = useState<string[]>(readCart)

  function updateCart(updated: string[]) {
    setCart(updated)
    localStorage.setItem(CART_KEY, JSON.stringify(updated))
  }

  function addToCart(id: string) {
    if (!cart.includes(id)) {
      updateCart([...cart, id])
    }
  }

  function removeFromCart(id: string) {
    updateCart(cart.filter((item) => item !== id))
  }

  function clearCart() {
  updateCart([])
}

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }

  return context
}
