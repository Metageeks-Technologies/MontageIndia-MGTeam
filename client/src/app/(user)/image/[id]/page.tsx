"use client";
import {
  addProductToCart,
  addProductToWishlist,
  clearSingleProductData,
  downloadProduct,
  getSingleProduct,
  removeProductFromCart,
  removeProductFromWishlist,
  removeSingleProductFromLocalStorage,
  setSingleProductInLocalStorage,
} from "@/app/redux/feature/product/api";
import ImageGallery from "@/components/Home/homeImage";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCart2, BsCartCheckFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { CiHeart } from "react-icons/ci";
import { AiOutlineDownload } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import Searchbar from "@/components/searchBar/search";
import CustomShareButton from "@/components/Home/gallary/share";
import { LuIndianRupee } from "react-icons/lu";
import { redirectToLogin } from "@/utils/redirectToLogin";

const Home = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [cartLoadingMap, setCartLoadingMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [tryLoading, setTryLoading] = useState(false);
  console.log(selectedVariantId, "selectedVariantId");
  const params = useParams();
  const id = params.id as string | undefined;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (id) getSingleProduct(dispatch,!!user, id,router);
    return () => {
      clearSingleProductData(dispatch);
    };
  }, [id]);

  const dispatch = useAppDispatch();
  const {
    singleProduct: product,
    loading,
    cart,
    similarProducts,
  } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.user);

  const handleeWishlist = async () => {
    if (wishlistLoading || !product || loading) return;
    if (!user) {
      redirectToLogin(router, pathname);
      return;
    }

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
    if (!user && !product.isInCart) {
      setSingleProductInLocalStorage(
        { productId: product, variantId },
        dispatch
      );
    }
    if (!user && product.isInCart) {
      removeSingleProductFromLocalStorage(product._id, dispatch);
    }

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

  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };

  return (
    <>
      <Searchbar />
      <div className="main h-full">
        <hr />

        <div className="bg-pageBg mx-auto ">
          <div className="flex flex-col lg:flex-row lg:space-x-8 px-4 lg:px-4 xl:px-16 md:px-4 md:gap-12 gap-1 border-b">
            <div className="w-full lg:w-2/3">
              {product && (
                <div className="relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pt-4">
                    <h1 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">
                      {product.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleeWishlist}
                        disabled={wishlistLoading}
                        title={
                          product.isWhitelisted
                            ? "Remove from Saved"
                            : "Save Image"
                        }
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3 text-sm"
                      >
                        {wishlistLoading ? (
                          <span className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : product.isWhitelisted ? (
                          <IoMdHeart className="h-4 w-4 text-red-500" />
                        ) : (
                          <IoMdHeartEmpty className="h-4 w-4" />
                        )}
                        <span >{product.isWhitelisted ? "Saved" : "Save"}</span>
                      </button>
                      <CustomShareButton />
                      <button
                        onClick={handleTry}
                        disabled={tryLoading}
                        className="flex gap-2 border py-1 items-center rounded bg-white px-3 text-sm"
                      >
                        {tryLoading ? (
                          <span className="h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></span>
                        ) : (
                          <AiOutlineDownload className="h-4 w-4" />
                        )}
                        <span>Try</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-full sm:h-64 md:h-80 lg:h-[32rem] rounded-lg bg-[#ffff]">
                    <img
                      src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${product.thumbnailKey}`}
                      alt={product.title}
                      className="mx-auto object-contain h-full w-full rounded-lg"
                    />
                  </div>
                  <div className="mt-2 w-full lg:w-[50rem]">
                    <h2 className="font-bold">Description</h2>
                    <p className="text-sm text-neutral-700">
                      Stock Photo ID: {product._id}
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 border-t lg:border-l lg:border-t-0 pt-8 lg:pt-0 ">
              {product && (
                <>
                  <div className="border p-4 sm:p-6 bg-white rounded-b-lg">
                    <h3 className="font-bold text-lg sm:text-xl mb-4">
                      Purchase a License
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">
                      All Royalty-Free licenses include global use rights,
                      comprehensive protection, and simple pricing with volume
                      discounts available
                    </p>
                    <div className="border rounded-md ">
                      {product.variants.map((license, index) => (
                        <div
                          key={index}
                          className="border-t w-full cursor-pointer hover:bg-[#F4F4F4] p-3 flex flex-row justify-between items-center "
                          onClick={() => handleCart(license._id)}
                        >
                          <div className=" items-center gap-3">
                            {index === 0 ? (
                              <span className="text-sm font-semibold">
                                Original
                              </span>
                            ) : index === 1 ? (
                              <span className="text-sm font-semibold">
                                Medium
                              </span>
                            ) : (
                              <span className="text-sm font-semibold">
                                Small
                              </span>
                            )}
                            <div className="text-sm py-2">
                              {license?.metadata?.dimension} px
                            </div>
                          </div>
                          <div>
                            {isVariantPurchased(license._id) ? (
                              <div
                                title="Purchased Product"
                                className="p-2 flex items-center gap-1 bg-red-500 text-white rounded-full"
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
                                className="p-2 flex items-center gap-1 text-black rounded-full"
                              >
                                <LuIndianRupee />
                                {license.price}
                                <span
                                  className={`p-2 ${
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
                      ))}
                    </div>
                  </div>

                  <div className="mt-8  p-4 sm:p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Details</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Title:</span>
                        <p className="text-blue-600 hover:underline">
                          {product?.title}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Format:</span>
                        <span className="text-neutral-600">
                          {product.variants[0].metadata?.format}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Dimensions:</span>
                        <span className="flex flex-col">
                          {product.variants.map((variant, index) => (
                            <span
                              key={index}
                              className="text-neutral-600 whitespace-nowrap"
                            >
                              {variant.metadata?.dimension} px
                              {index !== product.variants.length - 1 && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Densities:</span>
                        <span className="text-neutral-600 whitespace-nowrap">
                          {product.variants[0].metadata?.dpi} Dpi
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Max Size:</span>
                        <span className="capitalize text-neutral-600">
                          {product.variants[0].metadata?.size} Mb
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium w-1/3">Categories:</span>
                        <div className="flex flex-wrap ">
                          {product.category.map((category, index) => (
                            <p
                              key={index}
                              className="text-blue-600 hover:underline"
                            >
                              {category}
                              {index !== product.category.length - 1 && ","}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-8 sm:pt-12 bg-pureWhite-light w-full px-4 sm:px-6 lg:px-4 xl:px-16 md:px-4 py-8">
            <h1 className="font-semibold text-lg sm:text-xl">Similar Videos</h1>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 mt-2 relative">
              {similarProducts?.map((data, index) => (
                <ImageGallery
                  key={index}
                  data={data}
                  productType="similarProducts"
                />
              ))}
            </div>
          </div>

          {product && (
            <div className="px-4 sm:px-6 lg:px-4 xl:px-16 md:px-4 bg-pureWhite-light">
              <div className="pt-8">
                <h2 className="font-bold text-lg sm:text-xl">
                  Related keywords
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((keyword, index) => (
                    <span key={index}>
                      <button className="border rounded-md py-1 px-3 sm:px-4 flex gap-1 items-center text-sm">
                        <IoSearchOutline className="h-4 w-4 sm:h-5 sm:w-5" />
                        {keyword}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="py-10">
                <h1 className="font-semibold text-lg sm:text-xl">Category</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.category.map((keyword, index) => (
                    <span key={index}>
                      <button className="border rounded py-1 px-3 sm:px-4 flex gap-1 items-center text-sm">
                        {keyword}
                      </button>
                    </span>
                  ))}
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

export default Home;
