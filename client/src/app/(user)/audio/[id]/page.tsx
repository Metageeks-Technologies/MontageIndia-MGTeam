"use client";
import {
  clearSingleProductData,
  getSingleProduct,
  addProductToCart,
  addProductToWishlist,
  removeProductFromCart,
  removeProductFromWishlist,
} from "@/app/redux/feature/product/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Searchbar from "@/components/searchBar/search";
import DetailWaveform from "@/components/Home/DetailWaveForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { BsCart2, BsCartCheckFill } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import Trending from "@/components/Video/trendingVideos";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { FiDownload } from "react-icons/fi";
import { Spinner } from "@nextui-org/react";
import { downloadProduct } from "@/app/redux/feature/product/api";
import Footer from "@/components/Footer";
import Waveform from "@/components/Home/AudioWaveForm";
import { getAudio } from "@/app/redux/feature/product/audio/api";

const page = () => {
  const params = useParams();
  const id = params.id as string | undefined;

  const dispatch = useAppDispatch();
  const { audioData, page, totalNumOfPage } = useAppSelector(
    (state) => state.product
  );
  useEffect(() => {
    getAudio(dispatch, {
      page: page,
      productsPerPage: 4,
      mediaType: ["audio"],
    });
  }, [page]);

  useEffect(() => {
    if (id) getSingleProduct(dispatch, id);
    getAudio(dispatch, {
      page: page,
      productsPerPage: 4,
      mediaType: ["audio"],
    });
    return () => {
      clearSingleProductData(dispatch);
    };
  }, [id]);

  const {
    singleProduct: product,
    loading,
    cart,
  } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };
  const isVariantInCart = (variantId: string) => {
    return cart.some((item) => item.variantId.includes(variantId));
  };

  const handleCart = (variant: string) => {
    if (!product || loading) return;
    if (product.isInCart && isVariantInCart(variant)) {
      removeProductFromCart(dispatch, product._id);
    } else {
      addProductToCart(dispatch, product._id, variant);
    }
  };

  const handleeWishlist = () => {
    if (!product) return;

    if (product.isWhitelisted) {
      removeProductFromWishlist(dispatch, product._id);
    } else {
      addProductToWishlist(dispatch, product._id, product.variants[0]._id);
    }
  };

  const [downloading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!product) return;
    setLoading(true);
    await downloadProduct(dispatch, product.publicKey, product.title);
    setLoading(false);
  };
  if (!product) {
    return <div></div>;
  }

  return (<>
       <Searchbar/>
       <div className="bg-white">
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
      <hr className="mt-5" />
      <div className="w-full border-y-[1px] flex lg:flex-row md:flex-col ">
        <div className="lg:w-8/12 md:w-full w-full border-e-[2px] px-20 pb-10   bg-gray-100">
          <div className="flex flex-row text-gray-700  mt-4 justify-between items-center">
            <div className="font-semibold text-lg">{product.title}</div>
            <div className="flex-row flex gap-3">
              <span
                onClick={handleeWishlist}
                title={
                  product.isWhitelisted ? "Remove from Saved" : "Save Image"
                }
                className=" bg-opacity-35 bg-white cursor-pointer px-3 py-2 border font-medium  border-gray-300 rounded-md flex gap-1 items-center"
              >
                {product.isWhitelisted ? (
                  <IoMdHeart className="h-5 w-5 text-red-500" />
                ) : (
                  <IoMdHeartEmpty className="h-5 w-5" />
                )}
                <p> {product.isWhitelisted ? "Saved" : "Save"} </p>
              </span>
              <span
                onClick={handleDownload}
                className=" flex font-medium bg-white rounded-md gap-2 border-gray-300 flex-row text-center p-2 border items-center"
              >
                {!downloading ? (
                  <>
                    <FiDownload className="font-semibold" />
                    <p className="text-small">Try</p>
                  </>
                ) : (
                  <Spinner label="" color="current" />
                )}
              </span>
            </div>
          </div>
          <div className="my-4">
            {product && <DetailWaveform product={product} />}
            <div className="lg:w-[50rem] md:w-[35rem] w-[22rem] mt-2">
              <h2 className="font-bold">Description</h2>
              <p className="text-sm text-neutral-700">
                Stock Photo ID: {product._id}
              </p>
              <p className="text-sm">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="lg:w-4/12 md:w-full lg:px-0 md:px-16  flex   flex-col bg-gray-100">
          <div className="border-b-[2px]  w-full h-80 py-2 lg:px-8 bg-white">
            {product && (
              <div className="w-[26rem] mt-3 px-8">
                <h3 className="font-semibold text-xl">
                  Music Standard License
                </h3>
                <p className=" mt-1 text-neutral-700">
                  All Royalty-Free licences include global use rights,
                  comprehensive protection, and simple pricing with volume
                  discounts available
                </p>
                {product.variants.map((license, index) => (
                  <div
                    key={index}
                    className="border rounded p-4 mt-5 flex justify-between items-center hover:bg-[#F4F4F4] cursor-pointer"
                  >
                    <div>
                      <label
                        htmlFor={`license-${index}`}
                        className="block text-gray-600"
                      >
                        ${license.price}
                      </label>
                      <div>{license.size}</div>
                    </div>
                    <div className=" flex justify-between ">
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
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
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
            )}
          </div>
          <div>
            <div className=" bg-gray-100 lg:px-8 py-4">
              {product && (
                <div className="  rounded-md w-full">
                  <h2 className="text-lg font-semibold mb-1">Details</h2>
                  <div className="space-y-2">
                    <div className="flex lg:justify-start md:justify-between">
                      <span className="font-medium w-32">Title:</span>
                      <p className="text-blue-600 hover:underline">
                        {product.title}
                      </p>
                    </div>
                    <div className="flex  lg:justify-start md:justify-between">
                      <span className="font-medium w-32">Category:</span>
                      <p className="">{product.category}</p>
                    </div>
                    <div className="flex  lg:justify-start md:justify-between">
                      <span className="font-medium w-32">Upload date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex  lg:justify-start md:justify-between">
                      <span className="font-medium w-32">Location:</span>
                      <span>India</span>
                    </div>
                    <div className="flex  lg:justify-start md:justify-between">
                      <span className="font-medium w-32">Format: </span>
                      <span className="text-sm text-neutral-600">
                        6725 × 4286 px
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className=" overflow-y-auto mt-10 w-[90%] m-auto ">
        <h1 className="text-xl font-semibold mb-4">More item by MoosBeat</h1>
          {audioData.map((product, index) => (
          
            <Waveform key={index} product={product} />
          
          ))}
      </div> */}

      <div className="w-[90%] m-auto mb-4">
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
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
    </>
  );
};

export default page;
