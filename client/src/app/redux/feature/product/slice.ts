import { TCustomerProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  product: TCustomerProduct;
  variantId: string;
};
type Payload = {
  productId: string;
  variantId: string;
};
type InitialState = {
  audioData: TCustomerProduct[];
  loading: boolean;
  error: string;
  page: number;
  totalNumOfPage: number;
  totalAudioData: number;
  cart: CartItem[];
};

type AudioPayload = {
  audioData: TCustomerProduct[];
  totalNumOfPage: number;
  totalAudioData: number;
};

const initialState: InitialState = {
  audioData: [],
  loading: true,
  error: "",
  page: 1,
  totalNumOfPage: 1,
  totalAudioData: 0,
  cart: [],
};

export const audioSlice = createSlice({
  name: "audioSlice",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
    },
    requestFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAudioData: (state, action: PayloadAction<AudioPayload>) => {
      state.loading = false;
      state.audioData = action.payload.audioData;
      state.totalNumOfPage = action.payload.totalNumOfPage;
      state.totalAudioData = action.payload.totalAudioData;
    },
    addToWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.audioData = state.audioData.map((product) =>
        product._id === productId
          ? { ...product, isWhitelisted: !product.isWhitelisted }
          : product
      );
      state.loading = false;
      state.error = " ";
    },
    addToCart: (state, action: PayloadAction<Payload>) => {
      const productId = action.payload.productId;
      state.audioData = state.audioData.map((product) =>
        product._id === productId ? { ...product, isInCart: true } : product
      );
      const product = state.audioData.find(
        (product) => product._id === productId
      );
      if (product) {
        state.cart.push({ product, variantId: action.payload.variantId });
      }
      state.loading = false;
      state.error = " ";
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (product) => product.product._id !== productId
      );
      state.audioData = state.audioData.map((product) =>
        product._id === productId ? { ...product, isInCart: false } : product
      );
      state.loading = false;
      state.error = " ";
    },
  },
});

export const {
  requestStart,
  requestFail,
  setAudioData,
  addToWishlist,
  addToCart,
  removeFromCart,
} = audioSlice.actions;

export default audioSlice.reducer;
