'use client';
// components/Sidebar.js
import React from "react";
import
  {
    FaHome,
    FaDollarSign,
    FaUsers,
    FaBullhorn,
    FaChartBar,
    FaShoppingCart,
    FaCog,
    FaUserCircle,
  } from "react-icons/fa";
import { BiCategoryAlt, BiPlus, BiLogOutCircle } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";
import { IoBagHandleSharp } from "react-icons/io5";

const Sidebar = () =>
{
  return (
    <>

      <div className=" w-64 bg-gray-100 flex flex-col shadow-lg">
        <div className="mx-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 h-20  border-gray-300">
              <div className=" w-8 h-8 bg-white border border-gray-300 flex justify-center items-center rounded-lg shadow-xl">
                <IoBagHandleSharp className=" text-[#65A30D] h-6 w-6  rounded-md" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Durara</h1>
              </div>
            </div>
            <div className="h-8 w-8 cursor-pointer flex justify-center items-center rounded-full bg-white shadow-lg border border-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3.33333 3.33333H8.66667V12.6667H3.33333V3.33333ZM12.6667 12.6667H10V3.33333H12.6667V12.6667ZM2.66667 2C2.29848 2 2 2.29848 2 2.66667V13.3333C2 13.7015 2.29848 14 2.66667 14H13.3333C13.7015 14 14 13.7015 14 13.3333V2.66667C14 2.29848 13.7015 2 13.3333 2H2.66667ZM4.66667 8L7.33333 5.66667V10.3333L4.66667 8Z"
                  fill="#71717A"
                />
              </svg>
            </div>
          </div>

          <div className="mb-1 px-4 py-2 hover:bg-gray-200 bg-white rounded-lg flex justify-between items-center">
            <span className="flex items-center text-gray-800 gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.5003 9.70516V17.5003C17.5003 17.9606 17.1272 18.3337 16.667 18.3337H3.33366C2.87343 18.3337 2.50033 17.9606 2.50033 17.5003V9.70516C1.98169 9.11758 1.66699 8.34566 1.66699 7.50033V2.50033C1.66699 2.04009 2.04009 1.66699 2.50033 1.66699H17.5003C17.9606 1.66699 18.3337 2.04009 18.3337 2.50033V7.50033C18.3337 8.34566 18.019 9.11758 17.5003 9.70516ZM15.8337 10.7287C15.5673 10.7972 15.2881 10.8337 15.0003 10.8337C14.0047 10.8337 13.1111 10.3972 12.5003 9.70516C11.8896 10.3972 10.9959 10.8337 10.0003 10.8337C9.00474 10.8337 8.11111 10.3972 7.50033 9.70516C6.88954 10.3972 5.9959 10.8337 5.00033 10.8337C4.71258 10.8337 4.43334 10.7972 4.16699 10.7287V16.667H15.8337V10.7287ZM11.667 7.50033C11.667 7.04009 12.0401 6.66699 12.5003 6.66699C12.9606 6.66699 13.3337 7.04009 13.3337 7.50033C13.3337 8.42083 14.0798 9.16699 15.0003 9.16699C15.9208 9.16699 16.667 8.42083 16.667 7.50033V3.33366H3.33366V7.50033C3.33366 8.42083 4.07985 9.16699 5.00033 9.16699C5.9208 9.16699 6.66699 8.42083 6.66699 7.50033C6.66699 7.04009 7.04009 6.66699 7.50033 6.66699C7.96056 6.66699 8.33366 7.04009 8.33366 7.50033C8.33366 8.42083 9.07983 9.16699 10.0003 9.16699C10.9208 9.16699 11.667 8.42083 11.667 7.50033Z"
                  fill="#52525B"
                />
              </svg>
              Shope
            </span>

            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M15.1725 7.53587L9.99988 2.36328L4.82727 7.53587L6.00578 8.71437L9.99988 4.72031L13.994 8.71437L15.1725 7.53587ZM4.82715 12.4645L9.99971 17.6371L15.1723 12.4645L13.9938 11.286L9.99971 15.2801L6.00566 11.286L4.82715 12.4645Z"
                  fill="#71717A"
                />
              </svg>
            </div>
          </div>

          {/* Search bar */ }

          <div className="relative mt-5 flex gap-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 px-4 py-2 bg-gray-200  hover:bg-white rounded-md focus:outline-none"
            />
            <IoIosSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="mt-2">
              <h1 className="font-semibold text-lg ">Menu</h1>
              <ul>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200 bg-white rounded-md">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaHome className="w-5 h-5 mr-3 text-[#84CC16]" />
                    Home
                  </a>
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                  <a href="#" className="flex items-center text-gray-800">
                    <BiCategoryAlt className="w-5 h-5 mr-3" />
                    Catalog
                  </a>
                  <MdOutlineKeyboardArrowDown className="h-6 w-6 text-gray-500" />
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaDollarSign className="w-5 h-5 mr-3" />
                    Finances
                  </a>
                  <MdOutlineKeyboardArrowDown className="h-6 w-6 text-gray-500" />
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaUsers className="w-5 h-5 mr-3" />
                    Customers
                  </a>
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaBullhorn className="w-5 h-5 mr-3" />
                    Marketing
                  </a>
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaChartBar className="w-5 h-5 mr-3" />
                    Analytics
                  </a>
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                  <a href="#" className="flex items-center text-gray-800">
                    <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3" />
                    Integrations
                  </a>
                  <BiPlus className="h-6 w-6 text-gray-500" />
                </li>

                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                  <a
                    href="#"
                    className="flex items-center text-gray-800 font-semibold"
                  >
                    <BiCategoryAlt className="w-5 h-5 mr-3" />
                    Integrations
                  </a>
                  <MdOutlineKeyboardArrowDown className="h-6 w-6 text-gray-500" />
                </li>

                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                  <a href="#" className="flex items-center text-gray-800">
                    <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3" />
                    Sales Channels
                  </a>
                  <BiPlus className="h-6 w-6 text-gray-500" />
                </li>

                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between items-center">
                  <a href="#" className="flex items-center text-gray-800">
                    <FaShoppingCart className="w-5 h-5 mr-3" />
                    Online Store
                  </a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.78524 15.6517L6.17537 15.2203L6.83159 12.7713C5.84067 12.4063 4.93018 11.875 4.13398 11.2113L2.33953 13.0057L1.16103 11.8272L2.95547 10.0328C1.96285 8.84208 1.26646 7.39571 0.979492 5.80698L2.61956 5.50879C3.25208 9.01066 6.31577 11.6669 9.99984 11.6669C13.6839 11.6669 16.7477 9.01066 17.3802 5.50879L19.0203 5.80698C18.7333 7.39571 18.0368 8.84208 17.0443 10.0328L18.8387 11.8272L17.6602 13.0057L15.8658 11.2113C15.0695 11.875 14.159 12.4063 13.1681 12.7713L13.8243 15.2203L12.2145 15.6517L11.558 13.2017C11.0516 13.2884 10.531 13.3336 9.99984 13.3336C9.46876 13.3336 8.94809 13.2884 8.44176 13.2017L7.78524 15.6517Z"
                      fill="#71717A"
                    />
                  </svg>
                </li>
                <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between items-center">
                  <a href="#" className="flex items-center text-gray-800">
                    <RiLinksFill className="w-5 h-5 mr-3" />
                    Sell Via Link
                  </a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.78524 15.6517L6.17537 15.2203L6.83159 12.7713C5.84067 12.4063 4.93018 11.875 4.13398 11.2113L2.33953 13.0057L1.16103 11.8272L2.95547 10.0328C1.96285 8.84208 1.26646 7.39571 0.979492 5.80698L2.61956 5.50879C3.25208 9.01066 6.31577 11.6669 9.99984 11.6669C13.6839 11.6669 16.7477 9.01066 17.3802 5.50879L19.0203 5.80698C18.7333 7.39571 18.0368 8.84208 17.0443 10.0328L18.8387 11.8272L17.6602 13.0057L15.8658 11.2113C15.0695 11.875 14.159 12.4063 13.1681 12.7713L13.8243 15.2203L12.2145 15.6517L11.558 13.2017C11.0516 13.2884 10.531 13.3336 9.99984 13.3336C9.46876 13.3336 8.94809 13.2884 8.44176 13.2017L7.78524 15.6517Z"
                      fill="#71717A"
                    />
                  </svg>
                </li>
              </ul>
            </nav>
          </div>
          <div className="border-t bg-white px-2 py-4 mt-20 mb-4 rounded-md">
            <div className="flex items-center mb-4 border-b pb-2">
              <FaUserCircle className="w-10 h-10 mr-3 text-gray-800" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Max Verstappen
                </h3>
                <p className="text-sm text-gray-600">lewis@mail.com</p>
              </div>
            </div>
            <ul>
              <li className="mb-1 flex justify-between items-center hover:bg-gray-200">
                <a
                  href="#"
                  className="flex items-center text-gray-800  px-4 py-2"
                >
                  <FaCog className="w-5 h-5 mr-3" />
                  Settings
                </a>
                <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3 cursor-pointer" />
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="flex items-center text-gray-800 hover:bg-gray-200 px-3 py-2"
                >
                  <BiLogOutCircle className="w-6 h-6 mr-3" />
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
