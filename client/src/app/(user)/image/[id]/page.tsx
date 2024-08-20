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
import { BsCart2, BsCartCheckFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

const Home = () => {
  const [selectedVariantId, setSelectedVariantId] = useState("");
  console.log(selectedVariantId, "selectedVariantId");
  const params = useParams();
  const id = params.id as string | undefined;

  useEffect(() => {
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
  const { user } = useAppSelector((state) => state.user);

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

  const handleCart = (variant: string) => {
    if (!product) return;
    if (product.isInCart) {
      removeProductFromCart(dispatch, product._id);
    } else {
      addProductToCart(dispatch, product._id, variant);
    }
  };

  const isVariantPurchased = (variantId: string) => {
    return user?.purchasedProducts.some((item) =>
      item.variantId.includes(variantId)
    );
  };

  return (
    <div className="main">
      <div className="flex lg:flex-wrap flex-row items-center gap-4 mx-8 mt-8">
        <select className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black">
          <option>Photo</option>
        </select>
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search for music"
            className="w-full px-4 py-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <div className="lg:block md:block hidden">
          <button className="flex items-center px-4 py-2 mr-2 gap-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors">
            <MdOutlineAddAPhoto className="h-5 w-5" />
            Search by Photo
          </button>
        </div>
      </div>
      <div className="w-[80%] m-auto mt-5">
        <div className="flex items-center justify-center gap-10">
          {product && (
            <>
              <div className="relative">
                <img
                  src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.publicKey}`}
                  alt="Main Image"
                  className="w-[50rem] h-[32rem] rounded"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">
                  Premium Content by Shutterstock
                </h3>
                {product.variants.map((license, index) => (
                  <div key={index} className="border p-4 mt-2 w-96">
                    <div className="flex justify-between">
                      {/* <div>
                        {existId && existId.length > 0 ? (
                          <input
                            type="radio"
                            name={`license-${index}`}
                            onChange={() => handleVariantChange(license._id)}
                            checked={
                              selectedVariantId === license._id ||
                              (!selectedVariantId &&
                                existId.some((item) =>
                                  item.productId.variants.some(
                                    (variant) => variant._id === license._id
                                  )
                                ))
                            }
                            id={`license-${index}`}
                            className="mr-2"
                          />
                        ) : (
                          <input
                            type="radio"
                            name={`license-${index}`}
                            onChange={() => handleVariantChange(license._id)}
                            checked={
                              selectedVariantId === license._id ||
                              (index === 0 && !selectedVariantId)
                            }
                            id={`license-${index}`}
                            className="mr-2"
                          />
                        )}

                        <label
                          htmlFor={`license-${index}`}
                          className="font-bold"
                        >
                          {license.label}
                        </label>
                      </div> */}
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
                              isVariantPurchased(license._id)
                                ? "Remove from cart"
                                : "Add to cart"
                            }
                            className={` p-2 ${
                              isVariantPurchased(license._id)
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
                <div className="flex justify-between mt-3">
                  {/* <div
                    title={
                      product.isInCart ? "Remove from cart" : "Add to cart"
                    }
                    className={` p-2 ${
                      product.isInCart
                        ? "bg-red-500 text-white"
                        : "bg-white text-black"
                    } rounded-full`}
                    onClick={handleCart}
                  >
                    {product.isInCart ? <BsCartCheckFill /> : <BsCart2 />}
                  </div> */}
                  <div
                    onClick={handleeWishlist}
                    title={
                      product.isWhitelisted ? "Remove from Saved" : "Save Image"
                    }
                    className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center"
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
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {product && (
          <div className="p-4">
            <div className="flex justify-between gap-10">
              <div>
                <h2 className="font-bold">Photo Description</h2>
                <p className="text-sm">Stock Photo ID: {product._id}</p>
                <p className="text-sm">{product.description}</p>
              </div>
              <div className="flex justify-end items-start">
                <div>
                  <h2 className="font-bold">Important information</h2>
                  <p className="text-sm">
                    Release information: Signed model and property release on
                    file with Shutterstock, Inc.
                  </p>
                  <h2 className="font-bold mt-4">Photo Formats</h2>
                  <p className="text-sm">
                    5760 × 3840 pixels • 19.2 × 12.8 in • DPI 300 • JPG
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="font-bold">Related keywords</h2>
              <div className="flex flex-wrap mt-2">
                {product.tags.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p>Categories: {product.category}</p>
              <p>Upload date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
