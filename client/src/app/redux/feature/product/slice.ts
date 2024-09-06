"use client";
import { TCustomerProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCartFromLocalStorage } from "./api";

export type CartItem = {
  productId: TCustomerProduct;
  variantId: string;
};

type DataPayload = {
  data: TCustomerProduct[];
  totalNumOfPage: number;
  totalData: number;
};

type productPayload = {
  productId: string;
  productType:
    | "audioData"
    | "imageData"
    | "videoData"
    | "similarProducts"
    | "wishlist";
};

type CartPayload = productPayload & {
  variantId: string;
};

type Payload = {
  productId: string;
  variantId: string;
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
  wishlist: TCustomerProduct[];
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
  cart: getCartFromLocalStorage() || [],

  relatedKeyword: [],
  similarProducts: [],
  wishlist: [],
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
    addToWishlist: (state, action: PayloadAction<productPayload>) => {
      const { productId, productType } = action.payload;

      const updateWishlistStatus = (products: any[]) => {
        return products.map((product) =>
          product._id === productId
            ? { ...product, isWhitelisted: !product.isWhitelisted }
            : product
        );
      };

      switch (productType) {
        case "audioData":
          state.audioData = updateWishlistStatus(state.audioData);
          break;
        case "imageData":
          state.imageData = updateWishlistStatus(state.imageData);
          break;
        case "videoData":
          state.videoData = updateWishlistStatus(state.videoData);
          break;
        case "similarProducts":
          state.similarProducts = updateWishlistStatus(state.similarProducts);
          break;
        default:
        case "wishlist":
          state.wishlist = updateWishlistStatus(state.wishlist);
          break;
      }

      state.loading = false;
      state.error = " ";
    },
    addToCart: (state, action: PayloadAction<CartPayload>) => {
      const { productId, productType, variantId } = action.payload;

      const updateCartStatus = (products: any[]) => {
        return products.map((product) =>
          product._id === productId ? { ...product, isInCart: true } : product
        );
      };

      let product;
      switch (productType) {
        case "audioData":
          state.audioData = updateCartStatus(state.audioData);
          product = state.audioData.find(
            (product) => product._id === productId
          );
          break;
        case "imageData":
          state.imageData = updateCartStatus(state.imageData);
          product = state.imageData.find(
            (product) => product._id === productId
          );
          break;
        case "videoData":
          state.videoData = updateCartStatus(state.videoData);
          product = state.videoData.find(
            (product) => product._id === productId
          );
          break;
        case "similarProducts":
          state.similarProducts = updateCartStatus(state.similarProducts);
          product = state.similarProducts.find(
            (product) => product._id === productId
          );
          break;
        case "wishlist":
          state.wishlist = updateCartStatus(state.wishlist);
          product = state.wishlist.find((product) => product._id === productId);
          break;
        default:
          break;
      }

      if (product) {
        state.cart.push({
          productId: product,
          variantId: variantId,
        });
      }

      state.loading = false;
      state.error = " ";
    },
    removeFromCart: (state, action: PayloadAction<productPayload>) => {
      const { productId, productType } = action.payload;

      const updateCartStatus = (products: any[]) => {
        return products.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      };

      state.cart = state.cart.filter(
        (product) => product.productId._id !== productId
      );

      switch (productType) {
        case "audioData":
          state.audioData = updateCartStatus(state.audioData);
          break;
        case "imageData":
          state.imageData = updateCartStatus(state.imageData);
          break;
        case "videoData":
          state.videoData = updateCartStatus(state.videoData);
          break;
        case "similarProducts":
          state.similarProducts = updateCartStatus(state.similarProducts);
          break;
        case "wishlist":
          state.wishlist = updateCartStatus(state.wishlist);
          break;
        default:
          break;
      }

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
      const exitInSimilarProduct = state.similarProducts.find(
        (product) => product._id === productId
      );
      const exitInAudioData = state.audioData.find(
        (product) => product._id === productId
      );
      const exitInImageData = state.imageData.find(
        (product) => product._id === productId
      );
      const exitInVideoData = state.videoData.find(
        (product) => product._id === productId
      );

      const exitInWishlist = state.wishlist.find(
        (product) => product._id === productId
      );

      if (exitInSimilarProduct) {
        state.similarProducts = state.similarProducts.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      }
      if (exitInAudioData) {
        state.audioData = state.audioData.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      }
      if (exitInImageData) {
        state.imageData = state.imageData.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      }
      if (exitInVideoData) {
        state.videoData = state.videoData.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      }

      if (exitInWishlist) {
        state.wishlist = state.wishlist.map((product) =>
          product._id === productId ? { ...product, isInCart: false } : product
        );
      }

      state.loading = false;
      state.error = " ";
    },
    setKeyWords: (state, action: PayloadAction<string[]>) => {
      state.relatedKeyword = action.payload;
    },
    setSimilarProducts: (state, action: PayloadAction<TCustomerProduct[]>) => {
      state.similarProducts = action.payload;
    },
    // wishlist reducers
    setWishlist: (state, action: PayloadAction<TCustomerProduct[]>) => {
      state.wishlist = action.payload;
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(
        (product) => product._id !== productId
      );
      state.loading = false;
      state.error = " ";
    },
    handleVariantChange: (
      state,
      action: PayloadAction<{ productId: string; variantId: string }>
    ) => {
      const { productId, variantId } = action.payload;
      const product = state.cart.find(
        (item) => item.productId._id === productId
      );
      if (product) {
        state.cart = state.cart.map((item) =>
          item.productId._id === productId ? { ...item, variantId } : item
        );
      }
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
  handleVariantChange,
  setImagePage,
  setSingleProduct,
  setAudioPage,
  clearSingleProduct,
  addSingleProductToCart,
  addSingleProductToWishlist,
  removeSingleProductFromCart,
  setVideoData,

  setVideoPage,
  setCart,
  setKeyWords,
  setSimilarProducts,
  setWishlist,
  removeFromWishlist,
} = audioSlice.actions;

export default audioSlice.reducer;
