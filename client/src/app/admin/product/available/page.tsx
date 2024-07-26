"use client";
import React, { useState } from "react";
import { product } from "../../../db";

import Link from "next/link";
import Sidebar from "../../componets/sidebar";

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
  id: string;
}

const Home: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter products by status "available"
  const availableProducts = product.filter(
    (prod) => prod.status === "available"
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
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mb-5 px-4">
        <div className="flex justify-between items-center my-6">
          <input
            type="text"
            placeholder="Search products"
            className="border rounded px-4 py-2 w-full max-w-md"
          />
          <h1 className="bg-green-500 text-white px-4 py-2 rounded ml-2">
            Available Product
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <button className="bg-gray-200 px-4 py-2 rounded">
              Show All Products
            </button>
          </div>
          <div>
            <select className="border rounded px-4 py-2">
              <option>6 Data per page</option>
              <option>12 Data per page</option>
              <option>24 Data per page</option>
            </select>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  <input type="checkbox" />
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  Product
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  Status
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  Price
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  Inventory
                </th>
                <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((prod) => (
                <tr key={prod.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input type="checkbox" />
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="w-10 h-10 rounded"
                          src={prod.thumbnailKey}
                          alt={prod.title}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {prod.title}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                      <span
                        aria-hidden
                        className="absolute inset-0 opacity-50 bg-green-200 rounded-full"
                      ></span>
                      <span className="relative">{prod.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      ${prod.variants[0].price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      100 stock for 1 variants
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm ">
                    <button className="text-gray-600 hover:text-gray-900">
                    <Link
                    href={`productEdit/${prod.id}`}
                    className="bg-slate-200 px-6 py-0.5 flex items-center rounded-lg"
                  >
                    Edit
                  </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex  items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === index + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } rounded`}
              >
                {index + 1}
              </button>
            ))}
          </div>
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
