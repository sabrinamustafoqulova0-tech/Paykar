import React, { createContext, useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, CartItem, Review } from '../types'
import reviewsData from '../data/reviews.json'

// ─── Types ──────────────────────────────────────────────────────────────────

interface StoreContextType {
  // Auth
  isLoggedIn: boolean
  loginModalOpen: boolean
  setLoginModalOpen: (open: boolean) => void
  showLoginToast: boolean
  loginForm: { phone: string; password: string }
  setLoginForm: React.Dispatch<React.SetStateAction<{ phone: string; password: string }>>
  handleFakeLoginSubmit: (e: React.FormEvent) => void
  handleLogout: () => void
  handleCartClick: () => void

  // Product Modal
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  activeProductReviews: Review[]

  // Cart
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  removeFromCart: (productId: number) => void
  cartSubtotal: number

  // Compare
  compareList: Product[]
  setCompareList: React.Dispatch<React.SetStateAction<Product[]>>
  toggleCompare: (product: Product) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────

const StoreContext = createContext<StoreContextType | null>(null)

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()

  // ── Auth state ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [showLoginToast, setShowLoginToast] = useState(false)
  const [loginForm, setLoginForm] = useState({ phone: '', password: '' })

  // ── Product modal ───────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // ── Cart state ──────────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([])

  // ── Compare state ───────────────────────────────────────────────────────
  const [compareList, setCompareList] = useState<Product[]>([])

  // ── Auth handlers ───────────────────────────────────────────────────────

  const handleCartClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true)
    } else {
      navigate('/cart')
    }
  }

  const handleFakeLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setLoginModalOpen(false)
    setShowLoginToast(true)
    navigate('/cart')
    setTimeout(() => setShowLoginToast(false), 3000)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCart([])
    navigate('/')
  }

  // ── Cart handlers ───────────────────────────────────────────────────────

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }

  // ── Compare handlers ────────────────────────────────────────────────────

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(i => i.id === product.id)) return prev.filter(i => i.id !== product.id)
      if (prev.length >= 4) { alert('Максимум 4 товара для сравнения'); return prev }
      return [...prev, product]
    })
  }

  // ── Computed ────────────────────────────────────────────────────────────

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    [cart]
  )

  const activeProductReviews = useMemo((): Review[] => {
    if (!selectedProduct) return []
    return (reviewsData as Review[]).filter(r => r.productId === selectedProduct.id)
  }, [selectedProduct])

  // ── Value ───────────────────────────────────────────────────────────────

  return (
    <StoreContext.Provider value={{
      isLoggedIn, loginModalOpen, setLoginModalOpen, showLoginToast,
      loginForm, setLoginForm, handleFakeLoginSubmit, handleLogout, handleCartClick,
      selectedProduct, setSelectedProduct, activeProductReviews,
      cart, setCart, addToCart, updateQuantity, removeFromCart, cartSubtotal,
      compareList, setCompareList, toggleCompare,
    }}>
      {children}
    </StoreContext.Provider>
  )
}
