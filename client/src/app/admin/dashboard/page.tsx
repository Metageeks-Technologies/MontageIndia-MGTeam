
import React from "react";
import Sidebar from "../componets/sidebar";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { RiGlobalLine,RiVipCrown2Line } from "react-icons/ri";
import { MdArrowOutward } from "react-icons/md";

const page = () => {
  return (
    <div className="main">
      {/* <Sidebar /> */}
      <div className="flex lg:ml-64 sm:ml-64 ">
        <div className="flex-1 bg-white p-6">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-6 sm:w-full">
            <h1 className="text-2xl font-semibold">Hello, Marc!</h1>

            <button className="bg-[#84CC16] text-white border border-gray-400 px-4 py-3 rounded-lg shadow flex items-center space-x-2">
              <RiGlobalLine className="h-5 w-5" />
              <span className="text-sm">Open Site</span>
            </button>
          </div>
          <div className="bg-[#f2fee0] border border-[#84CC16] text-green-700 px-4 py-3 rounded-lg flex items-center justify-between mb-6">
            <div className=" flex items-center gap-1">
            <div className=" flex items-center">
            <RiVipCrown2Line className="h-6 w-6 text-[#8B5CF6]"/>
            </div>
            <div className="text-md">Upgrade your plan to unlock advanced features</div>
            </div>
            <button className="bg-white text-black px-2 py-2 rounded-md flex items-center gap-2">
              Select Plan
              <MdArrowOutward className="text-black h-5 w-5" />
            </button>
          </div>

          {/* Welcome to Durara Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Welcome to Durara 👋</h2>
            <p className="text-gray-600 mb-4">
              A quick guide to getting your first sale
            </p>

            <div className="bg-purple-50  rounded-md border border-purple-500">
              <div className=" p-4 rounded-lg flex justify-between items-center ">
                <div className="flex items-center space-x-4">
                  <FaBoxOpen className="w-6 h-6 text-[#84CC16]" />
                  <div>
                    <h3 className="font-semibold">Stock your store</h3>
                    <p>Let’s get started. Tell about you and your shop</p>
                  </div>
                </div>
                <button className="bg-white text-purple-700 px-4 py-2 rounded-md">
                  Set Up
                </button>
              </div>
              <div className=" p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <FaShippingFast className="w-6 h-6 text-[#84CC16]" />
                  <div>
                    <h3 className="font-semibold">Set your shipping</h3>
                    <p>Let’s get started. Tell about you and your shop</p>
                  </div>
                </div>
                <button className="bg-white text-purple-700 px-4 py-2 rounded-md">
                  Set Up
                </button>
              </div>
            </div>
          </div>

          {/* Overview Performance */}
          <div className="flex justify-between gap-6">
            <div className="mb-6 basis-[65%]">
              <div className="flex flex-col">
                <div className="flex justify-between ">
                  <h2 className="text-xl font-semibold mb-2">
                    Overview performance
                  </h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <button className="bg-gray-100 px-4 py-2 rounded-md">
                      Day
                    </button>
                    <button className="bg-gray-100 px-4 py-2 rounded-md">
                      Week
                    </button>
                    <button className="bg-gray-100 px-4 py-2 rounded-md">
                      Month
                    </button>
                    <button className="bg-gray-100 px-4 py-2 rounded-md">
                      Year
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2  border rounded-md">
                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold">Total Views</h3>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-gray-600">From last 732 (last 7 days)</p>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold">Visits</h3>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-gray-600">From last 732 (last 7 days)</p>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold">Orders</h3>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-gray-600">From last 124 (last 7 days)</p>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <h3 className="font-semibold">Conversion Rate</h3>
                    <p className="text-2xl font-semibold">0</p>
                    <p className="text-gray-600">From last 732 (last 7 days)</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl  font-semibold mb-2 flex justify-between items-center">
                    Revenue{" "}
                    <a href="#" className="text-green-700 ">
                      Last Year
                    </a>
                  </h2>
                  <div className="p-5  rounded-lg flex items-center mt-6 border">
                    <div>
                      <p className="text-gray-600">Total Revenue</p>
                      <p className=" text-2xl font-semibold mt-2">$0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 basis-[35%]">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-2 flex justify-between items-center">
                  Products{" "}
                  <a href="#" className="text-green-700">
                    See All
                  </a>
                </h2>
                <div className="grid grid-cols-1 border rounded-md">
                  <div className="p-4 flex justify-between">
                    <h3 className="font-semibold">Active listings</h3>
                    <p className="text-xl font-bold">0</p>
                  </div>
                  <div className="p-4 flex  justify-between">
                    <h3 className="font-semibold">Expired</h3>
                    <p className="text-xl font-bold">0</p>
                  </div>
                  <div className="p-4 flex justify-between">
                    <h3 className="font-semibold">Sold out</h3>
                    <p className="text-xl font-bold">0</p>
                  </div>
                </div>
              </div>

              <div className=" mt-6">
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Recent Activities</h1>
                  <p>See All</p>
                </div>
                <div className="w-full h-[14rem] border mt-6 rounded-lg flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center bg-white rounded-full p-2 shadow-md border border-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 2C17.5228 2 22 6.47715 22 12C22 13.6169 21.6162 15.1442 20.9348 16.4958C20.8633 16.2175 20.7307 15.9523 20.5374 15.7206L20.4142 15.5858L19 14.1716L17.5858 15.5858L17.469 15.713C16.8069 16.4988 16.8458 17.6743 17.5858 18.4142C18.014 18.8424 18.588 19.0358 19.148 18.9946C17.3323 20.8487 14.8006 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 15C10.6199 15 9.37036 15.5592 8.46564 16.4633L8.30009 16.6368L9.24506 17.4961C10.035 17.1825 10.982 17 12 17C12.9049 17 13.7537 17.1442 14.4859 17.3965L14.7549 17.4961L15.6999 16.6368C14.7853 15.6312 13.4664 15 12 15ZM8.5 10C7.67157 10 7 10.6716 7 11.5C7 12.3284 7.67157 13 8.5 13C9.32843 13 10 12.3284 10 11.5C10 10.6716 9.32843 10 8.5 10ZM15.5 10C14.6716 10 14 10.6716 14 11.5C14 12.3284 14.6716 13 15.5 13C16.3284 13 17 12.3284 17 11.5C17 10.6716 16.3284 10 15.5 10Z"
                        fill="#3F3F46"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-center text-gray-700">
                    You have no recent activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
