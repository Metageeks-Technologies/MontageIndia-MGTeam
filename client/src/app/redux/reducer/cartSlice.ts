import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface cart
{
  cartData: [];
  loading: boolean;
  error: string | null;
}

const initialState: cart = {
  cartData: [],
  loading: false,
  error: null,
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // CREATE
    addItem: (state, action: PayloadAction<any>) => {
      state.cartData.push(action.payload);
    },
    // READ
    getCart: (state) => state,
    // UPDATE
    updateItem: (state, action: PayloadAction<any>) => {
      const index = state.cartData.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.cartData[index] = action.payload;
      }
    },
    // DELETE
    removeItem: (state, action: PayloadAction<number>) => {
      state.cartData = state.cartData.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addItem, getCart, updateItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
typ