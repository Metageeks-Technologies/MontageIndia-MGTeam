import { TProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: null;
  loading?: boolean;
  error?: string;
  cartData: TProduct[];
}

const initialState: InitialState = {
  user: null,
  loading: false,
  error: "",
  cartData: [],
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setCurrUser: (state, action: PayloadAction<InitialState>) => {
      (state.user = action.payload.user), (state.loading = false);
      state.error = "";
    },
    requestStart: (state) => {
      state.loading = true;
    },
    requestFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCartData: (state, action: PayloadAction<TProduct[]>) => {
      state.cartData = state.cartData.concat(action.payload); // This merges the new products into the existing array
      state.loading = false;
      state.error = " ";
    },
    // getCartData: (state, action: PayloadAction<TProduct>) => {
    //   state.cartData = action.payload;
    //   state.loading = false;
    //   state.error = "";
    // },
    removeCartItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cartData = state.cartData.filter(product => product._id !== productId); // Remove the product by filtering out the ID
      state.loading = false;
      state.error = " ";
    },
  },
});

export const {
  setCurrUser,
  requestStart,
  requestFail,
  setCartData,
  // getCartData,
  removeCartItem,
} = userSlice.actions;

export default userSlice.reducer;
