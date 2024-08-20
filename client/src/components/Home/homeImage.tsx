import React from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsCartCheckFill, BsCart2 } from "react-icons/bs";
import { TfiDownload } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import { addCartItem } from "@/app/redux/feature/user/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { TCustomerProduct } from "@/types/product";
import {
  addAudioToCart,
  addImageToWishlist,
  removeAudioFromCart,
  removeAudioFromWishlist,
} from "@/app/redux/feature/product/image/api";
import { downloadProduct } from "@/app/redux/feature/product/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

const ImageGallery = ({ data }: { data: TCustomerProduct }) => {
  function truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  }

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleeWishlist = () => {
    if (data.isWhitelisted) {
      removeAudioFromWishlist(dispatch, data._id);
    } else {
      addImageToWishlist(dispatch, data._id, data.variants[0]._id);
    }
  };

  const handleCart = () => {
    if (data.isInCart) {
      removeAudioFromCart(dispatch, data._id);
    } else {
      addAudioToCart(dispatch, data._id, data.variants[0]._id);
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden group cursor-pointer">
      <div
        className="aspect-w-1 aspect-h-1"
        onClick={() => router.push(`/image/${data?.uuid}`)}
      >
        <img
          src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${data?.thumbnailKey}`}
          alt={`Image`}
          className="w-full h-72 object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white px-2 py-2 rounded">
          {truncateText(data?.description || "No description", 6)}
        </p>
      </div>
      <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          onClick={handleeWishlist}
          title={data.isWhitelisted ? "Remove from Saved" : "Save Image"}
          className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center"
        >
          {data.isWhitelisted ? (
            <IoMdHeart className="h-5 w-5 text-red-500" />
          ) : (
            <IoMdHeartEmpty className="h-5 w-5" />
          )}
          <p className="text-sm"> {data.isWhitelisted ? "Saved" : "Save"} </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white bg-black bg-opacity-50 px-2 py-2 flex items-center gap-1 rounded-3xl">
          <TfiDownload className="font-semibold" />
          <p
            className="text-small"
            onClick={() =>
              downloadProduct(dispatch, data.publicKey, data.title)
            }
          >
            Try
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {!data.isPurchased ? (
          <div
            title={data.isInCart ? "Remove from cart" : "Add to cart"}
            className={` p-2 ${
              data.isInCart ? "bg-red-500 text-white" : "bg-white text-black"
            } rounded-full`}
            onClick={handleCart}
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
