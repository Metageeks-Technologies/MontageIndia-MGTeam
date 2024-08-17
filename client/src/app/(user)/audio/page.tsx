"use client";
import Footer from "@/components/Footer";
import BlogCard from "@/components/Home/blogCard";
import CardSlider from "@/components/Home/collectionCard";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Waveform from "@/components/Home/AudioWaveForm";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { getAudio } from "@/app/redux/feature/product/api";

const Page = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    getAudio(dispatch);
  }, []);
  const { audioData } = useAppSelector((state) => state.product);

  return (
    <div className="main">
      <div className="relative h-[600px] w-full overflow-hidden">
        <video
          className="absolute w-full h-[90%] object-cover"
          autoPlay
          loop
          muted
        >
          <source src={"/images/Yellow_Final.webm"} type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 md:p-8 lg:p-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2 sm:px-4 md:px-8 lg:px-16">
            Amp up your content with the best new music, now powered by
            PremiumBeat
          </h1>
          <p className="mt-4 text-sm sm:text-lg md:text-xl mb-4">
            Make projects sound as good as they look with access to
            PremiumBeat's exclusive music library
          </p>
          <div className="w-full max-w-7xl bg-white p-4 rounded-lg shadow-lg">
            <div className="flex lg:flex-wrap flex-row items-center gap-4">
              <select className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black">
                <option>Music</option>
              </select>
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for music"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors">
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
              <div className="lg:block md:block hidden">
                <button className=" flex items-center px-4 py-2 mr-2  gap-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                  Search by audio
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-8">
            {[
              "Americana",
              "Inspirational",
              "Corporate",
              "Emotional",
              "Upbeat",
              "Technology",
              "Uplifting",
            ].map((category) => (
              <button
                key={category}
                className="bg-black bg-opacity-50 text-white rounded-full px-2 py-1 m-1 sm:px-4 sm:py-2 flex items-center bg-transparent backdrop-blur-sm hover:bg-opacity-30 transition duration-300"
              >
                <IoIosSearch className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* <Waveform /> */}

      <div className="lg:mx-24 md:mx-4 mx-4">
        <div className="mb-8 ">
          <h1 className="lg:text-5xl sm:text-3xl text-2xl font-semibold lg:text-start md:text-center text-center">
            See what’s trending now
          </h1>
          <div className="mx-auto mt-4">
            <div className="flex flex-col md:flex-col md:gap-4 lg:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center  md:space-y-1 space-y-1  space-x-2 sm:space-x-2">
                {[
                  "News",
                  "Christmas",
                  "Nature",
                  "Fashion",
                  "Ambient",
                  "Documentary",
                  "Trap",
                  "Fun",
                ].map((category) => (
                  <button
                    key={category}
                    className=" bg-opacity-50 text-black rounded-full px-4 m-1 flex items-center font-light bg-transparent backdrop-blur-sm hover:bg-opacity-30 transition duration-300 border border-black"
                  >
                    <IoIosSearch className="h-5 w-5 mr-1" />
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap px-5 gap-5 item-end">
                <button className="border-black  border-b-3 px-3 font-bold">
                  The Latest
                </button>
                <button>Most popular</button>
              </div>
            </div>
          </div>
        </div>

        <div className=" overflow-y-auto">
          {audioData.map((product, index) => (
            <Waveform key={index} product={product} />
          ))}
        </div>
      </div>

      <div className="my-8 flex justify-center ">
        <button className="flex items-center text-lg px-8 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
          See more
        </button>
      </div>

      <div className="bg-gray-200">
        <div className="py-10 lg:mx-24 md:mx-4 mx-4  ">
          <h1 className="lg:text-3xl text-2xl font-bold lg:text-start md:text-start text-center">
            Browse by genre and mood
          </h1>
          {/* <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 mt-5 items-center lg:flex-row md:flex-row flex-col"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="object-cover rounded-md h-24 w-24"
                />
                <h1 className="font-semibold">{item.title}</h1>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      <div className="lg:mx-24 md:mx-4 mx-4 py-12 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold mb-4 md:mb-0">
            Explore fresh collections
          </h2>
          <button className="flex mb-2 items-center text-lg sm:text-lg px-4 sm:px-8 font-semibold py-2 border border-gray-700 rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
            See more Images
          </button>
        </div>
        {/* <div className="container mx-auto gap-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:mt-3">
          {cards.map((card, index) => (
            <CardSlider key={index} {...card} />
          ))}
        </div> */}
      </div>

      <div className="bg-gray-100">
        <div className="lg:mx-24 sm:mx-4 mx-4 py-10">
          <h2 className="text-3xl font-bold mb-6">
            Tips and tricks from our blog
          </h2>
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden">
            <div className="md:w-1/2">
              <img
                src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2023/01/negative_space_cover.jpg?resize=1250,1120"
                className="w-full h-[23rem] object-cover"
              />
            </div>
            <div className="p-4 md:w-1/2 flex flex-col justify-center">
              <h3 className="font-semibold mb-2">
                How to Incorporate Negative Space in Design and Photography
              </h3>
              <p className="text-gray-700 text-sm">
                Learn why negative space works in design and photography, and
                pick up a few tips for using it in your own creative content.
              </p>
            </div>
          </div>
          {/* <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-4 gap-4">
            {posts.map((data, index) => (
              <BlogCard key={index} {...data} />
            ))}
          </div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
