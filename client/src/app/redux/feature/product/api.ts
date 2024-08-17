import instance from "@/utils/axios";
import {
  requestStart,
  requestFail,
  setAudioData,
  addToWishlist,
  addToCart,
  removeFromCart,
} from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifyError } from "@/utils/toast";

export const getAudio = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { mediaType: ["audio"] },
    });
    console.log(data);
    dispatch(
      setAudioData({
        audioData: data.products,
        totalNumOfPage: data.numOfPages,
        totalAudioData: data.totalData,
      })
    );
  } catch (error) {
    const e = error as AxiosError;
    notifyError(e.message);
    console.error(e);
    dispatch(requestFail(e.message));
  }
};

export const addAudioToWishlist = async (
  dispatch: AppDispatch,
  productId: string,
  variantId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.patch(`/user/wishlist`, {
      productId,
      variantId,
    });
    dispatch(addToWishlist(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeAudioFromWishlist = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/wishlist`, {
      data: { productId },
    });
    dispatch(addToWishlist(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addAudioToCart = async (
  dispatch: AppDispatch,
  productId: string,
  variantId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.patch(`/user/cart`, {
      productId,
      variantId,
    });
    dispatch(addToCart({ productId, variantId }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeAudioFromCart = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/cart`, {
      data: { productId },
    });
    dispatch(removeFromCart(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};
