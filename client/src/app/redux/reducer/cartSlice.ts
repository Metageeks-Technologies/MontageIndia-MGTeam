// cartSlice.ts
import instance from '@/utils/axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  cartData: any[]; // Change the type if you have a specific type for cart items
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartData: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (productIds: string[]) => {
  try {
    const response = await instance.post('/product/cart', productIds);
    console.log('response in getting cartitems:-', response);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const addCartItem = createAsyncThunk('cart/addCartItem', async (productId: string, id) => {
  try {
    const response = await instance.post(`/user/addToCart`, { productId, id });
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productId: string, id) => {
  try {
    await instance.post(`/user/removeFromCart`, { productId, id });
    return id;
  } catch (error) {
    throw error;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.cartData = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.cartData.push(action.payload);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.cartData = action.payload
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove cart item';
      });
  },
});

export default cartSlice.reducer;
