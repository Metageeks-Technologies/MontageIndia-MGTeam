import { TCustomerProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { removeProductFromCart } from "./api";

export type CartItem = {
  productId: TCustomerProduct;
  variantId: string;
};
type Payload = {
  productId: string;
  variantId: string;
};
type DataPayload = {
  data: TCustomerProduct[];
  totalNumOfPage: number;
  totalData: number;
};
type InitialState = {
  audioData: TCustomerProduct[];
  imageData: TCustomerProduct[];
  videoData: TCustomerProduct[];

  singleProduct: TCustomerProduct | null;
  loading: boolean;
  error: string;

  page: number;
  totalNumOfPage: number;
  totalAudioData: number;

  imagePage: number;
  totalImageNumOfPage: number;
  totalImageData: number;

  videoPage: number;
  totalVideoNumOfPage: number;
  totalVideoData: number;
  cart: CartItem[];
  relatedKeyword: string[];
  similarProducts: TCustomerProduct[];
};

const initialState: InitialState = {
  audioData: [],
  imageData: [],
  videoData: [],

  singleProduct: null,
  loading: true,
  error: "",

  page: 1,
  totalNumOfPage: 1,
  totalAudioData: 0,

  imagePage: 1,
  totalImageNumOfPage: 1,
  totalImageData: 0,

  videoPage: 1,
  totalVideoNumOfPage: 1,
  totalVideoData: 0,
  cart: [],

  relatedKeyword: [],
  similarProducts: [],
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
    // audio reducers
    setAudioData: (state, action: PayloadAction<DataPayload>) => {
      state.loading = false;
      state.audioData = action.payload.data;
      state.totalNumOfPage = action.payload.totalNumOfPage;
      state.totalAudioData = action.payload.totalData;
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
        state.cart.push({
          productId: product,
          variantId: action.payload.variantId,
        });
      }
      state.loading = false;
      state.error = " ";
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (product) => product.productId._id !== productId
      );
      state.audioData = state.audioData.map((product) =>
        product._id === productId ? { ...product, isInCart: false } : product
      );
      state.loading = false;
      state.error = " ";
    },
    setAudioPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    // image reducers
    setImageData: (state, action: PayloadAction<DataPayload>) => {
      state.loading = false;
      state.imageData = action.payload.data;
      state.totalImageNumOfPage = action.payload.totalNumOfPage;
      state.totalImageData = action.payload.totalData;
    },
    addToImageWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.imageData = state.imageData.map((product) =>
        product._id === productId
          ? { ...product, isWhitelisted: !product.isWhitelisted }
          : product
      );
      state.loading = false;
      state.error = " ";
    },
    addToImageCart: (state, action: PayloadAction<Payload>) => {
      const productId = action.payload.productId;
      state.imageData = state.imageData.map((product) =>
        product._id === productId ? { ...product, isInCart: true } : product
      );
      const product = state.imageData.find(
        (product) => product._id === productId
      );
      if (product) {
        state.cart.push({
          productId: product,
          variantId: action.payload.variantId,
        });
      }
      state.loading = false;
      state.error = " ";
    },
    removeFromImageCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (product) => product.productId._id !== productId
      );
      state.imageData = state.imageData.map((product) =>
        product._id === productId ? { ...product, isInCart: false } : product
      );
      state.loading = false;
      state.error = " ";
    },
    setImagePage: (state, action: PayloadAction<number>) => {
      state.imagePage = action.payload;
    },
    // video reducers
    setVideoData: (state, action: PayloadAction<DataPayload>) => {
      state.loading = false;
      state.videoData = action.payload.data;
      state.totalVideoNumOfPage = action.payload.totalNumOfPage;
      state.totalVideoData = action.payload.totalData;
    },
    addToVideoWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.videoData = state.videoData.map((product) =>
        product._id === productId
          ? { ...product, isWhitelisted: !product.isWhitelisted }
          : product
      );
      state.loading = false;
      state.error = " ";
    },
    addToVideoCart: (state, action: PayloadAction<Payload>) => {
      const productId = action.payload.productId;
      state.videoData = state.videoData.map((product) =>
        product._id === productId ? { ...product, isInCart: true } : product
      );
      const product = state.videoData.find(
        (product) => product._id === productId
      );
      if (product) {
        state.cart.push({
          productId: product,
          variantId: action.payload.variantId,
        });
      }
      state.loading = false;
      state.error = " ";
    },
    removeFromVideoCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (product) => product.productId._id !== productId
      );
      state.videoData = state.videoData.map((product) =>
        product._id === productId ? { ...product, isInCart: false } : product
      );
      state.loading = false;
      state.error = " ";
    },
    setVideoPage: (state, action: PayloadAction<number>) => {
      state.videoPage = action.payload;
    },
    // single product reducers
    setSingleProduct: (state, action: PayloadAction<TCustomerProduct>) => {
      state.singleProduct = action.payload;
      state.loading = false;
      state.error = " ";
    },
    clearSingleProduct: (state) => {
      state.singleProduct = null;
    },
    addSingleProductToCart: (state, action: PayloadAction<Payload>) => {
      const productId = action.payload.productId;
      const product = state.cart.find(
        (item) => item.productId._id === productId
      );
      const newProduct = state.singleProduct;
      if (product) {
        state.cart = state.cart.map((product) =>
          product.productId._id === productId
            ? { ...product, variantId: action.payload.variantId }
            : product
        );
      } else if (newProduct) {
        state.cart.push({
          productId: newProduct,
          variantId: action.payload.variantId,
        });
      }
      if (state.singleProduct) state.singleProduct.isInCart = false;
      state.loading = false;
      state.error = " ";
    },
    addSingleProductToWishlist: (state) => {
      if (state.singleProduct) {
        state.singleProduct.isWhitelisted = !state.singleProduct.isWhitelisted;
      }
    },
    removeSingleProductFromCart: (state) => {
      state.cart = state.cart.filter(
        (product) => product.productId._id !== state.singleProduct?._id
      );
      if (state.singleProduct) {
        state.singleProduct.isInCart = false;
      }
    },
    // cart reducers
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    removeCartProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter(
        (product) => product.productId._id !== productId
      );
      state.loading = false;
      state.error = " ";
    },
  },
});

export const {
  removeCartProduct,
  requestStart,
  requestFail,
  setAudioData,
  addToWishlist,
  addToCart,
  removeFromCart,
  setImageData,
  addToImageWishlist,
  addToImageCart,
  removeFromImageCart,
  setImagePage,
  setSingleProduct,
  setAudioPage,
  clearSingleProduct,
  addSingleProductToCart,
  addSingleProductToWishlist,
  removeSingleProductFromCart,
  setVideoData,
  addToVideoWishlist,
  addToVideoCart,
  removeFromVideoCart,
  setVideoPage,
  setCart,
} = audioSlice.actions;

export default audioSlice.reducer;
