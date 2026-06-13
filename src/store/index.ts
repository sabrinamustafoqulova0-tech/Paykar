import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import compareReducer from './compareSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    compare: compareReducer,
    ui: uiReducer,
  },
})

// Inferred types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
