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
  setSimilarProducts,
  setKeyWords,
  setWishlist,
  CartItem,
  addToCart,
  removeFromCart,
} from "./slice";
import axios from "axios";

export const getSingleProduct = async (
  dispatch: AppDispatch,
  user: boolean,
  uuid: string
) => {
  dispatch(requestStart());
  try {
    const { data } = await instance(`/product/customer/${uuid}`);
    let product = data.product;
    if (!user) {
      const cart = getCartFromLocalStorage();
      const isExitInCart = cart.some(
        (item: any) => item.productId._id === product._id
      );
      product = { ...product, isInCart: isExitInCart };
    }

    dispatch(setSingleProduct(data.product));
    dispatch(
      setSimilarProducts(
        filerProductForUser({ products: data.similar, user: user })
      )
    );
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
  dispatch(setSimilarProducts([]));
};

export const clearKeywords = (dispatch: AppDispatch) => {
  dispatch(setKeyWords([]));
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

export const getWishlist = async (dispatch: AppDispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await instance.get(`/user/wishlist`);
    dispatch(setWishlist(data.products));
    console.log(data, "data");
  } catch (error: any) {
    const e = error as AxiosError;
    dispatch(requestFail(e.message));
  }
};

export const setCartInLocalStorage = (
  item: CartItem,
  dispatch: AppDispatch,
  productType:
    | "audioData"
    | "imageData"
    | "videoData"
    | "similarProducts"
    | "wishlist"
) => {
  if (typeof window === "undefined") return;
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    const parsedCart = JSON.parse(cartData);
    const updatedCart = [...parsedCart, item];
    localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
  } else {
    localStorage.setItem("_mi_cart", JSON.stringify([item]));
  }
  dispatch(
    addToCart({
      productId: item.productId._id,
      variantId: item.variantId,
      productType: productType,
    })
  );
};

export const getCartFromLocalStorage = () => {
  if (typeof window === "undefined") return [];
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    return JSON.parse(cartData);
  }
  return [];
};

export const removeItemFromLocalStorage = (
  productId: string,
  dispatch: AppDispatch,
  productType:
    | "audioData"
    | "imageData"
    | "videoData"
    | "similarProducts"
    | "wishlist"
) => {
  if (typeof window === "undefined") return;
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    const parsedCart = JSON.parse(cartData);
    const updatedCart = parsedCart.filter(
      (item: CartItem) => item.productId._id !== productId
    );
    localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
  }
  dispatch(removeFromCart({ productId, productType }));
};

export const filerProductForUser = ({
  products,
  user,
}: {
  products: any;
  user: boolean;
}) => {
  if (typeof window === "undefined") return [];
  if (user) return products;
  const cart = getCartFromLocalStorage();
  const cartData = cart.map((item: any) => item.productId);
  const filterProducts = products.map((item: any) => {
    const isInCart = cartData.some(
      (cartItem: any) => cartItem._id === item._id
    );
    return { ...item, isInCart };
  });
  return filterProducts;
};

export const setSingleProductInLocalStorage = (
  newItem: CartItem,
  dispatch: AppDispatch
) => {
  if (typeof window === "undefined") return;
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    const parsedCart = JSON.parse(cartData) as CartItem[];
    const existingProduct = parsedCart.find(
      (item) => item.productId._id === newItem.productId._id
    );
    if (existingProduct) {
      const updatedCart = parsedCart.map((item) =>
        item.productId._id === newItem.productId._id
          ? { ...item, variantId: newItem.variantId }
          : item
      );
      localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...parsedCart, newItem];
      localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
    }
  } else {
    localStorage.setItem("_mi_cart", JSON.stringify([newItem]));
  }
  dispatch(
    addSingleProductToCart({
      productId: newItem.productId._id,
      variantId: newItem.variantId,
    })
  );
};

export const removeSingleProductFromLocalStorage = (
  productId: string,
  dispatch: AppDispatch
) => {
  if (typeof window === "undefined") return;
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    const parsedCart = JSON.parse(cartData) as CartItem[];
    const updatedCart = parsedCart.filter(
      (item) => item.productId._id !== productId
    );
    localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
  }
  dispatch(removeSingleProductFromCart());
};

export const removeFromLocalStorageCart = (
  productId: string,
  dispatch: AppDispatch
) => {
  if (typeof window === "undefined") return;
  const cartData = localStorage.getItem("_mi_cart");
  if (cartData) {
    const parsedCart = JSON.parse(cartData) as CartItem[];
    const updatedCart = parsedCart.filter(
      (item) => item.productId._id !== productId
    );
    localStorage.setItem("_mi_cart", JSON.stringify(updatedCart));
  }
  dispatch(removeCartProduct(productId));
};
