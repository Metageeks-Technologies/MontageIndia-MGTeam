import type { AppDispatch } from "@/app/redux/store";
import instance from "@/utils/axios";
import { notifyError } from "@/utils/toast";
import type { AxiosError } from "axios";
import {
  requestFail,
  requestStart,
  setSingleProduct,
  clearSingleProduct,
  addSingleProductToCart,
  addSingleProductToWishlist,
  removeSingleProductFromCart,
  setCart,
  removeCartProduct,
} from "./slice";
import axios from "axios";

export const getSingleProduct = async (dispatch: AppDispatch, uuid: string) => {
  dispatch(requestStart());
  try {
    const { data } = await instance(`/product/customer/${uuid}`);
    dispatch(setSingleProduct(data.product));
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
  variantId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.patch(`/user/wishlist`, {
      productId,
      variantId,
    });
    dispatch(addSingleProductToWishlist());
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeProductFromWishlist = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/wishlist`, {
      data: { productId },
    });
    dispatch(addSingleProductToWishlist());
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addProductToCart = async (
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
    dispatch(addSingleProductToCart({ productId, variantId }));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeProductFromCart = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/cart`, {
      data: { productId },
    });
    dispatch(removeSingleProductFromCart());
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const clearSingleProductData = (dispatch: AppDispatch) => {
  dispatch(clearSingleProduct());
};

export const getCartData = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`/user/cart`);
    console.log(data, "data");
    dispatch(setCart(data.products));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const removeItemFromCart = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.delete(`/user/cart`, {
      data: { productId },
    });
    dispatch(removeCartProduct(productId));
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const downloadProduct = async (
  dispatch: AppDispatch,
  key: string,
  title: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`/product/download`, {
      params: { key },
    });

    const url = data.url;

    const res = await axios.get(url, {
      responseType: "blob",
    });

    const downloadUrl = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = downloadUrl;

    link.setAttribute("download", title);

    document.body.appendChild(link);

    link.click();

    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};
