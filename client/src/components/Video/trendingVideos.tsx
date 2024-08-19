"use client";
import { TCustomerProduct } from "@/types/product";
import React from "react";
import { BsCartCheckFill, BsCart2 } from "react-icons/bs";
import { GoVideo } from "react-icons/go";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { TfiDownload } from "react-icons/tfi";
import { useAppDispatch } from "@/app/redux/hooks";
import {
  getVideo,
  addVideoToCart,
  addVideoToWishlist,
  removeVideoFromWishlist,
  removeVideoFromCart,
} from "@/app/redux/feature/product/video/api";

const Trending = ({ data }: { data: TCustomerProduct }) => {
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

  const dispatch = useAppDispatch();

  const handleeWishlist = () => {
    if (data.isWhitelisted) {
      removeVideoFromWishlist(dispatch, data._id);
    } else {
      addVideoToWishlist(dispatch, data._id, data.variants[0]._id);
    }
  };

  const handleCart = () => {
    if (data.isInCart) {
      removeVideoFromCart(dispatch, data._id);
    } else {
      addVideoToCart(dispatch, data._id, data.variants[0]._id);
    }
  };

  return (
    <div
      className="relative rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-w-1 aspect-h-1">
        <video loop muted className="w-full h-64 object-cover">
          <source
            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${data.thumbnailKey}`}
          />
        </video>
      </div>
      <div className="absolute m-2 top-0 left-0 flex gap-2 ">
        <GoVideo className="text-white h-6 w-6" />
        <p className="text-white">4k 0:17</p>
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
        <div className="text-white bg-black bg-opacity-50  px-2 py-2 flex items-center gap-1 rounded-3xl">
          <TfiDownload className="font-semibold" />
          <p className="text-small">Try</p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          title={data.isInCart ? "Remove from cart" : "Add to cart"}
          className={` p-2 ${
            data.isInCart ? "bg-red-500 text-white" : "bg-white text-black"
          } rounded-full`}
          onClick={handleCart}
        >
          {data.isInCart ? <BsCartCheckFill /> : <BsCart2 />}
        </div>
      </div>
    </div>
  );
};

export default Trending;
