import { TCustomerProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: null;
  loading?: boolean;
  error?: string;
  cartData: TCustomerProduct[];
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
      state.user = action.payload.user;
      state.loading = false;
      state.error = "";
    },
    requestStart: (state) => {
      state.loading = true;
    },
    requestFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addProductToCart: (state, action: PayloadAction<TCustomerProduct>) => {
      state.cartData = [...state.cartData, action.payload]; // This merges the new products into the existing array
      state.loading = false;
      state.error = " ";
    },
    setProductCart: (state, action: PayloadAction<TCustomerProduct[]>) => {
      state.cartData = action.payload;
      state.loading = false;
      state.error = "";
    },
    removeCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cartData = state.cartData.filter(
        (product) => product._id !== productId
      );
      state.loading = false;
      state.error = " ";
    },
  },
});

export const {
  setCurrUser,
  requestStart,
  requestFail,
  addProductToCart,
  setProductCart,
  removeCart,
} = userSlice.actions;

export default userSlice.reducer;
