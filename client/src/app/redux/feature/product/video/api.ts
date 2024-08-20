import instance from "@/utils/axios";
import {
  requestStart,
  requestFail,
  setVideoData,
  addToVideoWishlist,
  addToVideoCart,
  removeFromVideoCart,
} from "../slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifyError } from "@/utils/toast";

export const getVideo = async (dispatch: AppDispatch, params: any) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`product/customer`, {
      params: { ...params },
    });
    console.log(data);
    dispatch(
      setVideoData({
        data: data.products,
        totalNumOfPage: data.numOfPages,
        totalData: data.totalData,
      })
    );
  } catch (error) {
    const e = error as AxiosError;
    notifyError(e.message);
    console.error(e);
    dispatch(requestFail(e.message));
  }
};

export const addVideoToWishlist = async (
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
    dispatch(addToVideoWishlist(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeVideoFromWishlist = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/wishlist`, {
      data: { productId },
    });
    dispatch(addToVideoWishlist(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addVideoToCart = async (
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
    dispatch(addToVideoCart({ productId, variantId }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeVideoFromCart = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/cart`, {
      data: { productId },
    });
    dispatch(removeFromVideoCart(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};
