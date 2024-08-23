"use client";
import { setVideoPage } from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Footer from "@/components/Footer";
import FAQ from "@/components/Video/fag";
import Trending from "@/components/Video/trendingVideos";
import { Button, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import debounce from "lodash.debounce";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { videoData: product, videoPage, totalVideoNumOfPage } = useAppSelector((state) => state.product);

  const handlePageChange = (page: number) => {
    dispatch(setVideoPage(page));
  };

  const getData = debounce(() => {
    console.log("datasearch",searchTerm)
    dispatch(setVideoPage(1)); // Reset to page 1 on search
    fetchData(1); // Fetch data with the new search term
  
  }, 300);

  const handleNextPage = () => {
    handlePageChange(videoPage === totalVideoNumOfPage ? 1 : videoPage + 1);
  };

  const handlePrevPage = () => {
    handlePageChange(videoPage === 1 ? totalVideoNumOfPage : videoPage - 1);
  };

  // useEffect(() => {
  //   getVideo(dispatch, { page: videoPage, mediaType: ["video"], productsPerPage: "5" });
  // }, [videoPage]);

  const fetchData = (page: number) => {
    // setLoading(true);
    getVideo(dispatch, {
      page,
      mediaType: ["video"],
      searchTerm,
      productsPerPage: "5",
    }) 
  };

  useEffect(() => {
    fetchData(videoPage);
  }, [videoPage]);

  return (
    <div className="main items-center ">
      <div className="flex my-8 items-center gap-4 px-4 py-0.5 bg-gray-100 border border-gray-300 rounded-md w-[90%] m-auto">
        <button className="md:flex items-center hidden outline-none gap-2 text-black hover:bg-gray-200 rounded-md">
          <img src="/asset/28-camera-1.svg" alt="" />
          <span>Videos</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <img src="/asset/Rectangle 15.png" alt="" />
        <input
          type="text"
          placeholder="Search for Videos"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            getData();
          }}
          className="flex-grow py-2 outline-none bg-gray-100 rounded-md"
        />
        <button onClick={getData}>
          <IoSearchOutline className="h-6 w-6 cursor-pointer text-gray-400" />
        </button>
        <button className="md:flex items-center gap-4 text-gray-500 hidden hover:text-black rounded-md">
          <img src="/asset/Rectangle 15.png" alt="" />
          <img src="/asset/Union.png" alt="" />
          <span>Search by video</span>
        </button>
      </div>

      {/* Category Buttons */}
      <div className="border-t bg-[#eeeeee] border-gray-300 px-[5%] py-5 flex flex-wrap justify-start space-x-2 space-y-2 md:space-y-0 sm:space-x-4">
        {["Happy birthday", "Thank You", "Background", "Congratulations", "Business", "Welcome"].map((category) => (
          <button key={category} className="flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-2" />
            {category}
          </button>
        ))}
      </div>

      {/* Trending Videos */}
      <div className="bg-[#eeeeee]">
        <div className="py-10 lg:mx-24 md:mx-4 mx-4">
          <h1 className="text-2xl font-bold lg:text-start md:text-center text-center">Today's Trending Videos</h1>
          <div className="mx-auto mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
              {product.length > 0 ? product.map((data) => (
                <Trending key={data._id} data={data} />
              )) : (
                <p>No videos found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalVideoNumOfPage > 1 && (
        <div className="flex justify-center items-center gap-4 my-4">
          <Button
            size="sm"
            type="button"
            disabled={videoPage === 1}
            variant="flat"
            className={`${
              videoPage === 1 ? "opacity-70 cursor-not-allowed" : "hover:bg-webred"
            } bg-webred text-white rounded-full font-bold`}
            onPress={handlePrevPage}
          >
            Prev
          </Button>
          <Pagination
            color="success"
            classNames={{
              item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
              cursor: "bg-webred hover:bg-red text-white rounded-full font-bold",
            }}
            total={totalVideoNumOfPage}
            page={videoPage}
            onChange={handlePageChange}
            initialPage={1}
          />
          <p className="text-cart">of {totalVideoNumOfPage}</p>
          <Button
            type="button"
            size="sm"
            disabled={videoPage === totalVideoNumOfPage}
            variant="flat"
            className={`${
              videoPage === totalVideoNumOfPage
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-webred"
            } bg-webred text-white rounded-full font-bold`}
            onPress={handleNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* FAQ Section */}
      <div className="py-8 bg-gray-100">
        <div className="lg:mx-24 md:mx-4 mx-4 flex lg:flex-row md:flex-col flex-col">
          <h2 className="text-2xl font-bold mt-5 basis-[25%]">Stock Footage FAQs</h2>
          <FAQ />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
