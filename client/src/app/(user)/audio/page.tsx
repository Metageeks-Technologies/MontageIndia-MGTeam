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

const Page = () => {
  const dispatch = useAppDispatch();
  const {audioData,page,totalNumOfPage} = useAppSelector((state) => state.product);
  useEffect(() => {
    getAudio(dispatch,{
        page:page,
        productsPerPage: 4,
        mediaType: ["audio"],
    });
  }, [page]);
  

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
    <div className="main">
      <div className="flex items-center gap-4 px-4 py-0.5 bg-[#F4F6F6]  border rounded-md w-[90%] m-auto mt-5">
        <button className="flex items-center gap-2 text-black rounded-md">
          <img src="/asset/Vector.svg" alt="" />
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
          // value={searchTerm}
          // onChange={handleSearch}
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

      {/* <Waveform /> */}

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

        <h4 className="mt-5 text-lg text-neutral-700">
          10 Result in audio
        </h4>

        <div className=" overflow-y-auto mt-2">
          {audioData.map((product, index) => (
            <>
            <Waveform key={index} product={product} />
          </>
          ))}
          
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
              cursor: "bg-webred hover:bg-red text-white rounded-full font-bold",
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
  );
};

export default Page;
