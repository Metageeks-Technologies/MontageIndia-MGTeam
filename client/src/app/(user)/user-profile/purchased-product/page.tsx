"use client";
import instance from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Spinner, Button, Pagination } from "@nextui-org/react";
import {SpinnerLoader} from '@/components/loader/loaders';
import { CiImageOn } from "react-icons/ci";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { SiAudioboom } from "react-icons/si";
import { FaRupeeSign } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import { downloadProduct } from "@/app/redux/feature/product/api";
import { truncateWords } from "@/utils/helper";
import UserDropdown from "@/components/userDropdown";
import { FaChevronRight,FaChevronDown } from "react-icons/fa";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";

type Variant = {
  _id: string;
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
  variant: string;
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
  const [downloading, setDownloading] = useState<boolean>(false);
  const [showDataPerPage, setShowDataPerPage] = useState<boolean>(false);
  const dispatch = useAppDispatch();

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
  const handleDataPerPageChange = (num:number) => {
    setDataPerPage(Number(num));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, dataPerPage]);

  const getVariant = (variants: Variant[], variantId: string) => {
    console.log(variants, variantId, "variants");
    const res = variants.find((variant) => variant._id === variantId);
    console.log(res, "res");
    return res;
  };

  return (
    <div className="rounded-lg min-h-screen bg-white px-4 py-2 sm:px-6 sm:py-4">
      <UserDropdown />
      <h1 className="md:text-xl font-semibold mb-6 text-gray-800">
        Purchased Products
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap my-6 mb-4 ">
      <div className="relative flex w-full sm:w-fit">
  <input
    type="text"
    placeholder="Search"
    className="border rounded-r-none rounded-l-md px-4 py-2 w-full pr-8" // Adjust padding-right to make space for the icon
    value={searchTerm}
    onChange={handleSearch}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        fetchProducts();
      }
    }}
  />
  
  {/* Clear Search Button */}
  {searchTerm && (
    <div
      className="absolute right-16 top-1/2 transform -translate-y-1/2 cursor-pointer"
      onClick={() => setSearchTerm('')} // Clears the search term
    >
      <IoCloseOutline className="text-gray-500" />
    </div>
  )}

  {/* Search Button */}
  <div
    onClick={fetchProducts}
    className="cursor-pointer bg-webred px-4 py-2 flex justify-center items-center text-white rounded-l-none rounded-r-md text-lg"
  >
    <IoSearchOutline />
  </div>
