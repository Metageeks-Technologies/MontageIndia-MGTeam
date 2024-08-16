import { TProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: null;
  loading?: boolean;
  error?: string;
  cartData: TProduct[];
  wishlistData: TProduct[];
}

const initialState: InitialState = {
  user: null,
  loading: false,
  error: "",
  cartData: [],
  wishlistData:[],
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
    getCart: (state, action: PayloadAction<TProduct[]>) => {
      state.cartData = action.payload;
      state.loading = false;
      state.error = "";
    },
    removeCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      console.log("remove item:",productId)
      state.cartData = state.cartData.filter(product => product._id !== action.payload);
      state.loading = false;
      state.error = " ";
    },
    getWishlist: (state, action: PayloadAction<TProduct[]>) => {
      state.wishlistData = action.payload;
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  setCurrUser,
  requestStart,
  requestFail,
  setCartData,
  getCart,
  removeCart,
  getWishlist,
} = userSlice.actions;

export default userSlice.reducer;
