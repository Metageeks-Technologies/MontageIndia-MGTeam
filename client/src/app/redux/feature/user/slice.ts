import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: null;
  loading?: boolean;
  error?: string;
  cartData: any[];
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
    setCartData: (state, action: PayloadAction<any[]>) => {
      state.cartData.push(action.payload);
      state.loading = false;
      state.error = " ";
    },
    getCardData: (state, action: PayloadAction<any[]>) => {
      state.cartData = action.payload;
      state.loading = false;
      state.error = "";
    },
    removeCardIem: (state, action: PayloadAction<any[]>) => {
      state.cartData.push(action.payload);
      state.loading = false;
    },
  },
});

export const {
  setCurrUser,
  requestStart,
  requestFail,
  setCartData,
  getCardData,
  removeCardIem,
} = userSlice.actions;

export default userSlice.reducer;
