"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Spinner, Button, Pagination } from "@nextui-org/react";
import { CiImageOn } from "react-icons/ci";
import { getCurrCustomer } from "@/app/redux/feature/user/api";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { SiAudioboom } from "react-icons/si";
import { FaRupeeSign } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";

type Variant = {
  size: string;
  key: string;
  price: number;
  credit: number;
  label: string;
};

type Product = {
  _id: string;
  uuid: string;
  title: string;
  description: string;
  publicKey: string;
  mediaType: string;
  thumbnailKey: string;
  tags: string[];
  category?: string[];
  variants: Variant[];
  createdAt: string;
};

type PurchasedProduct = {
  product: Product;
  variant: string[];
  _id: string;
};

const Page: React.FC = () => {
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.user?.user);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/product/purchased`, {
        params: {
          searchTerm,
          currentPage,
          dataPerPage,
        },
      });
      console.log("data", response);

      setPurchasedProducts(response.data.purchasedProducts);
      setTotalPages(response.data.totalPages);
      setTotalPurchased(response.data.totalPurchased);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleDataPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, dataPerPage]);

  return (
    <div className="w-full rounded-lg overflow-hidden min-h-screen bg-white px-2 py-1 md:px-6 md:py-4">
      <h1 className="md:text-xl font-semibold mb-6 text-gray-800">
        Purchased Products
      </h1>
      <div className="flex justify-between items-center gap-4 flex-wrap my-6 mb-4 ">
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-r-none rounded-l-md px-4 py-2 w-full max-w-sm"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchProducts();
              }
            }}
          />
          <div
            onClick={fetchProducts}
            className="cursor-pointer bg-webred px-4 py-2 flex justify-center items-center text-white rounded-l-none rounded-r-md text-lg"
          >
            <IoSearchOutline />
          </div>
        </div>
        <div className="flex items-center flex-wrap md:gap-4">
          <div>
            <select
              className="border rounded px-4 py-2"
              onChange={handleDataPerPageChange}
              value={dataPerPage}
            >
              <option value={6}>6 Data per page</option>
              <option value={12}>12 Data per page</option>
              <option value={24}>24 Data per page</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="w-full flex justify-center items-center ">
          <Spinner color="danger" size="lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg mb-4">
            <table className="w-full border-collapse">
              <thead className="bg-[#F1F1F1] text-black">
                <tr>
                  <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">
                    Media Type
                  </th>
                  <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">
                    Name
                  </th>
                  <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">
                    Categroy
                  </th>
                  <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">
                    Amount
                  </th>
                  <th className="md:px-6 md:py-3 border-b text-sm font-medium tracking-wider">
                    ProductId
                  </th>
                  <th className="md:px-6 md:py-3 border-b text-center text-sm font-medium tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {purchasedProducts &&
                  purchasedProducts.length > 0 &&
                  purchasedProducts?.map((purchasedProduct) => (
                    <tr
                      key={purchasedProduct.product._id}
                      className="border-b hover:bg-gray-100 transition duration-200"
                    >
                      <td className="md:px-6 md:py-4 text-gray-700">
                        <div className="relative w-40 h-20">
                          {/* Media Type Icon */}
                          <div className="absolute -top-1 -left-1 bg-opacity-75 rounded-full flex items-center justify-center">
                            {purchasedProduct.product.mediaType === "image" && (
                              <div className="bg-webred text-center text-white rounded-full p-2">
                                <CiImageOn />
                              </div>
                            )}
                            {purchasedProduct.product.mediaType === "video" && (
                              <div className="bg-webgreen text-center text-white rounded-full p-2">
                                <MdOutlineSlowMotionVideo />
                              </div>
                            )}
                            {purchasedProduct.product.mediaType === "audio" && (
                              <div className="bg-webgreen text-center text-white rounded-full p-2">
                                <SiAudioboom />
                              </div>
                            )}
                          </div>
                          {/* Image */}
                          <div className="w-full h-full rounded-lg overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}${purchasedProduct.product.thumbnailKey}`}
                              alt={purchasedProduct.product.title}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="md:px-6 md:py-4 text-gray-700">
                        {purchasedProduct.product.title}
                      </td>
                      <td className="md:px-6 md:py-4 text-gray-700">
                        {purchasedProduct.product.category
                          ?.map((category) => category)
                          .join(", ")}
                      </td>
                      <td className="md:px-6 md:py-4 text-gray-600">
                        <div className="flex justify-center gap-1 items-center">
                          <span>
                            <FaRupeeSign />
                          </span>
                          <span>
                            {purchasedProduct.product.variants[0].price}
                          </span>
                        </div>
                      </td>
                      <td className="md:px-6 md:py-4 text-gray-600">
                        {purchasedProduct.product.uuid}
                      </td>
                      <td className="md:px-6 md:py-4 ">
                        <div className="flex gap-2 justify-center items-center">
                          <button className="px-2 py-1 border-1 border-[#22C55E] rounded-lg text-[#22C55E] hover:text-white hover:bg-[#22C55E]">
                            <div className="flex gap-2 justify-center  items-center">
                              <span>Download</span>
                              <span>
                                <IoMdDownload />
                              </span>
                            </div>
                          </button>
                          <button className="px-2 py-1 border-1 border-[#8D529C] rounded-lg text-[#8D529C] hover:text-white hover:bg-[#8D529C]">
                            <Link
                              href={`/${purchasedProduct.product.mediaType}/${purchasedProduct.product.uuid}`}
                              className="flex gap-2 justify-start items-center"
                            >
                              <span>View</span>
                              <span>
                                <IoEyeOutline />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-[#999999] md:w-1/3 ">
                Showing {(currentPage - 1) * dataPerPage + 1} to{" "}
                {(currentPage - 1) * dataPerPage + dataPerPage > totalPurchased
                  ? totalPurchased
                  : (currentPage - 1) * dataPerPage + dataPerPage}{" "}
                of {totalPurchased} Entries{" "}
              </div>
              <div className="md:w-1/3 flex justify-center items-center gap-4 my-4">
                <Button
                  size="sm"
                  disabled={currentPage === 1}
                  variant="flat"
                  className={`${
                    currentPage === 1 ? "opacity-70" : "hover:bg-webred-light"
                  } bg-webred text-white rounded-md font-bold`}
                  onPress={() =>
                    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  Prev
                </Button>
                <Pagination
                  color="success"
                  classNames={{
                    item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-md",
                    cursor:
                      "bg-webred hover:bg-webred-light text-white rounded-md font-bold",
                  }}
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  initialPage={1}
                />
                <Button
                  size="sm"
                  disabled={currentPage === totalPages}
                  variant="flat"
                  className={`${
                    currentPage === totalPages
                      ? "opacity-70"
                      : "hover:bg-webred"
                  } bg-webred-light text-white rounded-md font-bold`}
                  onPress={() =>
                    setCurrentPage((prev) =>
                      prev < totalPages ? prev + 1 : prev
                    )
                  }
                >
                  Next
                </Button>
              </div>
              <div className="md:w-1/3"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
