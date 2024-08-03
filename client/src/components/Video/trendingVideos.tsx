'use client'
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";

type Video = {
  video: string;
};

const Trending = (data:any) => {
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
    
       
          <div
            className="relative rounded-md overflow-hidden group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="aspect-w-1 aspect-h-1">
              <video loop muted className="w-full h-72 object-cover">
                <source   src={ `https://mi2-public.s3.ap-southeast-1.amazonaws.com/${ data.thumbnailKey }` } />
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
        
     
    
  );
};

export default Trending;
