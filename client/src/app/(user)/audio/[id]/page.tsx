"use client";
import
{
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
import { formatSecToMin } from "@/utils/DateFormat";
import { notifyWarn } from "@/utils/toast";
import CustomShareButton from "@/components/Home/gallary/share";

const page = () =>
{
  const params = useParams();
  const id = params.id as string | undefined;
  const [ cartLoading, setCartLoading ] = useState( false );
  const [ wishlistLoading, setWishlistLoading ] = useState( false );
  const [ tryLoading, setTryLoading ] = useState( false );
  const dispatch = useAppDispatch();
  const { audioData, similarProducts, page, totalNumOfPage } = useAppSelector(
    ( state ) => state.product
  );
  useEffect( () =>
  {
    getAudio( dispatch, {
      page: page,
      productsPerPage: 4,
      mediaType: [ "audio" ],
    } );
  }, [ page ] );

  useEffect( () =>
  {
    if ( id ) getSingleProduct( dispatch, id );
    getAudio( dispatch, {
      page: page,
      productsPerPage: 4,
      mediaType: [ "audio" ],
    } );
    return () =>
    {
      clearSingleProductData( dispatch );
    };
  }, [ id ] );

  const {
    singleProduct: product,
    loading,
    cart,
  } = useAppSelector( ( state ) => state.product );
  const { user } = useAppSelector( ( state ) => state.user );

  const isVariantPurchased = ( variantId: string ) =>
  {
    return user?.purchasedProducts.some( ( item ) =>
      item.variantId.includes( variantId )
    );
  };
  const isVariantInCart = ( variantId: string ) =>
  {
    return cart.some( ( item ) => item.variantId.includes( variantId ) );
  };

  // const handleCart = (variant: string) => {
  //   if (!product || loading) return;
  //   if (product.isInCart && isVariantInCart(variant)) {
  //   removeProductFromCart(dispatch, product._id);
  // } else {
  //   addProductToCart(dispatch, product._id, variant);
  //   }
  // };

  // const handleeWishlist = () => {
  //   if (!product) return;

  //   if (product.isWhitelisted) {
  //     removeProductFromWishlist(dispatch, product._id);
  //   } else {
  //   }
  // };
  const handleCart = async () =>
  {
    if ( !product || loading || cartLoading ) return;
    setCartLoading( true );
    try
    {
      if ( product.isInCart )
      {
        await removeProductFromCart( dispatch, product._id );
      } else
      {
        await addProductToCart( dispatch, product._id, product.variants[ 0 ]._id );
      }
    } catch ( error )
    {
      console.error( "Error updating cart:", error );
    } finally
    {
      setCartLoading( false );
    }
  };

  const handleeWishlist = async () =>
  {
    if ( !product || wishlistLoading ) return;
    setWishlistLoading( true );
    try
    {
      if ( product.isWhitelisted )
      {
        await removeProductFromWishlist( dispatch, product._id );
      } else
      {
        await addProductToWishlist( dispatch, product._id, product.variants[ 0 ]._id );
      }
    } catch ( error )
    {
      console.error( "Error updating wishlist:", error );
    } finally
    {
      setWishlistLoading( false );
    }
  };

  const handleDownload = async () =>
  {
    if ( !product || tryLoading ) return;
    setTryLoading( true );
    try
    {
      await downloadProduct( dispatch, product.publicKey, product.title );
    } catch ( error )
    {
      console.error( "Error downloading product:", error );
    } finally
    {
      setTryLoading( false );
    }
  };

  const [ downloading, setLoading ] = useState( false );


  if ( !product )
  {
    return <div></div>;
  }

  return (
    <>
      <Searchbar />
      <div className="main h-full">
        <hr className="mt-5" />

        <div className="bg-pageBg mx-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-8 px-4 sm:px-6 md:px-8 lg:px-24">
            <div className="w-full lg:w-2/3">
              {product && (
                <div className="relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pt-4 pr-6">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">{product.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleeWishlist}
                        disabled={wishlistLoading}
                        title={product.isWhitelisted ? "Remove from Saved" : "Save Image"}
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3 text-sm"
                      >
                        {wishlistLoading ? (
                          <span className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : product.isWhitelisted ? (
                          <IoMdHeart className="h-5 w-5 text-red-500" />
                        ) : (
                          <IoMdHeartEmpty className="h-5 w-5" />
                        )}
                        <span>{product.isWhitelisted ? "Saved" : "Save"}</span>
                      </button>
                      <CustomShareButton />
                      <button
                        onClick={handleDownload}
                        disabled={tryLoading}
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3 text-sm"
                      >
                        {tryLoading ? (
                          <span className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : (
                            <FiDownload className="h-4 w-4 " />
                        )}
                        <span>Try</span>
                      </button>
                    </div>
                  </div>
                  <div className="my-4">
                    {product && <DetailWaveform product={product} />}
                  </div>
                  <div className="mt-2 w-full lg:w-[50rem]">
                    <h2 className="font-bold">Description</h2>
                    <p className="text-sm text-neutral-700">
                      Stock Audio ID: {product._id}
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 border-t lg:border-l lg:border-t-0 pt-8 lg:pt-0">
              {product && (
                <div className="border p-4 sm:p-6 bg-white">
                  <h3 className="font-bold text-lg sm:text-xl mb-2">Music Standard License</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4">
                    All Royalty-Free licenses include global use rights, comprehensive protection, and simple pricing with volume discounts available
                  </p>
                  <div className="space-y-4">
                    {product.variants.map( ( license, index ) => (
                      <div
                        key={index}
                        className="border p-3 sm:p-4 mt-2 flex justify-between items-center hover:bg-[#F4F4F4] cursor-pointer"
                      >
                        <div>
                          <label htmlFor={`license-${index}`} className="block text-sm sm:text-base text-gray-600">
                            ₹ {license.price}
                          </label>
                          <div className="text-xs sm:text-sm">
                            {license.metadata.bitrate} Kbps
                          </div>
                        </div>
                        <div className="flex justify-between">
                          {isVariantPurchased( license._id ) ? (
                            <div title="Purchased Product" className="p-1 sm:p-2 bg-red-500 text-white rounded-full">
                              <BiSolidPurchaseTagAlt className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                          ) : (
                            <div
                              title={isVariantInCart( license._id ) ? "Remove from cart" : "Add to cart"}
                              className={`p-1 sm:p-2 ${isVariantInCart( license._id ) ? "bg-red-500 text-white" : "bg-white text-black"
                                } rounded-full`}
                                onClick={handleCart}
                            >
                                {cartLoading ? (
                                <span className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                                  <svg
                                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-current"
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
                              ) : isVariantInCart( license._id ) ? (
                                <BsCartCheckFill className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <BsCart2 className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) )}
                  </div>
                </div>
              )}

              <div className="py-6">
                {product && (
                  <div className="rounded-lg p-4 sm:p-6">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Details</h2>
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Title:</span>
                        <p className="text-blue-600 hover:underline">{product.title}</p>
                      </div>
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Audio Format: </span>
                        <span className="text-neutral-600">{product.variants[0].metadata?.format}</span>
                      </div>
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Track Length: </span>
                        <div className="flex flex-col">
                          <span className="text-neutral-600 whitespace-nowrap" >
                            {product.variants[0].metadata?.length} Minutes
                          </span> 
                        </div>
                      </div>
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Bit Rate: </span>
                        <span className="text-neutral-600 whitespace-nowrap">
                          {product.variants[0].metadata?.bitrate} Kbps 
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Max Size: </span>
                        <span className="capitalize text-neutral-600">
                          {product.variants[0].metadata?.size} Mb
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-start">
                        <span className="font-medium w-24 sm:w-32">Categories:</span>
                        <div className="flex flex-wrap gap-2">
                          {product.category.map( ( category, index ) => (
                            <p key={index} className="text-blue-600 hover:underline">
                              {category}
                            </p>
                          ) )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-8 sm:pt-12 bg-pureWhite-light w-full px-4 sm:px-6 md:px-8 lg:px-24 py-8 overflow-y-auto mt-10  m-auto ">
            <h1 className="text-xl font-semibold mb-4">Similar Audios</h1>
            {similarProducts.map( ( product, index ) => (
              <Waveform
                key={index}
                product={product}
                productType="similarProducts"
              />
            ) )}
          </div>

          {product && (
            <div className="px-4 sm:px-6 md:px-8 lg:px-24 bg-pureWhite-light">
              <div className="pt-8">
                <h2 className="font-bold text-lg sm:text-xl">Related keywords</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map( ( keyword, index ) => (
                    <span key={index}>
                      <button className="border rounded-md py-1 px-3 sm:px-4 flex gap-1 items-center text-sm">
                        <IoSearchOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                        {keyword}
                      </button>
                    </span>
                  ) )}
                </div>
              </div>
              <div className="mt-8 mb-3">
                <h1 className="font-semibold text-lg sm:text-xl">Category</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.category.map( ( keyword, index ) => (
                    <span key={index}>
                      <button className="border rounded-md py-1 px-3 sm:px-4 flex gap-1 items-center text-sm">
                        {keyword}
                      </button>
                    </span>
                  ) )}
                </div> 
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default page;