</div>
        <div className="w-full sm:w-fit flex flex-col items-start flex-wrap">
          <button onClick={()=>setShowDataPerPage((prev)=>!prev)} className="flex items-center border px-4 py-2 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg">
          <span>{dataPerPage} Data per page</span><span> {
              showDataPerPage ? <FaChevronDown className="ml-2"/> : <FaChevronRight className="ml-2"/>
       }</span>
          </button>
          <div className="relative w-full" >
           <div 
        className={`${!showDataPerPage && "hidden"} absolute top-full mt-2 z-10 flex px-2 py-2 sm:px-0 flex-col justify-center items-start border-2 rounded-lg bg-gray-200`}
      >
        <button 
          onClick={() => handleDataPerPageChange(6)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg border-b ${dataPerPage === 6 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          6 Data Per Page
        </button>
        <button 
          onClick={() => handleDataPerPageChange(12)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg border-b ${dataPerPage === 12 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          12 Data Per Page
        </button>
        <button 
          onClick={() => handleDataPerPageChange(24)} 
          className={`md:text-md w-full text-sm px-4 py-2 rounded-lg ${dataPerPage === 24 ? "bg-webred text-white" : "bg-gray-200 text-black"}`}
        >
          24 Data Per Page
        </button>
      </div>
      </div>
         
        </div>
      </div>
      {loading ? (
        // <div className="flex justify-center items-center min-h-[50vh]">
        <SpinnerLoader />
        // </div>
      ) : (
        <>
          <div className="overflow-x-scroll rounded-lg mb-4">
            <div className="w-full border-collapse">
              <div className="bg-white">
                {purchasedProducts && purchasedProducts.length === 0 && (
                    <div className="flex gap-1 justify-center items-center " ><AiFillProduct/><span>No purchased products found</span></div>
                )}
                {purchasedProducts &&
                  purchasedProducts.length > 0 &&
                  purchasedProducts?.map((purchasedProduct) => (
                    <div
                      key={purchasedProduct.product._id}
                      className="w-full border-t hover:bg-gray-100 my-2 sm:my-0 transition duration-200"
                    >
                      <div className="w-full flex flex-col md:flex-row justify-between gap-2 sm:p-4">

                      <div className="xl:w-3/5 sm:w-1/2 flex flex-col lg:flex-row gap-4">
                        <div className="relative h-48 sm:w-48 sm:h-28 xl:h-32 xl:w-60">
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
                          <div className="h-48 sm:w-48 sm:h-28 xl:h-32 xl:w-60 overflow-hidden rounded-lg">
                            {purchasedProduct.product?.mediaType ===
                              "image" && (
                              <img
                                className="w-full h-full rounded-lg object-cover"
                                src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${purchasedProduct.product.thumbnailKey}`}
                                alt={purchasedProduct.product?.title}
                              />
                            )}
                            {purchasedProduct.product?.mediaType ===
                              "audio" && (
                              <img
                                className="w-full h-full rounded-lg object-cover"
                                src="/images/audioImage.png"
                                alt={purchasedProduct.product?.title}
                              />
                            )}
                            {purchasedProduct.product?.mediaType ===
                              "video" && (
                              <div>
                                <video
                                  loop
                                  muted
                                  className="w-full h-full rounded-lg object-cover"
                                >
                                  <source
                                    src={`${process.env.NEXT_PUBLIC_AWS_PREFIX}/${purchasedProduct.product.thumbnailKey}`}
                                  />
                                </video>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col" >
                        <div className="text-zinc-950 mb-1 font-semibold " > {purchasedProduct.product.title}</div>
                        <div className="text-gray-700 mb-2 text-xs text-wrap" >{purchasedProduct.product.uuid}</div>
                        {/* <div className="text-gray-700 text-sm mb-1 text-wrap "><span className="text-zinc-900 font-semibold " >Category : </span> 
                        {purchasedProduct.product.category?.slice(0,purchasedProduct.product.category.length > 3 ? 3 : purchasedProduct.product.category.length)
                          ?.map((category) => category)
                          .join(", ")}
                        </div> */}
                         <div className="lg:hidden flex">
                       <div className="items-center justify-center flex flex-row gap-1" >
                       <div className="text-zinc-900 font-semibold " >Price :</div>
                       <div className="flex justify-center items-center" >
                          <span>
                            <FaRupeeSign />
                          </span>
                          <span>
                            {
                              getVariant(
                                purchasedProduct?.product?.variants,
                                purchasedProduct?.variant
                              )?.price
                            }
                          </span>
                          </div>
                       </div>
                          
                        </div>
                         <div className="text-gray-700 text-wrap text-sm">{truncateWords(purchasedProduct.product.description,20) }</div>
                      </div>
                        </div>
                       
                       <div className="xl:w-1/5 lg:w-1/4 hidden lg:flex xl:gap-2 md:justify-center items-start">
                       <div className="items-center justify-center flex xl:flex-row flex-col lg:gap-1" >
                       <div className="text-zinc-900 font-semibold " >Price :</div>
                       <div className="flex justify-center items-center" >
                          <span>
                            <FaRupeeSign />
                          </span>
                          <span>
                            {
                              getVariant(
                                purchasedProduct?.product?.variants,
                                purchasedProduct?.variant
                              )?.price
                            }
                          </span>
                          </div>
                       </div>
                          
                        </div>
                       <div className="xl:w-1/5 lg:w-1/4 flex flex-row gap-1 xl:gap-2 md:justify-center items-start">
                          <DownloadButton
                            product={purchasedProduct.product}
                            variant={purchasedProduct.variant}
                          />
                          <button className="px-2 py-1 border-1 border-[#8D529C] rounded-lg text-[#8D529C] hover:text-white hover:bg-[#8D529C]">
                            <Link
                              href={`/${purchasedProduct.product.mediaType}/${purchasedProduct.product.uuid}`}
                              className="flex gap-2 justify-start items-center"
                            >
                              <span >View</span>
                              <span>
                                <IoEyeOutline />
                              </span>
                            </Link>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
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

const DownloadButton = ({
  product,
  variant,
}: {
  product: Product;
  variant: string;
}) => {
  const dispatch = useAppDispatch();

  const [downloading, setDownloading] = useState<boolean>(false);

  const getVariantKey = (variants: Variant[], variantId: string) => {
    console.log(variants, variantId, "variants and variantId");
    if (!variants || variants.length === 0) {
      console.error("Variants array is empty or undefined");
      return undefined;
    }
    if (!variantId) {
      console.error("Variant ID is undefined");
      return undefined;
    }
    const res = variants.find((variant) => variant._id === variantId);
    console.log(res, "found variant");
    if (!res) {
      console.error(`No variant found with ID: ${variantId}`);
      return undefined;
    }
    if (!res.key) {
      console.error(`Variant found but key is undefined: ${res}`);
      return undefined;
    }
    return res.key;
  };

  const handleDownload = async () => {
    const key = getVariantKey(product.variants, variant) || "";
    setDownloading(true);
    await downloadProduct(dispatch, key, product.title);
    setDownloading(false);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-2 py-1 border-1 border-[#22C55E] rounded-lg text-[#22C55E] hover:text-white hover:bg-[#22C55E]"
    >
      <div className="flex gap-2 justify-center items-center">
        <span >Download</span>
        {downloading ? (
          <Spinner color="current" size="sm" />
        ) : (
          <span>
            <IoMdDownload />
          </span>
        )}
      </div>
    </button>
  );
};

export default Page;
