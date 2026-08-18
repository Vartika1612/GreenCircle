import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)   // { userId, name, email, role, location, token }
  const [cart, setCart]   = useState([])     // [{ product, quantity }]
  const [ready, setReady] = useState(false)  // true once localStorage is loaded

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gc_user')
      const storedCart = localStorage.getItem('gc_cart')
      if (stored) setUser(JSON.parse(stored))
      if (storedCart) setCart(JSON.parse(storedCart))
    } catch { /* ignore */ }
    setReady(true)
  }, [])

  // ── Auth ──────────────────────────────────────────────────────────────────

  function login(userData) {
    setUser(userData)
    localStorage.setItem('gc_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setCart([])
    localStorage.removeItem('gc_user')
    localStorage.removeItem('gc_cart')
  }

  // ── Cart ──────────────────────────────────────────────────────────────────

  function addToCart(product, quantity = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      const updated = existing
        ? prev.map(i => i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i)
        : [...prev, { product, quantity }]
      localStorage.setItem('gc_cart', JSON.stringify(updated))
      return updated
    })
  }

  function removeFromCart(productId) {
    setCart(prev => {
      const updated = prev.filter(i => i.product.id !== productId)
      localStorage.setItem('gc_cart', JSON.stringify(updated))
      return updated
    })
  }

  function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev => {
      const updated = prev.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
      localStorage.setItem('gc_cart', JSON.stringify(updated))
      return updated
    })
  }

  function clearCart() {
    setCart([])
    localStorage.removeItem('gc_cart')
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cart.reduce((sum, i) => sum + (parseFloat(i.product.price) * i.quantity), 0)

  const value = {
    user, ready,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isFarmer:   user?.role === 'FARMER',
    login, logout,
    cart, cartCount, cartTotal,
    addToCart, removeFromCart, updateCartQuantity, clearCart,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
