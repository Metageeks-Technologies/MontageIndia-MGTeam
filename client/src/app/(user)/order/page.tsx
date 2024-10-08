"use client";
import {
  removeItemFromCart,
  removeFromLocalStorageCart,
  addProductToCart,
  setSingleProductInLocalStorage,
} from "@/app/redux/feature/product/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import PayButton from "@/components/payment/payButton";
import { OrderOption } from "@/types/order";
import instance from "@/utils/axios";
import { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import {
  handleVariantChange,
  setCart,
} from "@/app/redux/feature/product/slice";
import { removeCartProduct } from "@/app/redux/feature/product/slice";
import { Spinner } from "@nextui-org/react";
import { SpinnerLoader } from "@/components/loader/loaders";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { notifyInfo, notifySuccess } from "@/utils/toast";
import { redirectToLogin } from "@/utils/redirectToLogin";
import { TCustomerProduct } from "@/types/product";

const PlaceOrder = () => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loader, setLoader] = useState(true);
  const [changeLoading, setChangeLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const cart = useAppSelector((state) => state.product.cart);
  const user = useAppSelector((state) => state.user.user);
  console.log("Cart=>", cart);
  // const [selectedVariants, setSelectedVariants] = useState<{
  //   [key: string]: { variantId: string; price: number; credit: number };
  // }>({});
  // const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
  //   {}
  // );
  const getSelectedVariants = (
    variantId: string,
    product: TCustomerProduct
  ) => {
    const selectedVariant = product.variants.find(
      (variant) => variant._id === variantId
    );
    return selectedVariant;
  };

  useEffect(() => {
    if (cart) {
      setLoader(false);
    }
  }, [cart]);

  const handleBuyWithCredits = async (productId: string, variantId: string) => {
    if (!user) {
      redirectToLogin(router, pathname);
      return;
    }
    // swall confirmation
    const isConfirm = await Swal.fire({
      title: "Confirm Purchase",
      text: "Are you sure you want to purchase only this products in cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Purchase All",
    });
    if (isConfirm.isConfirmed) {
      try {
        const response = await instance.post(`/product/buyWithCredits`, {
          productBody: {
            productId,
            variantId,
          },
        });
        console.log(response);
        if (response.data.success) {
          notifySuccess("Product Purchased Successfully");
          dispatch(removeCartProduct(productId));
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
    } else {
      console.log("Purchase cancelled");
      notifyInfo("Purchase cancelled");
    }
  };

  const handleAllBuyWithCredits = async () => {
    if (!user) {
      redirectToLogin(router, pathname);
      return;
    }
    const isConfirm = await Swal.fire({
      title: "Confirm Purchase",
      text: "Are you sure you want to purchase all products in cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Purchase All",
    });

    if (isConfirm.isConfirmed) {
      try {
        const response = await instance.post(`/product/cart/buyWithCredits`);
        if (response.data.success) {
          dispatch(setCart([]));
          notifySuccess("Product Purchased Successfully");
          router.push("/user-profile/purchased-product");
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
    } else {
      console.log("Purchase cancelled");
      notifyInfo("Purchase cancelled");
    }
  };

  const handleRemoveCart = async (id: string) => {
    // swall confirmation
    const isConfirm = await Swal.fire({
      title: "Confirm Remove",
      text: "Are you sure you want to remove this product from cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    });
    if (isConfirm.isConfirmed) {
      if (!user) removeFromLocalStorageCart(id, dispatch);
      else removeItemFromCart(dispatch, id);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total: number, item) => {
      const selectedVariant = getSelectedVariants(
        item.variantId,
        item.productId
      );
      if (selectedVariant) {
        return total + selectedVariant.price;
      } else {
        const matchingVariant = item.productId?.variants?.find((variant: any) =>
          item.variantId.includes(variant._id)
        );
        return total + (matchingVariant ? matchingVariant.price : 0);
      }
    }, 0);
  };

  const calculateTotalCredit = () => {
    return cart.reduce((total: number, item) => {
      const selectedVariant = getSelectedVariants(
        item.variantId,
        item.productId
      );
      if (selectedVariant) {
        return total + selectedVariant?.credit;
      } else {
        const matchingVariant = item.productId?.variants?.find((variant: any) =>
          item.variantId.includes(variant._id)
        );
        return total + (matchingVariant ? matchingVariant.credit : 0);
      }
    }, 0);
  };

  useEffect(() => {
    setAmount(calculateTotalPrice());
    setTotalCredits(calculateTotalCredit());
  }, [cart]);

  const createOrderOption = (): OrderOption | null => {
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

  const handleSizeChange = async (
    productId: TCustomerProduct,
    variantId: string
  ) => {
    // const product = cart.find((item) => item.productId._id === productId);
    // if (product) {
    //   const variant = product.productId.variants.find(
    //     (v) => v._id === variantId
    //   );
    //   if (variant) {
    //     setSelectedVariants((prev) => ({
    //       ...prev,
    //       [productId]: {
    //         variantId,
    //         price: variant.price,
    //         credit: variant.credit,
    //       },
    //     }));
    //   }
    // }
    setChangeLoading(true);
    if (!user) {
      setSingleProductInLocalStorage({ productId, variantId }, dispatch);
    } else {
      await addProductToCart(dispatch, productId._id, variantId);
    }
    setChangeLoading(false);
  };
  const orderOption = createOrderOption();

  return (
    <div className=" min-h-screen flex justify-start flex-col  py-6 lg:mx-6 xl:mx-24 md:mx-4 sm:mx-4 ">
      <h1 className="text-2xl font-bold mb-4 sm:px-0 px-4">Shopping Cart</h1>

      <div className="block sm:hidden px-4">
        {cart?.map((item, index: number) => (
          <div
            key={index}
            className="relative w-full bg-white border-b text-black mb-4 rounded-lg overflow-hidden shadow-sm"
          >
            {/* Cross (X) Icon at the Top Left */}
            <span
              className="absolute top-2 right-2 text-webred cursor-pointer"
              onClick={() => handleRemoveCart(item.productId?._id)}
            >
              <RxCross2 size={24} />
            </span>

            {/* Card Content */}
            <div className="flex flex-col px-4 py-4">
              <div className="w-full gap-4">
                {/* Media Display */}
                <div className="flex gap-5 items-center">
                  <div className="w-1/3  rounded-lg overflow-hidden">
                    <Link
                      href={`/${item?.productId?.mediaType}/${item?.productId?.uuid}`}
                    >
                      {item?.productId.mediaType === "image" && (
                        <img
                          className="w-full h-24 object-cover rounded"
                          src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                          alt={item?.productId.title}
                        />
                      )}
                      {item?.productId.mediaType === "audio" && (
                        <img
                          className="w-full h-24 object-cover rounded"
                          src="/images/audioImage.png"
                          alt={item?.productId.title}
                        />
                      )}
                      {item?.productId.mediaType === "video" && (
                        <video
                          loop
                          muted
                          className="w-full h-24 object-cover rounded"
                        >
                          <source
                            src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${item?.productId.thumbnailKey}`}
                          />
                        </video>
                      )}
                    </Link>
                  </div>
                  {/* Product Info */}
                  <div className="w-2/3">
                    <h1 className="text-md font-bold capitalize mb-1">
                      {item?.productId.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {item?.productId.description}
                    </p>
                  </div>
                </div>
                {/* Size and Price */}
                <div className="mt-3 text-sm text-gray-700 flex justify-between items-center ">
                  {item.productId.mediaType !== "audio" && (
                    
                      <div className="text-md text-gray-600">
                        <select
                          disabled={changeLoading}
                          className="text-black border-1 text-xs border-gray-300 outline-none py-2 bg-gray-100 rounded-md"
                          value={
                            getSelectedVariants(item.variantId, item.productId)
                              ?._id || item.variantId
                          }
                          onChange={(e) =>
                            handleSizeChange(item.productId, e.target.value)
                          }
                        >
                          {item.productId.variants.map((variant) => (
                            <option key={variant._id} value={variant._id}>
                              {item.productId.mediaType === "video"
                                ? variant.metadata.resolution
                                : variant.metadata.dimension}{" "}
                              px
                            </option>
                          ))}
                        </select>
                      </div>
                   
                  )}

                  <div>
                    <span className="font-bold text-gray-800 flex items-center">
                      Price
                      <MdCurrencyRupee />
                      {getSelectedVariants(item.variantId, item.productId)
                        ?.price ||
                        item.productId?.variants.find((variant) =>
                          item.variantId.includes(variant._id)
                        )?.price}
                    </span>
                  </div>
                </div>

                {/*cridit and Buy with Credits Button */}
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">Credits:</span>{" "}
                    {getSelectedVariants(item.variantId, item.productId)
                      ?.credit ||
                      item.productId?.variants.find((variant) =>
                        item.variantId.includes(variant._id)
                      )?.credit}
                  </div>
                  <div>
                    <span
                      onClick={() =>
                        handleBuyWithCredits(
                          item?.productId._id,
                          item.variantId
                        )
                      }
                      className="text-webred border-2 border-webred hover:bg-webred hover:text-white cursor-pointer rounded-md px-3 py-1.5 text-sm"
                    >
                      Buy with Credits
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

         <div className="text-md py-2 flex-col text-black rounded-lg capitalize bg-[#F1F1F1] border-b border-gray-200 border-1 w-full ">
            
                <div className="border-none flex justify-between px-2 ">
                <div className="font-semibold flex gap-2 ">
                  <span>Total Credit: {totalCredits}</span>
                </div>
                  <div className="flex  items-center ">
                    <span className="font-semibold mr-2 whitespace-nowrap">
                      Total Price:
                    </span>
                    <span className="font-bold">
                      <MdCurrencyRupee />
                    </span>
                    <span>{amount}</span>
                  </div>
                </div>
                <div className=" py-4 border-none">
                  <div className="flex justify-start items-center gap-2 px-2 ">
                    <button
                      onClick={handleAllBuyWithCredits}
                      className="text-white px-4 py-2 rounded-md bg-webgreen text-md max-sm:text-lg hover:bg-webgreen-light transition-all whitespace-nowrap"
                    >
                      Pay With Credits
                    </button>
                    OR
                    {orderOption && <PayButton orderOption={orderOption} />}
                  </div>
                </div>
            </div>
      </div>

      {loader && (
        <div className="flex justify-center items-center min-h-screen">
          <SpinnerLoader />
        </div>
      )}
      {!loader && cart.length === 0 && (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 text-red-500 mb-4 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h18l-1.68 9.19a5.51 5.51 0 01-5.5 4.81H8.18a5.51 5.51 0 01-5.5-4.81L3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 16a4 4 0 01-8 0"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-6">
              It looks like you haven't added anything to your cart yet.
            </p>
            <button
              className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition"
              onClick={() => (window.location.href = "/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {!loader && cart.length > 0 && (
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-black sm:block hidden">
            <thead className="text-md py-2 text-black rounded-lg capitalize bg-[#F1F1F1] border-b border-gray-200 border-1 ">
              <tr className="">
                <th scope="col" className="px-6 py-3 border-none text-center">
                  Product
                </th>
                <th scope="col" className="px-6 py-3  border-none text-center">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-center border-none">
                  Price
                </th>{" "}
                <th scope="col" className="px-6 py-3 text-center border-none">
                  Credit Price
                </th>
                <th scope="col" className="px-6 py-3  border-none"></th>
              </tr>
            </thead>
            <tbody>
              {cart?.map((item, index: number) => (
                <tr key={index} className="w-full bg-white border-b text-black">
                  <td className="w-2/6 px-6 py-4 border-none sm:flex-col flex-col">
                    <Link
                      href={`/${item?.productId?.mediaType}/${item?.productId?.uuid}`}
                      className="flex flex-row items-start justify-start gap-4"
                    >
                      <div className="md:w-1/3 rounded-lg overflow-hidden flex justify-center items-center">
                        {item?.productId.mediaType === "image" && (
                          <img
                            className="sm:w-full sm:h-full h-10 w-32 object-cover"
                            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                            alt={item?.productId.title}
                          />
                        )}
                        {item?.productId.mediaType === "audio" && (
                          <img
                            className="w-full h-full object-cover"
                            src="/images/audioImage.png"
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
                              src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${item?.productId.thumbnailKey}`}
                            />
                          </video>
                        )}
                      </div>
                      <div className="sm:w-2/3 w-2/3  ">
                        <div className="flex flex-col justify-start items-start ">
                          <div className="text-md font-bold whitespace-nowrap">
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
                    </Link>
                  </td>
                  {item.productId.mediaType !== "audio" && (
                    <td className="w-1/6 px-6 py-4 border-none text-center">
                      <div className="text-md text-gray-600 mb-2 ">
                        <select
                          disabled={changeLoading}
                          className="text-black border-1 border-gray-300 outline-none px-4 py-2 bg-gray-100 rounded-md"
                          value={
                            getSelectedVariants(item.variantId, item.productId)
                              ?._id || item.variantId
                          }
                          onChange={(e) =>
                            handleSizeChange(item.productId, e.target.value)
                          }
                        >
                          {item.productId.variants.map((variant) => (
                            <option key={variant._id} value={variant._id}>
                              {item.productId.mediaType === "video"
                                ? variant.metadata.resolution
                                : variant.metadata.dimension}{" "}
                              px
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  )}

                  {item.productId.mediaType == "audio" && (
                    <td className="px-6 py-4 border-none text-center justify-center w-1/6 ">
                      <div className="text-black border-1 border-gray-300 outline-none mx-4 py-2 bg-gray-100 rounded-md">
                        <h2>Orignal</h2>
                      </div>
                    </td>
                  )}
                  <td className="w-1/6 px-6 py-4 border-none">
                    <div className="text-gray-600  justify-center items-center flex flex-row">
                      <span className="font-bold">
                        <MdCurrencyRupee />
                      </span>
                      {getSelectedVariants(item.variantId, item.productId)
                        ?.price ||
                        item.productId?.variants.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.price}
                    </div>
                  </td>
                  <td className="w-1/6 px-6 py-4 border-none">
                    <div className="text-gray-600  justify-center items-center flex flex-row">
                      {getSelectedVariants(item.variantId, item.productId)
                        ?.credit ||
                        item.productId?.variants.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.credit}
                    </div>
                  </td>
                  <td className="w-2/6 px-6 py-4 border-none ">
                    <div className="w-full flex justify-between px-5 items-center gap-4">
                      <span
                        onClick={() =>
                          handleBuyWithCredits(
                            item?.productId._id,
                            item.variantId
                          )
                        }
                        className=" hover:bg-webred hover:text-white text-webred border-1 border-webred cursor-pointer rounded-md px-4 py-2"
                      >
                        <div className="text-md whitespace-nowrap font-semibold">
                          Buy with Credits
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
                    <span className="font-semibold mr-2 whitespace-nowrap">
                      Total Price:{" "}
                    </span>
                    <span className="font-bold">
                      <MdCurrencyRupee />
                    </span>
                    <span>{amount}</span>
                  </div>
                </td>

                <td className="px-6 py-4 border-none justify-center text-center  ">
                  {totalCredits}{" "}
                </td>

                <td className="px-6 py-4 border-none">
                  <div className="flex justify-start items-center gap-4 px-4 ">
                    <button
                      onClick={handleAllBuyWithCredits}
                      className="text-white px-4 py-2 rounded-md bg-webgreen text-md max-sm:text-lg hover:bg-webgreen-light transition-all whitespace-nowrap"
                    >
                      Pay With Credits
                    </button>
                    OR
                    {orderOption && <PayButton orderOption={orderOption} />}
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
