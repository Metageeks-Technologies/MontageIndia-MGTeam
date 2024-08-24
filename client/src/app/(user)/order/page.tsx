"use client";
import React, { useEffect, useState } from "react";
import {
  addCartItem,
  getCartData,
  getCurrCustomer,
  removeCartItem,
} from "@/app/redux/feature/user/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { OrderOption } from "@/types/order";
import PayButton from "@/components/payment/payButton";
import {
  MdDeleteForever,
  MdCurrencyRupee,
  MdShoppingCart,
} from "react-icons/md";
import instance from "@/utils/axios";
import { RxCross2 } from "react-icons/rx";
import { removeItemFromCart } from "@/app/redux/feature/product/api";
import { CartItem, removeCartProduct } from "@/app/redux/feature/product/slice";
import { Spinner } from "@nextui-org/react";
import Swal from "sweetalert2";

const PlaceOrder = () => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState(0);
  const [loader, setLoader] = useState(true);
  //   const cart = useAppSelector((state) => state.user.cartData);
  const cart = useAppSelector((state) => state.product.cart);

  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (cart) {
      setLoader(false);
    }
  }, [cart]);

  const handleBuyWithCredits = async (id: string) => {
    try {
      const response = await instance.post(`/product/buyWithCredits/${id}`, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Product Purchased Successfully",
        });
        handleRemoveCart(id);
      }
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Purchase Failed.Try Other Method of Purchase",
        text:
          error.response.data.message ||
          "Something went wrong. Please try again later",
      });
    }
  };

  const handleRemoveCart = (id: string) => {
    removeItemFromCart(dispatch, id);
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce((total: number, item) => {
      const matchingVariant = item.productId?.variants?.find((variant: any) =>
        item.variantId.includes(variant._id)
      );
      const price = matchingVariant ? matchingVariant.price : 0;
      return total + price;
    }, 0);

    return total; // Return total as a number
  };

  useEffect(() => {
    setAmount(calculateTotalPrice());
  }, [cart]);

  const createOrderOption = (): OrderOption => {
    const products = cart.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId, // Assuming the first variant ID is needed
    }));

    return {
      amount: amount.toString().concat("00"), // Convert the amount to a string
      currency: "INR",
      notes: {
        products,
      },
    };
  };
  const limitWords = (text: string, limit: number) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };
  const handleSizeChange = (productId: string, variantId: string) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: variantId,
    }));
    console.log(`Selected size for product ${productId}: ${variantId}`);
    addCartItem(dispatch, productId);
  };

  const orderOption = createOrderOption();

  return (
    <div className="md:w-[70%] min-h-screen flex justify-start flex-col m-auto py-6 b">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {loader && (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      )}
      {!loader && cart.length === 0 && (
        <div className="flex justify-center items-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
        </div>
      )}
      {!loader && cart.length > 0 && (
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-black ">
            <thead className="text-md py-2 text-black rounded-lg capitalize bg-[#F1F1F1] border-b border-gray-200 border-1 ">
              <tr>
                <th scope="col" className="px-6 py-3 border-none">
                  Product
                </th>
                <th scope="col" className="px-6 py-3  border-none">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-center border-none">
                  Price
                </th>
                <th scope="col" className="px-6 py-3  border-none"></th>
              </tr>
            </thead>
            <tbody>
              {cart?.map((item, index: number) => (
                <tr key={index} className="w-full bg-white border-b text-black">
                  <td className="w-2/6 px-6 py-4 border-none">
                    <div className="flex flex-row items-start justify-start gap-4">
                      <div className="md:w-1/3 rounded-lg overflow-hidden flex justify-center items-center">
                        {item?.productId.mediaType === "image" && (
                          <img
                            className="w-full h-full object-cover"
                            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                            alt={item?.productId.title}
                          />
                        )}
                        {item?.productId.mediaType === "audio" && (
                          <img
                            className="w-full h-full object-cover"
                            src="/asset/audio.svg"
                            alt={item?.productId.title}
                          />
                        )}
                        {item?.productId.mediaType === "video" && (
                          <video
                            loop
                            muted
                            className="w-full h-full object-cover"
                          >
                            <source
                              src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                            />
                          </video>
                        )}
                      </div>
                      <div className="md:w-2/3 overflow-hidden">
                        <div className="flex flex-col justify-start items-start ">
                          <div className="text-md font-bold">
                            {limitWords(
                              item?.productId.title?.toUpperCase(),
                              4
                            )}
                          </div>
                          <div className="mb-1 w-full">
                            <p className="text-md text-gray-600 description-truncate text-wrap">
                              {item?.productId.description}
                            </p>
                          </div>
                          {/* <div className="text-md text-gray-600 mb-2 flex justify-start text-wrap items-center">
                      <span>Product ID:</span><span>{ item?.productId.uuid }</span>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4 border-none">
                    <div className="text-md text-gray-600 mb-2 ">
                      <select
                        className="text-black border-1 border-gray-300 outline-none px-4 py-2 bg-gray-100 rounded-md"
                        value={
                          selectedSizes[item.productId._id] || item.variantId[0]
                        }
                        onChange={(e) =>
                          handleSizeChange(item.productId._id, e.target.value)
                        }
                      >
                        {item.productId.variants.map((variant: any) => (
                          <option key={variant._id} value={variant._id}>
                            {variant.size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4 border-none">
                    <div className="text-gray-600 justify-center items-center flex flex-row">
                      <span className="font-bold">
                        <MdCurrencyRupee />
                      </span>

                      {
                        item.productId?.variants.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.price
                      }
                    </div>
                  </td>
                  <td className="w-2/6 px-6 py-4 border-none ">
                    <div className="w-full flex justify-between px-5 items-center gap-4">
                      <span
                        onClick={() =>
                          handleBuyWithCredits(item?.productId._id)
                        }
                        className=" hover:bg-webred hover:text-white text-webred border-1 border-webred cursor-pointer rounded-md px-4 py-2"
                      >
                        <div className="text-md font-semibold">
                          Buy with credits
                        </div>
                      </span>
                      <span
                        className=" text-webred cursor-pointer"
                        onClick={() => {
                          handleRemoveCart(item.productId?._id);
                        }}
                      >
                        <RxCross2 size={30} />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="text-md py-2 text-black rounded-lg capitalize bg-[#F1F1F1] border-b border-gray-200 border-1 ">
              <tr>
                <td className="px-6 py-4 border-none  "></td>
                <td className="px-6 py-4 border-none  "></td>
                <td className="px-6 py-4 border-none  ">
                  <div className="flex justify-center items-center ">
                    <span className="font-semibold mr-2">Total Price: </span>
                    <span className="font-bold">
                      <MdCurrencyRupee />
                    </span>
                    <span>{amount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 border-none">
                  <div className="flex justify-start items-center gap-4 px-4">
                    <PayButton orderOption={orderOption} />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
