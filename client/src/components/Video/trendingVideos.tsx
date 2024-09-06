"use client";
import { TCustomerProduct } from "@/types/product";
import React, { useState } from "react";
import { BsCartCheckFill, BsCart2 } from "react-icons/bs";
import { GoVideo } from "react-icons/go";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { TfiDownload } from "react-icons/tfi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/audio/api";
import { useRouter, usePathname } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import { Spinner } from "@nextui-org/react";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import {
  downloadProduct,
  removeItemFromLocalStorage,
  setCartInLocalStorage,
} from "@/app/redux/feature/product/api";
import { formatSecToMin } from "@/utils/DateFormat";
import { notifyWarn } from "@/utils/toast";
import { redirectToLogin } from "@/utils/redirectToLogin";

const Trending = ({
  data,
  productType = "videoData",
}: {
  data: TCustomerProduct;
  productType?: "audioData" | "imageData" | "videoData" | "similarProducts";
}) => {
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    await downloadProduct(dispatch, data?.publicKey, data?.title);
    setLoading(false);
  };
  const { user } = useAppSelector((state) => state.user);
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.play();
    }
  };
  const handleMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
    }
  };

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const handleeWishlist = async () => {
    if (!user) {
      redirectToLogin(router, pathname);
      return;
    }
    if (wishlistLoading) {
      notifyWarn("Action in progress. Please wait.");
      return;
    }

    setWishlistLoading(true);
    try {
      if (data.isWhitelisted) {
        await removeProductFromWishlist(dispatch, data._id, productType);
      } else {
        await addProductToWishlist(
          dispatch,
          data._id,
          data.variants[0]._id,
          productType
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      notifyWarn("Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCart = async () => {
    if (!user && !data.isInCart) {
      setCartInLocalStorage(
        { productId: data, variantId: data.variants[0]._id },
        dispatch,
        productType
      );
    }
    if (!user && data.isInCart) {
      removeItemFromLocalStorage(data._id, dispatch, productType);
    }
    if (cartLoading) {
      notifyWarn("Action in progress. Please wait.");
      return;
    }

    setCartLoading(true);
    try {
      if (data.isInCart) {
        await removeProductFromCart(dispatch, data._id, productType);
      } else {
        await addProductToCart(
          dispatch,
          data._id,
          data.variants[0]._id,
          productType
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      notifyWarn("Failed to update cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div
      className="relative rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(`/video/${data?.uuid}`)}
    >
      <div className="aspect-w-1 aspect-h-1">
        <video loop muted className="w-full h-64 object-cover">
          <source
            src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${data.thumbnailKey}`}
          />
        </video>
      </div>
      <div className="absolute opacity-100  justify-center  top-1 left-1 gap-2 flex flex-row text-white m-2   transition-opacity duration-300">
        <span className=" pt-1 ">
          <img src="/asset/video.svg" alt="Hd " />
        </span>
        <span>FHD</span>
        <span>{formatSecToMin(Math.floor(data?.length || 0) || 0)}</span>
        <span className="pt-[2px] opacity-5 group-hover:opacity-100 ">|</span>
        <span className="opacity-5 group-hover:opacity-100 items-center text-start flex ">
          {data.title.substring(0, 23)}...
        </span>
      </div>
      <div className="absolute bottom-1 right-9 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleeWishlist();
          }}
          title={data.isWhitelisted ? "Remove from Saved" : "Save Image"}
          className="text-white bg-black bg-opacity-35 px-2 py-1 rounded-full flex gap-1 items-center"
        >
          {wishlistLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : data.isWhitelisted ? (
            <IoMdHeart className="h-6 w-5 text-red-500" />
          ) : (
            <FaRegHeart className="h-6 w-5" />
          )}
          {/* <p className="text-sm"> {data?.isWhitelisted ? "" : ""} </p> */}
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!loading) {
            handleDownload();
          } else {
            notifyWarn("Product is already downloading");
          }
        }}
        className="absolute bottom-1 right-0 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="text-white h-8 w-8 bg-red-500 p-2 flex items-center gap-1 rounded-full">
          {!loading ? (
            <>
              <TfiDownload className="font-semibold" />
            </>
          ) : (
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </div>
      </div>
      <div className="absolute bottom-1 right-20 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!data.isPurchased ? (
          <div
            title={data.isInCart ? "Remove from cart" : "Add to cart"}
            className={`p-2 ${
              data.isInCart ? "bg-red-500 text-white" : "bg-white text-black"
            } rounded-full`}
            onClick={(e) => {
              e.stopPropagation();
              handleCart();
            }}
          >
            {cartLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : data.isInCart ? (
              <BsCartCheckFill />
            ) : (
              <BsCart2 />
            )}
          </div>
        ) : (
          <div
            title={"Purchased Product"}
            className={` p-2 bg-red-500 text-white rounded-full`}
          >
            <BiSolidPurchaseTagAlt />
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
