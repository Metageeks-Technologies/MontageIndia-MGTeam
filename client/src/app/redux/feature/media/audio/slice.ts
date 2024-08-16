import { TCustomerProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  audioData: TCustomerProduct[];
  loading: boolean;
  error: string;
  page: number;
  totalNumOfPage: number;
  totalAudioData: number;
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
  },
});

export const { requestStart, requestFail, setAudioData, addToWishlist } =
  audioSlice.actions;

export default audioSlice.reducer;
