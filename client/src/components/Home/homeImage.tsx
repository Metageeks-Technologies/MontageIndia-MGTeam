import React from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsCartCheckFill, BsCart2 } from "react-icons/bs";
import { TfiDownload } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import { addCartItem } from "@/app/redux/feature/user/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { TCustomerProduct } from "@/types/product";
import { FaRegHeart } from "react-icons/fa";
import {
  addProductToCart,
  addProductToWishlist,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/audio/api";
import { downloadProduct } from "@/app/redux/feature/product/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { useState } from "react";
import { Spinner } from "@nextui-org/react";

const ImageGallery = ({
  data,
  productType = "imageData",
}: {
  data: TCustomerProduct;
  productType?: "audioData" | "imageData" | "videoData" | "similarProducts";
}) => {
  function truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleDownload = async () => {
    setLoading(true);
    await downloadProduct(dispatch, data.publicKey, data.title);
    setLoading(false);
  };

  const handleeWishlist = () => {
    if (data.isWhitelisted) {
      removeProductFromWishlist(dispatch, data._id, productType);
    } else {
      addProductToWishlist(
        dispatch,
        data._id,
        data.variants[0]._id,
        productType
      );
    }
  };

  const handleCart = () => {
    if (data.isInCart) {
      removeProductFromCart(dispatch, data._id, productType);
    } else {
      addProductToCart(dispatch, data._id, data.variants[0]._id, productType);
    }
  };

  return (
    <div className="relative rounded overflow-hidden group cursor-pointer">
      <div
        className="mb-2 break-inside-avoid"
        onClick={() => router.push(`/image/${data?.uuid}`)}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${data?.thumbnailKey}`}
          alt={`Image`}
          className="w-auto h-auto object-cover rounded"
        />
      </div>
      {/* <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white px-2 py-2 rounded">
          {truncateText(data?.title || "No description", 6)}
        </p>
      </div> */}
      {/* <div className="absolute bottom-0 left-0 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white bg-black bg-opacity-50 px-2 py-2 flex items-center gap-1 rounded-3xl">
                    <img src="/asset/Group 19.svg" alt="" />
                    <p className="text-small">Similar</p>
                  </div>
                </div> */}

      <div className="absolute bottom-1 right-9 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleeWishlist();
          }}
          title={data.isWhitelisted ? "Remove from Saved" : "Save Image"}
          className="text-white bg-black bg-opacity-35 px-2 py-1 rounded-full flex gap-1 items-center"
        >
          {data.isWhitelisted ? (
            <IoMdHeart className="h-6 w-5 text-red-500" />
          ) : (
            <FaRegHeart className="h-6 w-5" />
          )}
          {/* <p className="text-sm"> {data.isWhitelisted ? "" : ""} </p> */}
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        className="absolute bottom-1 right-0 m-2 opacity-5 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="text-white h-8 w-8 bg-red-500 p-2 flex items-center gap-1 rounded-full">
          {!loading ? (
            <>
              <TfiDownload className="font-semibold" />
            </>
          ) : (
            <Spinner className="w-4" color="current" />
          )}
        </div>
      </div>
      <div className="absolute bottom-1 right-20 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!data.isPurchased ? (
          <div
            title={data.isInCart ? "Remove from cart" : "Add to cart"}
            className={` p-2 ${
              data.isInCart ? "bg-red-500 text-white" : "bg-white text-black"
            } rounded-full`}
            onClick={(e) => {
              e.stopPropagation();
              handleCart();
            }}
          >
            {data.isInCart ? <BsCartCheckFill /> : <BsCart2 />}
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

export default ImageGallery;
