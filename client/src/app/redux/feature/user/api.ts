import instance from "@/utils/axios";
import {
  setCurrUser,
  requestStart,
  requestFail,
  setProductCart,
  removeCart,
} from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import Swal from "sweetalert2";

export const getCurrCustomer = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const response = await instance.get(`/user/getCurrent`);
    console.log("user", response.data);
    dispatch(setCurrUser(response.data));
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const getCartData = async (
  dispatch: AppDispatch
  // productIds: string[]
) => {
  dispatch(requestStart());
  try {
    const response = await instance("/product/cart/data");
    console.log("response in getting cartitems:-", response);
    // dispatch(getCart(response.data));
    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const addCartItem = async (dispatch: AppDispatch, productId: string) => {
  dispatch(requestStart());

  try {
    const response = await instance.post(`/product/addToCart`, { productId });
    console.log("response after adding product to cart", response);
    if (response.status === 200) {
      // notifySuccess(`${response.data.message}`);
      Swal.fire({
        title: "Product Added to Cart",
        text: "You can now view your cart",
        icon: "success",
      });
      getCurrCustomer(dispatch);
      dispatch(setProductCart(response.data.cart));
    }

    return response.data;
  } catch (error: any) {
    const e = error as AxiosError;
    const errorMessage =
      error.response?.data?.message || "An error occurred while sending data";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });
    dispatch(requestFail(e.message));
  }
};

export const removeCartItem = async (
  dispatch: AppDispatch,
  productId: string
) => {
  dispatch(requestStart());
  try {
    const response = await instance.post(`/product/removeFromCart`, {
      productId,
    });

    if (response.status === 200) {
      // notifySuccess(`${response.data.message}`);
      Swal.fire({
        title: "Product Removed from Cart",
        text: "You can now view your cart",
        icon: "success",
      });
      dispatch(removeCart(productId));
      getCurrCustomer(dispatch);
    }
    return response.data;
  } catch (error: any) {
    const e = error as AxiosError;
    const errorMessage =
      error.response?.data?.message || "An error occurred while sending data";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });
    dispatch(requestFail(e.message));
  }
};
