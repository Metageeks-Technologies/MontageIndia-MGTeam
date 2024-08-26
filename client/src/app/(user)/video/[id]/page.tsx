"use client";
import {
  addProductToCart,
  addProductToWishlist,
  clearSingleProductData,
  downloadProduct,
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
import { CiHeart, CiShare2 } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import Trending from "@/components/Video/trendingVideos";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { LuIndianRupee } from "react-icons/lu";
import { FaShareAlt } from "react-icons/fa";
import CustomShareButton from "@/components/Home/gallary/share";
import Searchbar from "@/components/searchBar/search";
import { formatSecToMin } from "@/utils/DateFormat";

const Home = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [cartLoadingMap, setCartLoadingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [tryLoading, setTryLoading] = useState(false);
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

  const handleeWishlist = async () => {
    if (wishlistLoading || !product || loading) return;

    setWishlistLoading(true);
    try {
      if (product.isWhitelisted) {
        await removeProductFromWishlist(dispatch, product._id);
      } else {
        await addProductToWishlist(
          dispatch,
          product._id,
          selectedVariantId ? selectedVariantId : product.variants[0]._id
        );
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleCart = async (variantId: string) => {
    if (cartLoadingMap[variantId] || !product || loading) return;

    setCartLoadingMap((prev) => ({ ...prev, [variantId]: true }));
    try {
      if (product.isInCart && isVariantInCart(variantId)) {
        await removeProductFromCart(dispatch, product._id);
      } else {
        await addProductToCart(dispatch, product._id, variantId);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setCartLoadingMap((prev) => ({ ...prev, [variantId]: false }));
    }
  };

  const handleTry = async () => {
    if (tryLoading) return;

    setTryLoading(true);
    try {
      if (product)
        await downloadProduct(dispatch, product.publicKey, product.title);
    } catch (error) {
      console.error("Error trying the product:", error);
    } finally {
      setTryLoading(false);
    }
  };

  const isVariantInCart = (variantId: string) => {
    return cart.some((item) => item.variantId.includes(variantId));
  };
  const capitalizeFirstLetter = (str: string | null | undefined): string => {
    if (!str) {
      return ""; // Return an empty string if str is null or undefined
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };

  return (
    <>
      <Searchbar />
      <div className="main">
        {/* <div className="flex items-center gap-4 px-4 py-0.5 bg-gray-100 border border-gray-300 rounded-md w-[90%] m-auto mt-4">
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
      </div> */}
        <div className="border-t border-b border-b-gray-400 border-t-gray-400 m-auto mt-5">
          <div className="flex md:flex-row flex-col  ">
            {product && (
              <>
                <div className="w-full md:w-[72%] pr-5 vidbg pl-5  md:pr-20 pt-10 gap-5 md:pl-20 border-r border-r-gray-400 flex flex-col">
                  <div className="flex flex-row text-gray-700  justify-between items-center">
                    <div className="font-semibold text-lg">{product.title}</div>
                    <div className="flex gap-3 ">
                      <button
                        onClick={handleeWishlist}
                        disabled={wishlistLoading}
                        title={
                          product.isWhitelisted
                            ? "Remove from Saved"
                            : "Save Image"
                        }
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3"
                      >
                        {wishlistLoading ? (
                          <span className="h-5 w-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : product.isWhitelisted ? (
                          <IoMdHeart className="h-5 w-5 text-red-500" />
                        ) : (
                          <IoMdHeartEmpty className="h-5 w-5" />
                        )}
                        <span>{product.isWhitelisted ? "Saved" : "Save"}</span>
                      </button>
                      <CustomShareButton />
                      <button
                        onClick={handleTry}
                        disabled={tryLoading}
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3"
                      >
                        {tryLoading ? (
                          <span className="h-5 w-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : (
                          <AiOutlineDownload className="h-5 w-5" />
                        )}
                        <span>Try</span>
                      </button>
                    </div>
                  </div>
                  <video
                    controls
                    className="rounded-lg h-[20rem] md:h-[28rem] w-full object-cover"
                  >
                    <source
                      src={` ${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.publicKey}`}
                    />
                  </video>

                  <div className="lg:w-[50rem] pb-7 md:w-[35rem] w-[22rem] mt-2">
                    <h2 className="font-bold">Description</h2>
                    <p className="text-sm text-neutral-700">
                      Stock Photo ID: {product._id}
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </div>
                <div className="border-t vidbg border-t-gray-400 md:border-t-0 w-full md:w-[28%]  ">
                  <div className="p-8 bg-white ">
                    <h3 className="font-semibold  text-gray-700 text-xl">
                      Purchase a License
                    </h3>
                    <div className="text-xs py-2">
                      All Royalty-Free licenses include global use
                      rights,comprehensive protection, and simple pricing with
                      volume discounts available.
                    </div>
                    {product.variants.map((license, index) => (
                      <div
                        key={index}
                        className={`border w-[90%] cursor-pointer hover:bg-[#F4F4F4] p-2 flex flex-col ${
                          index === 0 ? "rounded-t-md" : ""
                        } ${
                          index === product.variants.length - 1
                            ? "rounded-b-md"
                            : ""
                        }`}
                        onClick={() => handleCart(license._id)}
                      >
                        <div className="flex flex-row justify-between ">
                          <div className="flex flex-row items-center gap-3">
                            {index === 0 ? (
                              <img
                                src="/asset/full-hd.svg"
                                className="w-20"
                                alt="Full HD"
                              />
                            ) : (
                              <img
                                src="/asset/hd.svg"
                                className="w-10 h-5"
                                alt="HD"
                              />
                            )}
                          </div>
                          <div>
                            {isVariantPurchased(license._id) ? (
                              <div
                                title="Purchased Product"
                                className="p-2 items-center flex flex-row gap-1 bg-red-500 text-white rounded-full"
                              >
                                <LuIndianRupee /> {license.price}{" "}
                                <BiSolidPurchaseTagAlt />
                              </div>
                            ) : (
                              <div
                                title={
                                  isVariantInCart(license._id)
                                    ? "Remove from cart"
                                    : "Add to cart"
                                }
                                className={`p-2 items-center flex flex-row gap-1 text-black rounded-full`}
                              >
                                <LuIndianRupee />
                                {license.price}
                                <span
                                  className={`p-2 items-center ${
                                    isVariantInCart(license._id)
                                      ? "bg-webred text-white"
                                      : "bg-white text-black"
                                  } rounded-full`}
                                >
                                  {cartLoadingMap[license._id] ? (
                                    <span className="h-5 w-5 flex items-center justify-center">
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
                                    </span>
                                  ) : isVariantInCart(license._id) ? (
                                    <BsCartCheckFill className="h-5 w-5" />
                                  ) : (
                                    <BsCart2 className="h-5 w-5" />
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="items-center flex text-sm flex-row">
                          {license?.metadata?.resolution} px
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col vidbg  border-t border-t-gray-400  justify-end items-start">
                    {product && (
                      <div className=" p-8  rounded-md w-full">
                        <h2 className="text-lg font-semibold ">Details</h2>
                        <div className="space-y-1 text-base">
                          <div className="flex lg:justify-start w-full md:justify-between ">
                            <span className="font-medium w-[35%]">Title:</span>
                            <span className="text-violet-600 capitalize text-sm w-[65%]    hover:underline">
                              {product?.title}
                            </span>
                          </div>
                          <div className="flex  lg:justify-start w-full md:justify-between">
                            <span className="font-medium w-[35%]">
                              Resolutions:
                            </span>
                            <span className="flex text-neutral-600 text-sm  gap-2">
                              {product.variants.map((variant, index) => (
                                <span className="w-[65%] whitespace-nowrap ">
                                  {variant.metadata?.resolution} px{" "}
                                  {index !== product.variants.length - 1 && ","}
                                </span>
                              ))}
                            </span>
                          </div>
                          <div className="flex  lg:justify-start w-full md:justify-between">
                            <span className="font-medium w-[35%]">
                              Bit Rate:
                            </span>
                            <span className="flex text-neutral-600 text-sm  gap-2">
                              {product.variants.map((variant, index) => (
                                <span className="w-[65%] whitespace-nowrap ">
                                  {variant.metadata?.bitrate} Mbps{" "}
                                  {index !== product.variants.length - 1 && ","}
                                </span>
                              ))}
                            </span>
                          </div>
                          <div className="flex  lg:justify-start w-full md:justify-between">
                            <span className="font-medium w-[35%]">
                              Frame Rate:
                            </span>
                            <span className="flex text-neutral-600 text-sm  gap-2">
                              {product.variants.map((variant, index) => (
                                <span className="w-[65%] whitespace-nowrap">
                                  {variant.metadata?.frameRate} Hz{" "}
                                  {index !== product.variants.length - 1 && ","}
                                </span>
                              ))}
                            </span>
                          </div>
                          <div className="flex  w-full lg:justify-start md:justify-between">
                            <span className="font-medium w-[35%]">Format:</span>
                            <span className="text-sm capitalize text-neutral-600 w-[65%]">
                              {product?.variants[0].metadata?.format}
                            </span>
                          </div>
                          <div className="flex  w-full lg:justify-start md:justify-between">
                            <span className="font-medium w-[35%]">
                              Video Length:
                            </span>
                            <span className="text-sm capitalize text-neutral-600 w-[65%]">
                              {formatSecToMin(
                                Math.floor(product?.length || 0) || 0
                              )} min

                            </span>
                          </div>
                          <div className="flex lg:justify-start w-full md:justify-between ">
                            <span className="font-medium w-[35%]">
                              Categories:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {product?.category.map((category, index) => (
                                <span className="text-violet-600 whitespace-nowrap capitalize text-sm w-[65%]    hover:underline">
                                  {category}{" "}
                                  {index !== product.variants.length - 1 && ","}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
          {product && (
            <div>
              <div className="mt-8">
                <h2 className="font-bold text-lg">Related keywords</h2>
                <div className="flex gap-3 mt-2">
                  {product.tags.map((keyword, index) => (
                    <span key={index} className="">
                      <button className="border rounded-md py-1 px-4 flex gap-1 items-center">
                        <IoSearchOutline className="h-5 w-5" />
                        {keyword}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-8 mb-3">
                <h1 className="font-semibold text-lg">Category</h1>
                <button className="border rounded-md py-1 px-4 mt-2">
                  {product.category}
                </button>
                {/* <p>Upload date: {new Date().toLocaleDateString()}</p> */}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
