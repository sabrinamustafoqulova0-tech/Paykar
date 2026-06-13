import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isLoggedIn: boolean
  loginModalOpen: boolean
  showLoginToast: boolean
  loginForm: { phone: string; password: string }
}

const initialState: AuthState = {
  isLoggedIn: false,
  loginModalOpen: false,
  showLoginToast: false,
  loginForm: { phone: '', password: '' },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true
      state.loginModalOpen = false
      state.showLoginToast = true
    },
    logout(state) {
      state.isLoggedIn = false
    },
    hideLoginToast(state) {
      state.showLoginToast = false
    },
    setLoginModalOpen(state, action: PayloadAction<boolean>) {
      state.loginModalOpen = action.payload
    },
    setLoginForm(state, action: PayloadAction<{ phone: string; password: string }>) {
      state.loginForm = action.payload
    },
  },
})

export const { login, logout, hideLoginToast, setLoginModalOpen, setLoginForm } = authSlice.actions
export default authSlice.reducer
