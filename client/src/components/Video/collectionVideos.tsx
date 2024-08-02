import React from "react";
import { GoVideo } from "react-icons/go";

interface Card {
  title: string;
  image: string;
}
const CollectionVideos= (data:Card) => {
  return (
    
    
        <div  className="">
          <div className="relative group">
            <img
              src={data.image}
              alt={data.title}
              className="lg:w-[21rem] md:w-[23rem] w-[23rem] h-[27rem] object-cover rounded-md"
            />
           
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white font-semibold text-lg absolute bottom-20 text-center">
                {data.title}
              </div>
              <div className="absolute m-2 top-0 left-0  ">
             <GoVideo className="text-white h-6 w-6"/>
             
            </div>
            </div>
          </div>
        </div>
     
    
  );
};

export default CollectionVideos;
