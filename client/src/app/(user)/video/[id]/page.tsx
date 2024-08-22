"use client";
import {
  addProductToCart,
  addProductToWishlist,
  clearSingleProductData,
  getSingleProduct,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/api";
import {} from "@/app/redux/feature/product/image/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCart2, BsCartCheckFill, BsChatRightHeart } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import Trending from "@/components/Video/trendingVideos";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

const Home = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const { videoData } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  console.log(selectedVariantId, "selectedVariantId");
  const params = useParams();
  const id = params.id as string | undefined;

  useEffect(() => {
    getVideo(dispatch, { mediaType: ["video"] });

    if (id) getSingleProduct(dispatch, id);
    return () => {
      clearSingleProductData(dispatch);
    };
  }, [id]);
 
  const dispatch = useAppDispatch();
  const {
    singleProduct: product,
    loading,
    cart,
  } = useAppSelector((state) => state.product);

  const existId = cart.filter((item) => item.productId._id === product?._id);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleeWishlist = () => {
    if (!product) return;

    if (product.isWhitelisted) {
      removeProductFromWishlist(dispatch, product._id);
    } else {
      addProductToWishlist(
        dispatch,
        product._id,
        selectedVariantId ? selectedVariantId : product.variants[0]._id
      );
    }
  };
  const isVariantInCart = (variantId: string) => {
    return cart.some((item) => item.variantId.includes(variantId));
  };
  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };

  const handleCart = (variant: string) => {
    if (!product || loading) return;
    if (product.isInCart && isVariantInCart(variant)) {
      removeProductFromCart(dispatch, product._id);
    } else {
      addProductToCart(dispatch, product._id, variant);
    }
  };
  return (
    <div className="main">
      <div className="flex items-center gap-4 px-4 py-0.5 bg-gray-100 border border-gray-300 rounded-md w-[90%] m-auto mt-4">
        <button className="md:flex items-center hidden  gap-2 text-black hover:bg-gray-200 rounded-md">
        <img src="/asset/28-camera-1.svg" alt="" />
          <span>Photos</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <img src="/asset/Rectangle 15.png" alt="" />
        <input
          type="text"
          placeholder="Search for Photos"
          className="flex-grow  py-2 bg-gray-100 rounded-md "
        />
        <IoSearchOutline className="h-6 w-6 cursor-pointer text-gray-400"/>
        <button className="md:flex items-center gap-4 text-gray-500 hidden  hover:text-black  rounded-md">
        <img src="/asset/Rectangle 15.png" alt="" />
          <img src="/asset/Union.png" alt="" />
          <span>Search by image</span>
        </button>
      </div>
      <div className="border-t border-b border-b-gray-400 border-t-gray-400 m-auto mt-5">
        <div className="flex md:flex-row flex-col  ">
          {product && (
            <>
              <div className="w-full md:w-[72%] pr-5 vidbg pl-5  md:pr-20 pt-10 gap-5 md:pl-20 border-r border-r-gray-400 flex flex-col">
                <div className="flex flex-row text-gray-700  justify-between items-center">
                  <div className="font-semibold text-lg">
                  {product.title}
                  </div>
                  <div className="flex-row flex gap-3">
                    <span
                    onClick={handleeWishlist}
                    title={
                      product.isWhitelisted ? "Remove from Saved" : "Save Image"
                    }
                    className=" bg-opacity-35 cursor-pointer px-3 py-2 border  border-gray-300 rounded-md flex gap-1 items-center"
                  >
                    {product.isWhitelisted ? (
                      <IoMdHeart className="h-5 w-5 text-red-500" />
                    ) : (
                      <IoMdHeartEmpty className="h-5 w-5" />
                    )}
                    <p className="text-sm">
                      {" "}
                      {product.isWhitelisted ? "Saved" : "Save"}{" "}
                    </p>
                    </span>
                     <span className=" flex font-medium rounded-md gap-2 border-gray-300 flex-row text-center p-2 border items-center">
                     <AiOutlineDownload size={20}/> Try
                    </span>
                  </div>
                </div>
                <video controls className="rounded-lg h-[20rem] md:h-[28rem] w-full object-cover">
                <source
                    src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
                />
                </video>
                <div>
                <h2 className="font-medium">Description</h2>
                <p className="text-sm">Stock Photo ID: {product._id}</p>
                <p className="text-sm">{product.description}</p>
              </div>
                <div className="mt-4">
                <h2 className="font-bold">Related keywords</h2>
                <div className="flex flex-wrap mt-2">
                  {product.tags.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 rounded-sm px-3 py-1 text-sm font-semibold mr-2 mb-2"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
            </div>
            
              </div>
              <div className="border-t border-t-gray-400 w-full md:w-[28%]  ">
                <div className=" p-8">
                <h3 className="font-semibold  text-gray-700 text-xl">
                  Purchase a License
                </h3>
                <div  className="text-xs py-2">
                  All Royalty-Free licenses include global use rights,comprehensive protection, and simple 
                  pricing with volume discounts available.
                </div>
                {product.variants.map((license, index) => (
                  <div key={index} className="border p-4  ">
                    <div className="flex justify-between">
                    <label
                        htmlFor={`license-${index}`}
                        className="block text-gray-600"
                      >
                        ${license.price}
                      </label>
                    </div>
                    <div className=" flex justify-between">
                      <div>{license.size}</div>
                      {isVariantPurchased(license._id) ? (
                        <>
                          <div
                            title={"Purchased Product"}
                            
                            className={` p-2 bg-red-500 text-white rounded-full`}
                          >
                            <BiSolidPurchaseTagAlt />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            title={
                              isVariantInCart(license._id)
                                ? "Remove from cart"
                                : "Add to cart"
                            }
                            className={` p-2 ${
                              isVariantInCart(license._id)
                                ? "bg-red-500 text-white cursor-pointer"
                                : "bg-white text-black  cursor-pointer"
                            } rounded-full`}
                            onClick={() => handleCart(license._id)}
                          >
                            {product.isInCart ? (
                              <BsCartCheckFill />
                            ) : (
                              <BsCart2 />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                </div>
                <div className="flex flex-col vidbg  border-t border-t-gray-400  justify-end items-start">
                  <div className="p-5">
                    <h2 className="font-bold">Detail</h2>
                    <div className="flex flex-row">
                    <span className="font-semibold mt-4">Tittle : </span><span className="font-light mt-4">{product.title}</span>
                    </div>
                    <div className="flex flex-row">
                    <span className="font-semibold mt-4">Description :</span> <span className="font-light mt-4"> {product.description}</span>
                    </div>
                    <div className="flex flex-row">
                    <span className="font-semibold mt-4">Categories : </span><span className="font-light mt-4 ">{product.category}</span>
                    </div>
                    <div className="flex flex-row items-center">
                    <div className="font-semibold mt-4">Tags : </div> 
                    {product.tags.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 mt-5 mx-1 text-gray-700 rounded-lg px-2 py-1 text-sm font-semibold mr-2 mb-2"
                    >
                      {keyword}
                    </span>
                    ))}
                    </div>
                    <div className="flex flex-row">
                    <span className="font-semibold mt-4">Categories : </span><span className="font-light mt-4">{product.category}</span>
                    </div>
                    <div className="flex flex-row">
                    <span className="font-semibold mt-4">Upload date :</span> <span className="font-light mt-4"> {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="py-10 lg:mx-24 md:mx-4 mx-4">
        <h2 className="text-xl font-semibold">Similar Videos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
              {videoData.map((data, index: number) => (
                <Trending key={index} data={data} />
              ))}
        </div>
        </div>
      <Footer />
    </div>
  );
};

export default Home;
