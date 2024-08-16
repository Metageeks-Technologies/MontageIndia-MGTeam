"use client"
import React, { useState } from 'react';

interface Asset {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  status: string;
}

const Collection: React.FC = () => {
  const [assetTypeOpen, setAssetTypeOpen] = useState(false);

  const toggleDropdown = () => {
    setAssetTypeOpen(!assetTypeOpen);
  };

  // Example data for the assets
  const assets: Asset[] = [
    {
      id: 1,
      imageUrl: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg",
      title: "Lonely Tree",
      category: "Images",
      status: "Saved",
    },
    {
      id: 2,
      imageUrl: "https://th.bing.com/th/id/OIP.nhm9zu9oRPhyfOW_ZolOzwHaEo?w=600&h=375&rs=1&pid=ImgDetMain",
      title: "Beach at Dusk",
      category: "Images",
      status: "Saved",
    },
    {
      id: 3,
      imageUrl: "https://th.bing.com/th/id/OIP.Ce2m8qM-qT6o1vVpH-0OrAHaEo?rs=1&pid=ImgDetMain",
      title: "Sunset Mountains",
      category: "Images",
      status: "Saved",
    },
    {
      id: 4,
      imageUrl: "https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?cs=srgb&dl=bloom-blooming-blossom-462118.jpg&fm=jpg",
      title: "Blossoming Flowers",
      category: "Images",
      status: "Saved",
    },
  ];


  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-500">
        <ul className="list-reset flex">
          <li><a href="#" className="text-blue-600">Catalog</a></li>
          <li><span className="mx-2">›</span></li>
          <li><a href="#" className="text-blue-600">Collections</a></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-gray-700">Default Collection</li>
        </ul>
      </div>

      {/* Collection Header */}
      <div className="flex justify-between items-center my-6 md:flex-row flex-col space-y-4 ">
        <div className="flex items-center">
          <img
            src="https://th.bing.com/th/id/OIP.FEqv7YYMNjXtrVYqo7HHzAHaE7?rs=1&pid=ImgDetMain" 
            alt="Collection Thumbnail" 
            className="rounded-lg mr-4 w-16 h-16 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">Favourite Collection</h1>
            <p className="text-sm text-gray-500">Edited August 14, 2024</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
  {/* Filter Dropdown */}
  <div className="relative w-full md:w-auto">
    <button 
      className="bg-white border border-gray-300 rounded-md py-2 px-4 w-full md:w-auto flex items-center justify-between" 
      onClick={toggleDropdown}
    >
      Asset type
      <svg
        className={`ml-2 h-4 w-4 transform ${assetTypeOpen ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>

    {/* Dropdown Menu */}
    {assetTypeOpen && (
      <div className="absolute mt-2 w-full rounded-md bg-white shadow-lg border border-gray-400 z-10">
        <ul className="py-2 text-gray-700">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Images</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Videos</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Audio</li>
        </ul>
      </div>
    )}
  </div>
  
  <input
    type="text"
    className="border border-gray-300 rounded-md py-2 px-4 w-full md:w-auto"
    placeholder="Search by title"
  />
</div>

      </div>

      {/* Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border rounded-lg p-4">
            <div className="relative">
              <img
                src={asset.imageUrl}
                alt={`Image ${asset.id}`}
                className="rounded-lg object-cover w-full h-48"
              />
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">OFF</span>
            </div>
            <h2 className="mt-4 text-lg font-bold">{asset.title}</h2>
            <p className="text-gray-500">{asset.category}</p>
            <p className="text-xs text-green-600">{asset.status}</p>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-6">
        <button className="bg-gray-200 py-2 px-6 rounded-lg text-gray-500" disabled>
          Next
        </button>
      </div>
    </div>
  );
};

export default Collection;
