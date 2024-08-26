import type { AppDispatch } from "@/app/redux/store";
import instance from "@/utils/axios";
import { notifyError } from "@/utils/toast";
import type { AxiosError } from "axios";
import {
  addToCart,
  addToWishlist,
  removeFromCart,
  requestFail,
  requestStart,
  setAudioData,
  setKeyWords,
} from "../slice";

export const getAudio = async (dispatch: AppDispatch, params: any) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { ...params },
    });
    console.log(data);
    dispatch(
      setAudioData({
        data: data.products,
        totalNumOfPage: data.numOfPages,
        totalData: data.totalData,
      })
    );
    dispatch(setKeyWords(data.relatedKeywords));
  } catch (error) {
    const e = error as AxiosError;
    notifyError(e.message);
    console.error(e);
    dispatch(requestFail(e.message));
  }
};

export const addProductToWishlist = async (
  dispatch: AppDispatch,
  productId: string,
  variantId: string,
  productType: "audioData" | "imageData" | "videoData" | "similarProducts"
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.patch(`/user/wishlist`, {
      productId,
      variantId,
    });
    dispatch(addToWishlist({ productId, productType }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeProductFromWishlist = async (
  dispatch: AppDispatch,
  productId: string,
  productType: "audioData" | "imageData" | "videoData" | "similarProducts"
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/wishlist`, {
      data: { productId },
    });
    dispatch(addToWishlist({ productId, productType }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addProductToCart = async (
  dispatch: AppDispatch,
  productId: string,
  variantId: string,
  productType: "audioData" | "imageData" | "videoData" | "similarProducts"
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.patch(`/user/cart`, {
      productId,
      variantId,
    });
    dispatch(addToCart({ productId, variantId, productType }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeProductFromCart = async (
  dispatch: AppDispatch,
  productId: string,
  productType: "audioData" | "imageData" | "videoData" | "similarProducts"
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/cart`, {
      data: { productId },
    });
    dispatch(removeFromCart({ productId, productType }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};
