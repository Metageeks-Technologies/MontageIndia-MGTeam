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

const Page = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [productData, setProductData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const categoryParam = category ? ["editor choice"] : "";

  const fetchData = (page: number) => {
    getImage(dispatch, {
      page: imagePage,
      productsPerPage: 20,
      mediaType: ["image"],
      searchTerm,
      category: categoryParam,
    }) 
  };

  useEffect(() => {
    fetchData(imagePage);
  }, [imagePage,searchParams,searchTerm]);


  return (
    <div className="main ">
      {/* <div className="relative h-[550px] w-full overflow-hidden">
        <video
          className="absolute h-full w-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/images/VHP_5-27.webm" type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 sm:px-6 md:px-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Unleash your creativity with unrivaled images
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl">
            Add wonder to your stories with 450M+ photos, vectors,
            illustrations, and editorial images.
          </p>
          <div className="w-full max-w-7xl bg-white  rounded-lg shadow-lg">
            <div className="flex lg:flex-wrap flex-row items-center gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for image"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={SearchTerm}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter") {
                  //     e.preventDefault(); // Prevents the default action of the Enter key (like submitting a form)
                  //     getProduct();
                  //   }
                  // }}
                  className="w-full px-4 outline-none py-2 border border-gray-400 rounded-md text-black"
                />
                <button
                  // onClick={getProduct}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2  text-gray-600 p-2 rounded-md  transition-colors"
                >
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
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center space-x-2 space-y-2 md:space-y-2 sm:space-x-4">
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Happy birthday
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Thank You
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Background
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Congratulations
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Business
            </button>
            <button className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Welcome
            </button>
          </div>
        </div>
      </div> */}

      {/* <div className="p-10 mx-24 border">
        <h1 className="text-2xl font-bold">Explore Stock Footage Categories</h1>

        <Explore />
      </div> */}

      <div className="flex items-center gap-4 px-4 py-0.5 bg-[#F4F6F6]  border rounded-md w-[90%] m-auto mt-4">
        <button className="flex items-center gap-2 text-black rounded-md">
          <img src="/asset/28-camera-1.svg" alt="" />
          <span>Photos</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <img src="/asset/Rectangle 15.png" alt="" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for Photos"
          className="flex-grow  py-2 rounded-md bg-[#F4F6F6]  focus:outline-none"
        />
        <IoSearchOutline className="h-6 w-6 cursor-pointer text-gray-400" />
        <div className="lg:block md:block hidden">
          <button className="flex items-center gap-4 text-gray-500 hover:text-black  rounded-md">
            <img src="/asset/Rectangle 15.png" alt="" />
            <img src="/asset/Union.png" alt="" />
            <span>Search by image</span>
          </button>
        </div>
      </div>

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

        <h4 className="mt-6 text-lg text-neutral-700">20 Product stock Photos and High-res Pictures</h4>

        {loading ? (
          <div className="h-screen justify-center flex">
            <Spinner color="success" />
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 mt-2 relative">
            {product.map((data, index: number) => (
              <ImageGallery key={index} data={data} />
            ))}
          </div>
           
        )}
      </div>
      {/* <div className="mt-8 flex justify-center ">
            <button className="flex items-center text-lg px-6 font-semibold py-2 border border-gray-700  rounded text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
              See more Image
            </button>
          </div> */}
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
              currentPage === totalPages
                ? "opacity-70"
                : "hover:bg-red-600"
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
  );
};

export default Page;
