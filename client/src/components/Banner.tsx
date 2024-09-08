import React from "react";
import { IoCameraOutline, IoSearch, IoVideocamOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiOutlineSpeakerWave } from "react-icons/hi2";

const Banner = () => {
  return (
    <div className=" w-full h-[350px] mb-5 relative ">
      <img
        src="/asset/main-with-camera2 2.jpg"
        alt=""
        className="absolute w-full h-[24rem] md:w-full   object-cover"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4 md:p-8 lg:p-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold px-2  lg:w-[45%] md:w-[80%] w-full ">
          Impact The World With True, Inventive Footage
        </h1>

        <form className="flex flex-col  mt-5  text-lg rounded-none">
          <div className="flex flex-col py-4 w-full bg-black opacity-80 rounded-md max-md:max-w-full">
            <div className="flex  z-10 flex-wrap gap-5 justify-between  lg:mx-4 md:mx-4 mx-2 max-w-full bg-white rounded-xl lg:w-[900px] md:w-[600px]  lg:pl-5 md:pl-5 pl-2 max-md:mr-2.5">
              <input
                type="text"
                placeholder="Find your perfect stock photo.."
                className="my-auto text-stone-700 focus:outline-none"
              />
              <div className="flex gap-5">
                <select className="bg-gray-100 lg:block md:block hidden  outline-none cursor-pointer text-black rounded-lg ">
                  <option>All Images</option>
                  <option>All Audio</option>
                  <option>All Video</option>
                </select>

                <button
                  className=" bg-red-500 lg:p-4 md:p-4 p-2 rounded"
                  type="submit"
                  aria-label="Search"
                >
                  <IoSearch className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* <div className="flex flex-wrap lg:gap-10 md:gap-10 gap-5 items-start pt-5 pr-20 pb-5 pl-4 font-medium leading-none text-white whitespace-nowrap bg-black rounded-none max-md:pr-5">
              <button className="flex gap-2 items-center ">
                <IoCameraOutline className="h-6 w-6" />
                <span>Images</span>
              </button>
              <button className="flex gap-2 items-center ">
                <IoVideocamOutline className="h-6 w-6" />
                <span>Video</span>
              </button>
              <button className="flex gap-2 items-center ">
                <HiOutlineSpeakerWave className="h-6 w-6" />
                <span>Audio</span>
              </button>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Banner;
