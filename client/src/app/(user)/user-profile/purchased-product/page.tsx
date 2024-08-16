"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";

type Variant = {
  size: string;
  key: string;
  price: number;
  credit: number;
  label: string;
};

type Product = {
  _id: string;
  title: string;
  description: string;
  publicKey: string;
  category?: string[]; 
  variants: Variant[];
};

type PurchasedProduct = {
  productId: Product;
  variantId: string[];
  _id: string;
};

const Page: React.FC = () => {
  const [products, setProducts] = useState<PurchasedProduct[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await instance.get(`/product/purchased`);
      setProducts(response.data.purchasedProducts);
      console.log("data", response.data.purchasedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div >
      <h1 className="text-2xl">Product Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {products.length > 0 ? (
          products.map((purchasedProduct) => (
            <div
              key={purchasedProduct._id}
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
            >
              <img
                className="rounded-t-lg object-cover w-full h-52"
                src={`https://mi2-public.s3.ap-southeast-1.amazonaws.com/${purchasedProduct.productId.publicKey}`}
                alt={purchasedProduct.productId.title}
              />
              <div className="p-5">
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  {purchasedProduct.productId.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700">
                  {purchasedProduct.productId.description}
                </p>
                <p className="text-sm text-gray-500">
                  Categories:{" "}
                  <span className="font-medium">
                    {purchasedProduct.productId.category ? purchasedProduct.productId.category.join(", ") : "N/A"}
                  </span>
                </p>
                {purchasedProduct.productId.variants.length > 0 ? (
                  <div className="mt-4">
                    <h6 className="text-sm text-gray-500 font-semibold">Variants:</h6>
                    <ul className="mt-2 flex gap-5">
                      {purchasedProduct.productId.variants.map((variant, index) => (
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
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;



