"use client"
import Footer from "@/components/Footer";
import instance from "@/utils/axios";
import { useParams} from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { addCartItem } from "@/app/redux/feature/user/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {notifySuccess} from "@/utils/toast";

export interface Variant {
  label: string;
  price: number;
  key: string;
  size: string;
  _id: string;
}

export interface ImageDetail {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  uuid: string;
  status: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
  variants: Variant[];
}

const Home = () => {
  const [imageDetail, setImageDetail] = useState<ImageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState('');

  const params = useParams();
  const dispatch = useAppDispatch();
  const cartProduct = useAppSelector((state) => state.user.cartData);
  const existId = cartProduct.filter((item) => item.product._id === imageDetail?._id);
   const id = params.id as string | undefined;

  const handleAddToCart = (id: string) => {
    addCartItem(dispatch, id,selectedVariantId);
  }
  const fetchImageDetail = async (id: string) => {
    setLoading(true);

    try {
      const response = await instance.get(`/product/${id}`);
      if (response.status === 201) {
        setImageDetail(response.data.product);
        setLoading(false);
      }
      console.log(response.data.product)
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variantId:string) => {
    setSelectedVariantId(variantId);
  };

  useEffect(() => {
    if (id) {
      fetchImageDetail(id);
    }
  }, [id]);
 

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
          <MdOutlineAddAPhoto className="h-5 w-5"/>
            Search by Photo
          </button>
        </div>
      </div>
      <div className="w-[80%] m-auto mt-5">
        <div className="flex items-center justify-center gap-10">
          {imageDetail && (
            <>
              <div className="relative">
                <img
                  src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${imageDetail.thumbnailKey}`}
                  alt="Main Image"
                  className="w-[50rem] h-[32rem] rounded"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">Premium Content by Shutterstock</h3>
                {imageDetail.variants.map((license, index) => (
                  <div   key={index} className="border p-4 mt-2 w-96">
                    <div className="flex justify-between">
                      <div>   
                      {existId && existId.length > 0 ? (
                        <input
                          type="radio"
                          name={`license-${index}`}
                          onChange={() => handleVariantChange(license._id)}
                          checked={
                            selectedVariantId === license._id ||
                            (!selectedVariantId && existId.some(item => item.variantId.includes(license._id)))
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
          
                        
                        <label htmlFor={`license-${index}`} className="font-bold">
                          {license.label}
                        </label>
                      </div>
                      <label htmlFor={`license-${index}`} className="block text-gray-600">${license.price}</label>
                    </div>
                    <span className="block text-gray-600">{license.size}</span>
                  </div>
                ))}
                <button onClick={()=>handleAddToCart(imageDetail._id)} className="bg-red-500 text-white p-2 rounded mt-4">
                  Add to cart
                </button>
              </div>
            </>
          )}
        </div>
        {imageDetail && (
          <div className="p-4">
            <div className="flex justify-between gap-10">
              <div>
                <h2 className="font-bold">Photo Description</h2>
                <p className="text-sm">Stock Photo ID: {imageDetail._id}</p>
                <p className="text-sm">{imageDetail.description}</p>
              </div>
              <div className="flex justify-end items-start">
                <div>
                  <h2 className="font-bold">Important information</h2>
                  <p className="text-sm">
                    Release information: Signed model and property release on file with Shutterstock, Inc.
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
                {imageDetail.tags.map((keyword, index) => (
                  <span key={index} className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p>Categories: {imageDetail.category}</p>
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
