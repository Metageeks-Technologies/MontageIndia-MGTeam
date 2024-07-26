"use client";
import React, { useState } from "react";
import { product } from "../../../db";
import Sidebar from "../../componets/sidebar";
import Link from "next/link";

// Define the interfaces for the product and variant types
interface Variant {
  label: string;
  price: number;
  key: string;
}

interface Product {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  variants: Variant[];
  status: string;
  mediaType: string;
  publicKey: string;
  thumbnailKey: string;
}

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter products by status
  const availableProducts = product.filter(
    (prod) => prod.status === "unavailable"
  );

  // Calculate the number of pages
  const totalPages = Math.ceil(availableProducts.length / productsPerPage);

  // Get products for the current page
  const currentProducts = availableProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handler to change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex ">
      <div>
        <Sidebar />
      </div>
      <div className="container  mb-5">
        <div className="mt-10">
          <h1 className="text-center text-2xl">Unavailable page</h1>
        </div>
        <div className="grid grid-cols-3 gap-5 rounded-md">
          {currentProducts.map((prod) => (
            <div
              key={prod.slug}
              className=" w-full shadow-lg m-4 bg-white rounded-md"
            >
              <img
                className="w-full h-48 object-cover"
                src={prod.thumbnailKey}
                alt={prod.title}
              />
              <div className="px-6 py-4">
                <div className="flex justify-between">
                  <p className="font-bold text-xl mb-2">{prod.title}</p>
                  <Link
                    href={`productEdit/${prod.id}`}
                    className="bg-slate-200 px-6 py-0.5 flex items-center rounded-lg"
                  >
                    Edit
                  </Link>
                </div>
                <p className="text-gray-700 text-base mb-4">
                  {prod.description}
                </p>
                <p
                  className={`text-sm font-semibold mb-2 ${
                    prod.status === "available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {prod.status}
                </p>

                <div className="flex flex-wrap">
                  {prod.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 grid grid-cols-4">
                {prod.variants.slice(0, 4).map((variant, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center mb-2 gap-2"
                  >
                    <img
                      className="w-8 h-8 rounded-full "
                      src={variant.key}
                      alt={variant.label}
                    />
                    <div className="text-sm">
                      <p className="text-gray-900 leading-none text-center">
                        {variant.label}
                      </p>
                      <p className="text-gray-600">
                        ${variant.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
