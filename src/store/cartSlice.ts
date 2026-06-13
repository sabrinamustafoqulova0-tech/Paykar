import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, Product } from '../types'
import type { RootState } from './index'

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find(i => i.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({ product, quantity })
      }
    },
    updateQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const { productId, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter(i => i.product.id !== productId)
      } else {
        const item = state.items.find(i => i.product.id === productId)
        if (item) item.quantity = quantity
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.product.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions

// Selectors
export const selectCart = (state: RootState) => state.cart.items

export const selectCartSubtotal = createSelector(
  selectCart,
  items => items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
)

export const selectCartItemCount = createSelector(
  selectCart,
  items => items.reduce((sum, i) => sum + i.quantity, 0)
)

export default cartSlice.reducer
