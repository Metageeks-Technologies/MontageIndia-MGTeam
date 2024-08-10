import instance from "@/utils/axios";
import { setCurrUser, requestStart, requestFail,  setCartData } from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifySuccess } from "@/utils/toast";

export const getCurrCustomer = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const response = await instance.get(`/user/getCurrent`);
    dispatch(setCurrUser(response.data));
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
    dispatch(setCartData(response.data));
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
      const response = await instance.post( `/product/addToCart`, { productId } );
      console.log( "response after adding product to cart", response )
      notifySuccess(`${response.data.message}`)
      dispatch(setCartData(response.data.cart));


    return response.data;
  } catch (error) {
      const e = error as AxiosError;
      console.log("error in creatin:-",error)
    dispatch(requestFail(e.message));
  }
};


export const removeCartItem =  async (
  dispatch: AppDispatch,
   productId: string
) => {
  dispatch(requestStart());
  try {
    const response =  await instance.post(`/product/removeFromCart`, { productId });
    console.log("response in getting cartitems:-", response);
    dispatch({
      type: 'cart/removeCartItem', // Ensure this matches the action type in your slice
      payload: productId,
    });

    return response.data;
  } catch (error) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

