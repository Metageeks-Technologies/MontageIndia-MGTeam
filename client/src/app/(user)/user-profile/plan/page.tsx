"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

type Product = {
  _id: string;
  title: string;
  description: string;
  thumbnailKey: string;
  category: string[];
  variants: {
    size: string;
    key: string;
    price: number;
    credit: number;
    label: string;
  }[];
};


const Page: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  // const uuid = '1179a771-8685-4853-a759-47206e406c5a';

  const fetchProduct = async () => {
    try {
      const response = await instance.get(`/product/purchase`);
      setProduct(response.data.product);
      console.log("data", response.data);
    } catch (error) {
      console.error("Error fetching product by UUID:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl">Product Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        <div
          key={product._id}
          className="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
        >
          <img
            className="rounded-t-lg object-cover w-full h-52"
            src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${product.thumbnailKey}`}
            alt={product.title}
          />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
              {product.title}
            </h5>
            <p className="mb-3 font-normal text-gray-700">
              {product.description}
            </p>
            <p className="text-sm text-gray-500">
              Categories:{" "}
              <span className="font-medium">{product.category.join(", ")}</span>
            </p>
            {product.variants.length > 0 ? (
              <div className="mt-4">
                <h6 className="text-sm text-gray-500 font-semibold">Variants:</h6>
                <ul className="mt-2 flex gap-5">
                  {product.variants.map((variant:any, index:number) => (
                    <li key={index} className="text-sm text-gray-700">
                     {variant.size}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No variants available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
