'use client'
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";

const imageUrls: string[] = [
  "/images/dance.webm",
  "/images/Flower.webm",
  "/images/sky.webm",
  "/images/Yellow_Final.webm",
  "/images/sky.webm",
  "/images/Flower.webm",
  "/images/sky.webm",
  "/images/dance.webm",
  "/images/Yellow_Final.webm",
];

const Trending: React.FC = () => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.play();
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="flex justify-between ">
        <div className=" flex space-x-4">
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700 bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Space
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Animation
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Dance
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            city
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700  rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Underwater
          </button>
          <button className="flex items-center text-small px-3 py-1 border border-gray-700 rounded-full text-gray-700  bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-30 transition duration-300">
            <IoIosSearch className="h-5 w-5 mr-1" />
            Timelapes
          </button>
        </div>
        <div className="flex gap-5">
          <h2 className="text-xl font-bold">Handpicked content</h2>
          <h2 className="text-xl">Most popular</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 mt-5">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="relative rounded-md overflow-hidden group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="aspect-w-1 aspect-h-1">
              <video loop muted className="w-full h-72 object-cover">
                <source src={url} type="video/mp4" />
              </video>
            </div>
            <div className="absolute m-2 top-0 left-0 flex gap-2 ">
              <GoVideo className="text-white h-6 w-6" />
              <p className="text-white">4k 0:17</p>
            </div>
            <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white bg-black bg-opacity-35 px-3 py-2 rounded-3xl flex gap-1 items-center">
                <IoMdHeartEmpty className="h-5 w-5" />
                <p className="text-sm">Save</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white bg-black bg-opacity-50  px-2 py-2 flex items-center gap-1 rounded-3xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="4" width="16" height="3" fill="#fff" />
                  <rect x="4" y="8" width="16" height="3" fill="#fff" />
                  <rect x="4" y="12" width="16" height="8" fill="#fff" />
                </svg>
                <p className="text-small">Similar</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white bg-black bg-opacity-35 p-2 rounded-full ">
                <FaShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center ">
        <button className="flex items-center text-lg px-6 font-semibold py-2 border border-gray-700  rounded-full text-black bg-transparent backdrop-blur-sm bg-opacity-20 hover:bg-opacity-40 transition duration-300">
          See more Image
        </button>
      </div>
    </div>
  );
};

export default Trending;
