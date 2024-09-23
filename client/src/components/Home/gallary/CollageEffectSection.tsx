import React, { ReactNode } from "react";
import CollageEffect from "./CollageEffect";
//
const CollageEffectSection = ({
  elementsData,
  data,
}: {
  elementsData: { front: ReactNode; back: ReactNode }[];
  data?: any;
}) => {
  const itemsPerRow = 3;
  const maxVisibleItems = itemsPerRow * 2;
  const visibleElements = elementsData.slice(0, maxVisibleItems);
  return (
    <div id="testting" className="w-full">
      <div className="w-full h-full">
        <div className=" flex items-center  py-6 ">
          <div className="w-[33%] h-full ">
            <div className="flex flex-col h-full items-center justify-center text-center">
              <h4 className="text-3xl font-medium mb-6">SHOP FOR</h4>
              <h4 className="text-6xl font-semibold ">
                {"ART YOU'LL "}
                <br /> LOVE
              </h4>
            </div>
          </div>
          <div className="w-[66%] ">
            <CollageEffect elementsData={visibleElements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollageEffectSection;
