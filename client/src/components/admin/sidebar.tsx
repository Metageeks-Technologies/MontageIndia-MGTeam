"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  FaCampground,
} from "react-icons/fa";
import { BiCategoryAlt, BiPlus, BiLogOutCircle, BiLogInCircle } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp,MdOutlinePayment } from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { images } from "../../../public/images/image";
import instance from "@/utils/axios";
import { notifySuccess } from "@/utils/toast";
import Link from "next/link";

const Sidebar = () =>
{
  const [ isProductOpen, setIsProductOpen ] = useState( false );
  const [ isUserOpen, setIsUserOpen ] = useState( false );
  const [ currentUser, setCurrentUser ] = useState<any>( '' );
  const router = useRouter();
  const pathname = usePathname();


  const toggleMenu = useCallback( ( menuSetter: any ) =>
  {
    menuSetter( ( prev: any ) => !prev );
  }, [] );


  const handleLogout = ( async () =>
  {
    try
    {
      const response = await instance.get( '/auth/admin/logout' );
      notifySuccess( response.data.message );
      setCurrentUser( '' );
      router.push( '/auth/admin/login' );
    } catch ( error )
    {
      console.error( "Error in logout:", error );
    }
  } );

  useEffect( () =>
  {
    // Fetching user details 
    instance.get( '/auth/admin/getCurrAdmin' )
      .then( response =>
      {
        // console.log( 'User details:', response.data );
        setCurrentUser( response.data.user );
      } )
      .catch( error =>
      {
        console.error( 'Error fetching user details:', error );
      } );
  }, [] );

  const isActiveLink = ( path: string ) => pathname.startsWith( path );

  return (
    <div className="flex">
      <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="sidebar-multi-level-sidebar" className="fixed w-full md:w-[20%] sm:w-[20%] hidden sm:block top-0 left-0 z-40 min-h-screen bg-gray-700" aria-label="Sidebar">
        <div className="h-screen py-2 w-full overflow-y-auto bg-[#ececed] flex flex-col justify-between items-center ">

          <div className="flex items-center mb-4 justify-between w-[80%]">
            <div>
              <img src={ images.logo.src } alt="logo" className="h-8 mr-3" />
            </div>
            <div className="h-8 w-8 cursor-pointer flex justify-center items-center rounded-full bg-white shadow-lg border border-gray-300"  >
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

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 px-4 py-2 bg-gray-200 hover:bg-white rounded-md focus:outline-none"
            />
            <IoIosSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div>
          <div className="flex flex-col items-center justify-between">

            <ul className="space-y-2 font-medium">
              <li onClick={ () => router.push( '/admin/dashboard' ) } className={ `cursor-pointer ${ isActiveLink( '/admin/dashboard' ) ? 'bg-gray-100' : '' }` }>
                <a className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                  <FaHome className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " />
                  <span className="ms-3">Home</span>
                </a>
              </li>
              { currentUser &&
                <li>
                  <Link href={ '/admin/product/available' } onClick={ () => toggleMenu( setIsProductOpen ) } className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100   ">
                    <BiCategoryAlt className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Product</span>
                    { isProductOpen ? (
                      <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                    ) }
                  </Link>
                  { isProductOpen && (
                    <ul className="py-2 space-y-2">
                      <li>
                        <Link href="/admin/product/available" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/product/available' ) ? 'bg-white' : '' }` }>Published</Link>

                      </li>
                      <li>
                        <Link href="/admin/product/draft" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/product/draft' ) ? 'bg-white' : '' }` }>Draft</Link>
                      </li>
                      <li>
                        <Link href="/admin/product/archive" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/product/archive' ) ? 'bg-white' : '' }` }>Deleted</Link>
                      </li>
                      <li>
                        {/* <Link href="/admin/product/unavailable" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/product/unavailable' ) ? 'bg-white' : '' }` }>Unavailable</Link> */}
                      </li>
                      <li>
                        <Link href="/admin/product/create" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 ${ isActiveLink( '/admin/product/create' ) ? 'bg-white' : '' }` }>Create</Link>
                      </li>
                    </ul>
                  ) }
                </li>
              }
              { currentUser && currentUser.role === "superadmin" &&
                <li>
                  <Link href={ '/admin/user/userList' } onClick={ () => toggleMenu( setIsUserOpen ) } className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100   ">
                    <FaUserFriends className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Staff</span>
                    { isUserOpen ? (
                      <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                    ) }
                  </Link>
                  { isUserOpen && (
                    <ul className="py-2 space-y-2">
                      <li>
                        <Link href="/admin/user/userList" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/user/userList' ) ? 'bg-white' : '' }` }>Staff List</Link>
                      </li>
                      <li>
                        <Link href="/admin/user/user-create" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/user/user-create' ) ? 'bg-white' : '' }` }> Create Staff</Link>
                      </li>
                      <li>
                        <Link href="/admin/user/user-activity" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 cursor-pointer ${ isActiveLink( '/admin/user/user-activity' ) ? 'bg-white' : '' }` }>Staff Activity</Link>
                      </li>
                    </ul>
                  ) }
                </li>
              }
              { currentUser && currentUser.role === "superadmin" && 
              <>
                <li>
                  <a href="/admin/category" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                    <FaCampground className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 whitespace-nowrap">Category</span>
                  </a>
                </li>
                <li>
                <a href="/Not-Found" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                  <FaUsers className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                  <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
                </a>
              </li>
                <li>
                  <a href="/admin/subscription" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                    <MdOutlinePayment className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 whitespace-nowrap">Subscription</span>
                  </a>
                </li>
                </>
              }
              
              <li>
                <a href="/Not-Found" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                  <FaBullhorn className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                  <span className="flex-1 ms-3 whitespace-nowrap">Marketing</span>
                </a>
              </li>
              <li>
                <a href="/Not-Found" className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100   group">
                  <FaChartBar className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                  <span className="flex-1 ms-3 whitespace-nowrap">Analytics</span>
                </a>
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                <a href="/Not-Found" className="flex items-center text-gray-800">
                  <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3" />
                  Integrations
                </a>
                <BiPlus className="h-6 w-6 text-gray-500" />
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800 font-semibold"
                >
                  <BiCategoryAlt className="w-5 h-5 mr-3" />
                  Integrations
                </a>
                <MdOutlineKeyboardArrowDown className="h-6 w-6 text-gray-500" />
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                <a href="/Not-Found" className="flex items-center text-gray-800">
                  <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3" />
                  Sales Channels
                </a>
                <BiPlus className="h-6 w-6 text-gray-500" />
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between items-center">
                <a href="/Not-Found" className="flex items-center text-gray-800">
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
                <a href="/Not-Found" className="flex items-center text-gray-800">
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
          </div>

          <div className="border-t bg-white px-2 py-4 mt-5 rounded-md w-[90%] mx-auto">
            <div className="flex items-center mb-4 border-b pb-2 cursor-pointer" onClick={ () => router.push( '/admin/profile' ) }>
              <FaUserCircle className="w-10 h-10 mr-3 text-gray-800" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  { currentUser.name }
                </h3>
                <p className="text-sm text-gray-600">{ currentUser.email }</p>
              </div>
            </div>
            <ul>
              <li className="mb-1 flex justify-between items-center hover:bg-gray-200">
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800  px-4 py-2"
                >
                  <FaCog className="w-5 h-5 mr-3" />
                  Settings
                </a>
                <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3 cursor-pointer" />
              </li>
              <li className="mb-1 cursor-pointer">
                { currentUser ? (
                  <a

                    onClick={ handleLogout }
                    className="flex items-center text-gray-800 hover:bg-gray-200 px-3 py-2"
                  >
                    <BiLogOutCircle className="w-6 h-6 mr-3" />
                    Log out
                  </a>
                ) : (
                  <a
                    href="/auth/admin/login"
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
    </div>
  );
};

export default Sidebar;