"use client";
import Footer from "@/components/Footer";
import BlogCard from "@/components/Home/blogCard";
import CardSlider from "@/components/Home/collectionCard";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import Waveform from "@/components/Home/AudioWaveForm";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getAudio } from "@/app/redux/feature/product/audio/api";
import { IoSearchOutline } from "react-icons/io5";
import { setAudioPage } from "@/app/redux/feature/product/slice";
import { clearKeywords } from "@/app/redux/feature/product/api";
import Searchbar from "@/components/searchBar/search";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") || "";
  const category = searchParams.get("category");
  const categoryParam = category ? ["editor choice"] : "";
  const [loading, setloading] = useState(false);

  const { audioData, page, totalNumOfPage, totalAudioData } = useAppSelector(
    (state) => state.product
  );

  const fetchData = async (page: number) => {
    setloading(true);
    // setLoading(true);
    const response = await getAudio(dispatch, {
      page: page,
      productsPerPage: 8,
      mediaType: ["audio"],
      searchTerm,
      category: categoryParam,
    });
    setloading(false);
  };

  useEffect(() => {
    fetchData(page);
    return () => {
      clearKeywords(dispatch);
    };
  }, [page, , searchParams]);

  useEffect(() => {
    return () => {
      clearKeywords(dispatch);
    };
  }, [page, searchParams]);

  const handlePageChange = (page: number) => {
    // console.log(page);
    dispatch(setAudioPage(page));
  };

  const handleNextPage = () => {
    handlePageChange(page === totalNumOfPage ? 1 : page + 1);
  };

  const handlePrevPage = () => {
    handlePageChange(page === 1 ? totalNumOfPage : page - 1);
  };

  return (
    <>
      <Searchbar />
      <div className="main">
        {/* <hr className="mt-5" /> */}

        {/* <Waveform /> */}

        <div className="m-auto mt-4 bg w-[90%]">
          {/* <div className="flex flex-wrap gap-2 ">
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
          </div> */}

          {totalAudioData > 0 && (
            <h4 className="mt-5 text-lg text-neutral-700">
              {totalAudioData} Audio Files
            </h4>
          )}

          <div className=" overflow-y-auto mt-2">
            {loading ? (
              <div className="h-screen justify-center flex">
                <Spinner label="Loading..." color="danger" />
              </div>
            ) : (
              <>
                {audioData.length > 0 ? (
                  audioData.map((product, index) => (
                    <Waveform key={index} product={product} />
                  ))
                ) : (
                  <p>No videos found.</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalNumOfPage > 1 && (
          <div className="flex justify-center items-center gap-4 my-10">
            <Button
              size="sm"
              type="button"
              disabled={page === 1}
              variant="flat"
              className={`${
                page === 1 ? "opacity-70 cursor-not-allowed" : "hover:bg-webred"
              } bg-webred text-white rounded-full font-bold`}
              onPress={handlePrevPage}
            >
              Prev
            </Button>
            <Pagination
              color="success"
              classNames={{
                item: "w-8 h-8 text-small bg-gray-100 hover:bg-gray-300 rounded-full",
                cursor:
                  "bg-webred hover:bg-red text-white rounded-full font-bold",
              }}
              total={totalNumOfPage}
              page={page}
              onChange={handlePageChange}
              initialPage={1}
            />
            <p className="text-cart">of {totalNumOfPage}</p>
            <Button
              type="button"
              size="sm"
              disabled={page === totalNumOfPage}
              variant="flat"
              className={`${
                page === totalNumOfPage
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-webred"
              } bg-webred text-white rounded-full font-bold`}
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
