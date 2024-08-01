import Footer from "@/components/Footer";
import Blog from "@/components/Video/blog";
import Category from "@/components/Video/category";
import CollectionVideos from "@/components/Video/collectionVideos";
import Explore from "@/components/Video/explore";
import Trending from "@/components/Video/trendingVideos";
import { IoIosSearch } from "react-icons/io";
import React from "react";
import FAQ from "@/components/Video/fag";

const Page = () => {
  return (
    <div className="main  ">
      <div className="relative h-[550px] w-full overflow-hidden">
        <video className="absolute h-[100%]  object-cover " autoPlay loop muted>
          <source src={"/images/VHP_5-27.webm"} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-bold">
            Unleash your creativity with unrivaled images
          </h1>
          <p className="mt-4 text-xl">
            Add wonder to your stories with 450M+ photos, vectors,
            illustrations, and editorial images.
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Happy birthday
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Thank You
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Background
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Congratulations
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Business
            </button>
            <button className="flex items-center px-4 py-2 border border-white rounded-full text-white bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
              <IoIosSearch className="h-5 w-5 mr-2" />
              Welcome
            </button>
          </div>
        </div>
      </div>

      {/* <div className="p-10 mx-24 border">
        <h1 className="text-2xl font-bold">Explore Stock Footage Categories</h1>

        <Explore />
      </div> */}

      <div className="bg-[#eeeeee]">
        <div className="p-10 px-24">
          <h1 className="text-2xl font-bold">Today's Trending Videos</h1>
          <Trending />
        </div>
      </div>

      <div className="mx-24 py-12">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Explore Latest Stock Video Collections
          </h2>
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more Image
          </button>
        </div>
        <CollectionVideos />
      </div>

      <div className="bg-gray-100">
        <div className="mx-24">
          <h2 className="text-2xl font-bold mb-6">
            From the Blog: Top Tips & Tricks
          </h2>
          <Blog />
        </div>
      </div>

      <div className="px-24 mt-5">
        <h2 className="text-2xl font-bold mb-4">
          Browse by Category: Find the Right Stock Footage Faster
        </h2>
        <Category />
        <div className="mt-8 flex justify-center ">
          <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more
          </button>
        </div>
      </div>
       <div className=" my-8 bg-gray-100 ">
      <div className=" mx-24 flex gap-12">
        <h2  className="text-2xl font-bold mt-5 basis-[25%]">Stock Footage FAQs</h2>
        <FAQ/> 
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
