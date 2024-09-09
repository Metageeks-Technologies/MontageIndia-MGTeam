import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";

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
        isSearch ? "h-[600px]" : "h-[24rem]"
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
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 text-center">
          {heading}
        </h1>
        <p className="text-xl text-white mb-8 text-center max-w-2xl">
          {description}
        </p>
        {isSearch && (
          <div className="flex flex-col  mt-5  text-lg rounded-none">
            <div className="flex flex-col w-full opacity-80 rounded-xl max-md:max-w-full">
              <div className="flex relative  z-10 flex-wrap gap-5 justify-between   mx-0 max-w-full bg-white rounded-lg lg:w-[900px] md:w-[600px]  lg:pl-5 md:pl-5 pl-2 max-md:mr-2.5">
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
                  className="my-auto text-stone-700 focus:outline-none"
                />
                <div className="flex gap-5">
                  <select
                    value={searchType}
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}
                    className="lg:block md:block hidden outline-none cursor-pointer text-black rounded-lg "
                  >
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                  </select>

                  <button
                    onClick={() => {
                      handleSearch();
                    }}
                    className=" bg-red-500 text-white lg:p-4 relative -right-1 md:p-4 p-2 rounded-lg"
                    type="button"
                    aria-label="Search"
                  >
                    <IoSearch className="h-6 w-6" />
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
