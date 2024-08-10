import instance from "@/utils/axios";
import { setCurrUser, requestStart, requestFail,  setCartData, removeCart } from "./slice";
import type { AppDispatch } from "@/app/redux/store";
import type { AxiosError } from "axios";
import { notifySuccess } from "@/utils/toast";
import Swal from "sweetalert2";

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
      if(response.status===200){
      notifySuccess(`${response.data.message}`)
      getCurrCustomer(dispatch)
      dispatch(setCartData(response.data.cart));
      }
    

    return response.data;
  } catch (error:any) {
      const e = error as AxiosError;
      const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
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
    if(response.status===200){
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: "Item Removed from cart",
      });
    dispatch(removeCart(productId));
    getCurrCustomer(dispatch)

  }
    return response.data;
  } catch (error:any) {
    const e = error as AxiosError;
    const errorMessage = error.response?.data?.message || 'An error occurred while sending data';
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
    dispatch(requestFail(e.message));
  }
};

