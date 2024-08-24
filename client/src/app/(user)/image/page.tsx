"use client";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/Home/homeImage";
import { Product } from "@/types/order";
import instance from "@/utils/axios";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { getImage } from "@/app/redux/feature/product/image/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setImagePage } from "@/app/redux/feature/product/slice";
import { IoSearchOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";

const Page = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setloading] = useState(false);

  const {
    imageData: product,
    imagePage,
    totalImageData,
    totalImageNumOfPage,
  } = useAppSelector((state) => state.product);

  const handlePageChange = (page: number) => {
    // console.log(page);
    dispatch(setImagePage(page));
  };
  const handleNextPage = () => {
    handlePageChange(imagePage === totalImageNumOfPage ? 1 : imagePage + 1);
  };
  const handlePrevPage = () => {
    handlePageChange(imagePage === 1 ? totalImageNumOfPage : imagePage - 1);
  };

  const categoryParam = category ? ["editor choice"] : "";

  const fetchData = (page: number) => {
    getImage(dispatch, {
      page: imagePage,
      productsPerPage: 20,
      mediaType: ["image"],
      searchTerm,
      category: categoryParam,
    });
  };

  useEffect(() => {
    fetchData(imagePage);
    return () => {
      clearKeywords(dispatch);
    };
  }, [imagePage, searchParams]);

  return (
    <>
      <Searchbar />
      <div className="main ">
        <hr className="mt-5" />

        <div className="m-auto mt-4 bg w-[90%]">
          <div className="flex flex-wrap gap-2 ">
            <button className="flex items-center hover:bg-[#c7c7c9] text-sm px-3 py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              Nature
            </button>
            <button className="flex items-center text-sm hover:bg-[#c7c7c9] px-3 py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              India Gate
            </button>
            <button className="flex items-center text-sm hover:bg-[#c7c7c9] px-3 py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              Travel
            </button>
            <button className="flex items-center text-sm hover:bg-[#c7c7c9] px-3 py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              Architecture
            </button>
            <button className="flex items-center text-sm hover:bg-[#c7c7c9] px-3 py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              India Gate Delhi Night
            </button>
            <button className="flex items-center text-sm px-3 hover:bg-[#c7c7c9] py-1 border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              Nature
            </button>
            <button className="flex items-center text-sm px-3 py-1 hover:bg-[#c7c7c9] border border-gray-700 rounded text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-1" />
              India
            </button>
          </div>

          <h4 className="mt-6 text-lg text-neutral-700">
            20 Product stock Photos and High-res Pictures
          </h4>

          {loading ? (
            <div className="h-screen justify-center flex">
              <Spinner label="Loading..." color="danger" />
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 mt-2 relative">
              {product.map((data, index: number) => (
                <ImageGallery key={index} data={data} />
              ))}
            </div>
          )}
        </div>
        {totalImageNumOfPage > 1 && (
          <div className="flex justify-center items-center gap-4 my-12">
            <Button
              size="sm"
              type="button"
              variant="flat"
              className={`${
                currentPage === 1 ? "opacity-70" : "hover:bg-red-600"
              } bg-red-500 text-white rounded-full font-bold`}
              onPress={handlePrevPage}
            >
              Prev
            </Button>
            <Pagination
              color="success"
              classNames={{
                item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
                cursor:
                  "bg-red-500 hover:bg-red-600 text-white rounded-full font-bold",
              }}
              total={totalImageNumOfPage}
              page={imagePage}
              onChange={handlePageChange}
              initialPage={1}
            />

            <Button
              type="button"
              size="sm"
              variant="flat"
              className={`${
                currentPage === totalPages ? "opacity-70" : "hover:bg-red-600"
              } bg-red-600 text-white rounded-full font-bold`}
              onPress={handleNextPage}
            >
              Next
            </Button>
          </div>
        )}
        <div className="mt-8">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Page;
