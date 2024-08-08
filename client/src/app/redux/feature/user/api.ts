import instance from "@/utils/axios";
import { setCurrUser, requestStart, requestFail, getCardData } from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";

export const getCurrAdmin = async (dispatch: AppDispatch, id: string) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`/admin/getCurrUser?id=${id}`);
    dispatch(setCurrUser(data.user));
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const getCartData = async (
  dispatch: AppDispatch,
  productIds: string[]
) => {
  dispatch(requestStart());
  try {
    const response = await instance.post("/product/cart", productIds);
    console.log("response in getting cartitems:-", response);
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addCartItem = async (
  dispatch: AppDispatch,
   productId: string
) => {
  dispatch(requestStart());
  try {
    const response = await instance.post(`/user/addToCart`, { productId });
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};


export const removeCartItem =  async (
  dispatch: AppDispatch,
   productId: string
) => {
  dispatch(requestStart());
  try {
    const response =  await instance.post(`/user/removeFromCart`, { productId });
    console.log("response in getting cartitems:-", response);
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

