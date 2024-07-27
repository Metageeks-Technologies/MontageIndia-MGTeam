// components/Sidebar.js
"use client";

import React, { useEffect, useState } from "react";
import
{
  FaHome,
  FaUserFriends,
  FaUsers,
  FaBullhorn,
  FaChartBar,
  FaShoppingCart,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import { BiCategoryAlt, BiPlus, BiLogOutCircle, BiLogInCircle } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import
{
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";
import { IoBagHandleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { images } from "../../../../public/images/image";

const Sidebar = () =>
{
  const [ isProductOpen, setIsProductOpen ] = useState( false );
  const [ isUserOpen, setIsUserOpen ] = useState( false );
  const [ isLogin, setIslogin ] = useState( false );

 

  const toggleProductMenu = () =>
  {
    setIsProductOpen( !isProductOpen );
    setIsUserOpen( false );
  };

  const toggleUserMenu = () =>
  {
    setIsUserOpen( !isUserOpen );
    setIsProductOpen( false );
  };

  const router = useRouter();

  const handleAvailable = () =>
  {
    router.push( `/admin/product/available` );
  };

  const handleunavailable = () =>
  {
    router.push( `/admin/product/unavailable` );
  };

  const handleunarchive = () =>
  {
    router.push( `/admin/product/archive` );
  };

  const handleLogout = () =>
  {
    // Remove the token from storage or cookies
    localStorage.removeItem( 'token' );
    setIslogin( false );
  };

  useEffect( () =>
  {
    if(localStorage.getItem('token')) setIslogin(true)
  }, [isLogin] )


  return (
    <div className="flex">
      <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200    dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-gray-7  00" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-[#ececed] ">
          <div className="flex items-center mb-4">
            <img src={ images.logo.src } alt="logo" className="h-8 mr-3" />
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 px-4 py-2 bg-gray-200 hover:bg-white rounded-md focus:outline-none"
            />
            <IoIosSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>

          <ul className="space-y-2 font-medium">
            <li onClick={()=>router.push('/admin/dashboard')} className="cursor-pointer">
              <a  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                <FaHome className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " />
                <span className="ms-3">Home</span>
              </a>
            </li>
            <li>
              <button onClick={ toggleProductMenu } className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100   ">
                <BiCategoryAlt className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Product</span>
                { isProductOpen ? (
                  <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                ) }
              </button>
              { isProductOpen && (
                <ul className="py-2 space-y-2">
                  <li onClick={ handleAvailable } className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer">Available</li>
                  <li className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer">Draft</li>
                  <li onClick={ handleunarchive } className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer">Archived</li>
                  <li onClick={ handleunavailable } className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer">Unavailable</li>
                  <li className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100   ">Create</li>
                </ul>
              ) }
            </li>
            <li>
              <button onClick={ toggleUserMenu } className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100   ">
                <FaUserFriends className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">User</span>
                { isUserOpen ? (
                  <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                ) }
              </button>
              { isUserOpen && (
                <ul className="py-2 space-y-2">
                  <li className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer" onClick={ () => router.push( "/admin/user/userList" ) }>User List</li>
                  <li className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100    cursor-pointer" onClick={ () => router.push( "/admin/user/user-create" ) }>User Create</li>
                </ul>
              ) }
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                <FaUsers className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                <FaBullhorn className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                <span className="flex-1 ms-3 whitespace-nowrap">Marketing</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                <FaChartBar className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                <span className="flex-1 ms-3 whitespace-nowrap">Analytics</span>
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
              <li className="mb-1 cursor-pointer">
                { localStorage.getItem('token') ? (
                  <a
                    
                    onClick={ handleLogout }
                    className="flex items-center text-gray-800 hover:bg-gray-200 px-3 py-2"
                  >
                    <BiLogOutCircle className="w-6 h-6 mr-3" />
                    Log out
                  </a>
                ) : (
                  <a
                    href="/admin/login"
                    className="flex items-center text-gray-800 hover:bg-gray-200 px-3 py-2"
                  >
                    <BiLogInCircle className="w-6 h-6 mr-3" />
                    Log in
                  </a>
                ) }
              </li>
            </ul>
          </div>


        </div>
      </aside>

      <div>
        {/* Your main content goes here */ }
      </div>
    </div>
  );
};

export default Sidebar;