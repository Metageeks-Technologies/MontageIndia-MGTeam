"use client";
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  MdDeleteForever,
  MdCurrencyRupee,
  MdShoppingCart,
} from "react-icons/md";
import { AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Button, Badge } from "@nextui-org/react";
import { removeCartItem } from "@/app/redux/feature/user/api";
import { FaRegFaceSadTear } from "react-icons/fa6";
import Link from "next/link";
import {
  removeFromLocalStorageCart,
  removeItemFromCart,
} from "@/app/redux/feature/product/api";
import { LuIndianRupee } from "react-icons/lu";
import {FaCoins} from "react-icons/fa";
function CartPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.product.cart);
  const user = useAppSelector((state) => state.user.user);
  const handleRemoveCart = (id: string, variantId: string) => {
    if (!user) {
      removeFromLocalStorageCart(id, dispatch);
      return;
    }
    removeItemFromCart(dispatch, id);
  };
  const limitWords = (text: string, limit: number) => {
    if (!text) {
      return "...";
    }
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupElement = document.getElementById("cart-popup");
      if (
        popupElement &&
        !popupElement.contains(event.target as Node) &&
        isOpen
      ) {
        // setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button disabled={isOpen} onClick={() => setIsOpen(true)}>
        <Badge
          color="danger"
          className={`${cart.length > 0 ? " text-xs" : "hidden"}`}
          content={cart.length}
          shape="circle"
        >
          <AiOutlineShoppingCart className="text-gray-700 cursor-pointer w-6 h-6 transition-transform duration-200 ease-in-out hover:scale-110 -700 mt-1" />
        </Badge>
      </button>
      <div
        id="cart-popup"
        className={`${
          !isOpen
            ? "hidden"
            : "absolute  shadow-xl bg-white rounded-md sm:w-[30rem] sm:max-h-[22rem] w-[25rem]  top-16 right-0 md:right-14  z-50"
        }`}
      >
        <div className=" rounded-md  bg-white  justify-self-end sm:w-full sm:max-w-2xl ">
          <div className="flex justify-between pb-5 rounded-t-md p-3 px-7  bg-webred-light  items-center ">
            <h2 className="text-base leading-6 font-bold">My Cart</h2>
            <AiOutlineClose
              className="text-gray-700   cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          {cart && cart.length > 0 ? (
            <div className="max-h-56  p-3  overflow-y-scroll">
              {cart.map((item, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b border-slate-200"
                >
                  <div className="flex w-[70%] items-center">
                    {item?.productId?.mediaType === "image" && (
                      <img
                        className="w-[74px] h-14 rounded-md mr-4"
                        src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                        alt={item?.productId.title}
                      />
                    )}
                    {item?.productId?.mediaType === "audio" && (
                      <img
                        className="w-[74px] h-14 rounded-md mr-4"
                        src="/images/audioImage.png"
                        alt={item?.productId.title}
                      />
                    )}
                    {item?.productId?.mediaType === "video" && (
                      <div>
                        <video
                          loop
                          muted
                          className="w-[74px] h-14 rounded-md mr-4 object-cover"
                        >
                          <source
                            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${item?.productId.thumbnailKey}`}
                          />
                        </video>
                      </div>
                    )}
                    <span className="flex flex-col justify-start  capitalize  text-base font-normal ">
                      <span>{limitWords(item.productId?.title, 2)}</span>

                      <span className="text-gray-500 flex flex-row items-center">
                        <LuIndianRupee />
                        {
                          item?.productId?.variants?.find((variant: any) =>
                            item?.variantId?.includes(variant._id)
                          )?.price
                        }
                        <span className="text-sm text-neutral-600 gap-1 flex items-center justify-center"> 
                          {" /"}
                          <FaCoins />
                          {
                          item?.productId?.variants?.find((variant: any) =>
                            item?.variantId?.includes(variant._id)
                          )?.credit
                        }
                        </span>
                      </span>
                    </span>
                  </div>
                  <div className="flex w-[30%] gap-2 text-sm flex-row justify-between font-light  items-center">
                    {item?.productId?.mediaType === "image" && (
                      <span className=" whitespace-nowrap">
                        {item.productId?.variants?.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.metadata?.dimension +
                          " " +
                          "px"}
                      </span>
                    )}
                    {item?.productId?.mediaType === "audio" && (
                      <span className=" whitespace-nowrap">
                        {item.productId?.variants?.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.metadata.bitrate +
                          " " +
                          "kbps"}
                      </span>
                    )}
                    {item?.productId?.mediaType === "video" && (
                      <span className=" whitespace-nowrap">
                        {item.productId?.variants?.find((variant: any) =>
                          item.variantId.includes(variant._id)
                        )?.metadata?.resolution +
                          " " +
                          "px"}
                      </span>
                    )}

                    <span
                      className="text-red-500   mr-1 cursor-pointer"
                      onClick={() => {
                        handleRemoveCart(
                          item.productId?._id,
                          item.variantId[0]
                        );
                      }}
                    >
                      <AiOutlineClose />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="items-center flex-col justify-center pt-10 text-cart flex m-auto">
              <FaRegFaceSadTear size={30} />
              <p>No item present on the cart </p>
            </div>
          )}
        </div>
        <div className=" flex justify-center py-5 items-center">
          <Link
            href="/order"
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 font-semibold text-white rounded-lg bg-webred"
          >
            Place Order
          </Link>
        </div>
      </div>
    </>
  );
}

export default CartPopup;
