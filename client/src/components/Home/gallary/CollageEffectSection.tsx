import React, { ReactNode } from "react";
import CollageEffect from "./CollageEffect";

const CollageEffectSection = ({
  elementsData,
  data,
}: {
  elementsData: { front: ReactNode; back: ReactNode }[];
  data?: any;
}) => {

   
   const itemsPerRow = 7; 
   const maxVisibleItems = itemsPerRow * 2; 
   const visibleElements = elementsData.slice(0, maxVisibleItems);
  return (
    <div id="testting" className="w-full ">
      <div className="w-full h-full">
        <div className=" flex items-center ">
          <div className="w-[33%] h-full">
            <div className="flex flex-col h-full items-center justify-center text-center">
              <h4 className="text-3xl font-medium mb-6">SHOP FOR</h4>
              <h4 className="text-6xl font-semibold mb-8">
                {"ART YOU'LL "}
                <br /> LOVE
              </h4>
              <button className="py-4 px-6 text-3xl border-[3px] border-gray-600 bg-[#F2F2F2] hover:bg-black hover:text-white transition-all mb-10">
                SHOP NOW
              </button>
              <div className="flex items-center gap-2 text-lg text-slate-500">
                <a href="#" className="underline">
                  Featured Artwork
                </a>
                <div className="h-6 w-[1px] bg-slate-500"></div>
                <a href="#" className="">
                  Photography
                </a>
                <div className="h-6 w-[1px] bg-slate-500"></div>
                <a href="#" className="">
                  Sports Illustrated
                </a>
              </div>
            </div>
          </div>
          <div className="w-[66%]  ">
          <CollageEffect elementsData={visibleElements} />
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default CollageEffectSection;
