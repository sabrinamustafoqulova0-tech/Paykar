import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../types'
import type { RootState } from './index'

interface CompareState {
  list: Product[]
}

const initialState: CompareState = {
  list: [],
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare(state, action: PayloadAction<Product>) {
      const product = action.payload
      const exists = state.list.find(i => i.id === product.id)
      if (exists) {
        state.list = state.list.filter(i => i.id !== product.id)
      } else {
        if (state.list.length >= 4) return // max 4 items
        state.list.push(product)
      }
    },
    clearCompare(state) {
      state.list = []
    },
  },
})

export const { toggleCompare, clearCompare } = compareSlice.actions

export const selectCompareList = (state: RootState) => state.compare.list

export default compareSlice.reducer
