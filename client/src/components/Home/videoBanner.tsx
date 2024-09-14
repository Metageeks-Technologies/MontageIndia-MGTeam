import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa";

const VideoBanner = ({
  isSearch,
  videoPath,
  heading,
  description,
}: {
  isSearch: boolean;
  videoPath: string;
  heading: string;
  description: string;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("image");

  const handleSearch = () => {
    router.push(
      `/search/${searchType}?searchTerm=${searchTerm}&mediaType=${searchType}`
    );
    return;
  };

  return (
    <div
      className={`relative w-full ${
        isSearch ? "h-[600px] sm:h-[400px]" : "h-[24rem] sm:h-[20rem]"
      } overflow-hidden`}
    >
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoPath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl sm:text-5xl text-white font-bold mb-4 text-center">
          {heading}
        </h1>
        <p className="text-xl sm:text-2xl text-white mb-8 text-center max-w-2xl">
          {description}
        </p>
        {isSearch && (
          <div className="flex flex-col mt-5 text-lg rounded-none w-full sm:w-auto">
            <div className="flex flex-col w-full opacity-80 rounded-xl">
              <div className="flex relative z-10 flex-wrap gap-5 justify-between mx-0 max-w-full bg-white rounded-lg sm:w-[600px] lg:w-[900px] sm:pl-5 pl-2 sm:mr-0 mr-2.5">
                <div className="flex-1 min-w-0 my-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="Find your perfect stock"
                    className="w-full my-auto text-stone-700 focus:outline-1 p-1"
                  />
                </div>
                <div className="flex gap-5">
                  <select
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}
                    className=" outline-none cursor-pointer  text-black rounded-lg p-1.5 text-center"
                  >
                    <option
                      className="lg:text-medium sm:text-xs text-xs"
                      value="image"
                    >
                      Image
                    </option>
                    <option
                      className="lg:text-medium sm:text-xs text-xs"
                      value="audio"
                    >
                      Audio
                    </option>
                    <option
                      className="lg:text-medium sm:text-xs text-xs"
                      value="video"
                    >
                      Video
                    </option>
                  </select>
                  <button
                    onClick={() => {
                      handleSearch();
                    }}
                    className="bg-red-500 text-white lg:py-4 sm:py-4 py-2 relative sm:p-4 p-2 rounded-r-lg"
                    type="button"
                    aria-label="Search"
                  >
                    <IoSearch className="h-7 w-7 my-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoBanner;
