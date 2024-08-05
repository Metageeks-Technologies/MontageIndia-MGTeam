import React from 'react';
import { LiaHomeSolid } from "react-icons/lia";
import { MdHelpOutline, MdOutlineGeneratingTokens } from 'react-icons/md';
import { GrCatalogOption } from "react-icons/gr";
import { RiPencilRuler2Line } from 'react-icons/ri';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full z-30 w-20 border flex flex-col items-center bg-gray-100 text-gray-700 shadow-md">
      <div className="my-4">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center">
            <LiaHomeSolid className="h-8 w-8" />
            <p className="text-xs mt-2">Home</p>
          </div>
          <div className="flex flex-col items-center">
            <MdOutlineGeneratingTokens className="h-8 w-8" />
            <p className="text-xs mt-2">Generate</p>
          </div>
          <div className="flex flex-col items-center">
            <GrCatalogOption className="h-8 w-8" />
            <p className="text-xs mt-2">Catalog</p>
          </div>
          <div className="flex flex-col items-center">
            <RiPencilRuler2Line className="h-8 w-8" />
            <p className="text-xs mt-2">Create</p>
          </div>
        </div>
      </div>
      <div className="mt-auto mb-4">
        <div className="flex flex-col items-center">
          <MdHelpOutline className="h-8 w-8" />
          <p className="text-xs mt-2">Help</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
