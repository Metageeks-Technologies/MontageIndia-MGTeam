import { Tcart } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: null;
  loading?: boolean;
  error?: string;
  cartData: Tcart[];
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
    setCartData: (state, action: PayloadAction<Tcart[]>) => {
      state.cartData = state.cartData.concat(action.payload); // This merges the new products into the existing array
      state.loading = false;
      state.error = " ";
    },
    getCart: (state, action: PayloadAction<Tcart[]>) => {
      state.cartData = action.payload;
      state.loading = false;
      state.error = "";
    },
    removeCart: (state, action: PayloadAction<{ productId: string; variantId: string }>) => {
      const { productId, variantId } = action.payload;
      state.cartData = state.cartData.filter((item:any) =>
        item.product !== productId || item.variantId !== variantId
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
  setCartData,
  getCart,
  removeCart,
} = userSlice.actions;

export default userSlice.reducer;
