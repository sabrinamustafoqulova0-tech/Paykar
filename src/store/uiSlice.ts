import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../types'
import type { RootState } from './index'

interface UiState {
  selectedProduct: Product | null
}

const initialState: UiState = {
  selectedProduct: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload
    },
  },
})

export const { setSelectedProduct } = uiSlice.actions

export const selectSelectedProduct = (state: RootState) => state.ui.selectedProduct

export default uiSlice.reducer
