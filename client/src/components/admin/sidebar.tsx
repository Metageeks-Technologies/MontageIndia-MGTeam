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
import
{
  BiCategoryAlt,
  BiPlus,
  BiLogOutCircle,
  BiLogInCircle,
} from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import
{
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlinePayment,
} from "react-icons/md";
import { RiLinksFill } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { images } from "../../../public/images/image";
import instance from "@/utils/axios";
import { notifySuccess } from "@/utils/toast";
import Link from "next/link";
import Swal from "sweetalert2";

const Sidebar = () =>
{
  const [ isProductOpen, setIsProductOpen ] = useState( false );
  const [ isUserOpen, setIsUserOpen ] = useState( false );
  const [ isCustomerOpen, setIsCustomerOpen ] = useState( false );
  const [ isCategoryOpen, setIsCategoryOpen ] = useState( false );
  const [ currentUser, setCurrentUser ] = useState<any>( "" );
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = useCallback( ( menuSetter: any ) =>
  {
    menuSetter( ( prev: any ) => !prev );
  }, [] );

  const initialFunc = () => {
    setIsCategoryOpen( false );
    setIsCustomerOpen( false );
    setIsUserOpen( false );
    setIsProductOpen( false );

  }

  const handleLogout = async () =>
  {
    try
    {
      const response = await instance.get( "/auth/admin/logout" );
      notifySuccess( response.data.message  ); 
      setCurrentUser( "" );
      router.push( "/auth/admin/login" );
    } catch ( error )
    {
      console.error( "Error in logout:", error );
    }
  };

  useEffect( () =>
  {
    // Fetching user details
    instance
      .get( "/auth/admin/getCurrAdmin" )
      .then( ( response ) =>
      {
        // console.log( 'User details:', response.data );
        setCurrentUser( response.data.user );
      } )
      .catch( ( error ) =>
      {
        console.error( "Error fetching user details:", error );
      } );
  }, [] );

  const isActiveLink = ( path: string ) =>
  {
    return pathname === path ;
  };


  return (
      <div
        id="r"
        className=" w-64 top-0 left-0 z-40 overflow-scroll p-4 rounded-md bg-pureWhite-light"
        aria-label="Sidebar"
      >
        <div className=" py-2 w-full bg-pureWhite-light flex flex-col justify-between ">
          {/* <div className="flex items-center mb-4 justify-between w-[80%]">
            <div>
              <img src={images.logo.src} alt="logo" className="h-8 mr-3" />
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
          </div> */}

          {/* <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 px-4 py-2 bg-gray-200 hover:bg-white rounded-md focus:outline-none"
            />
            <IoIosSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          </div> */}
          <div className="flex flex-col  justify-between">
            <ul className="space-y-2 font-medium">
              <li  className={ `rounded-lg cursor-pointer ${ isActiveLink( "/admin/dashboard" ) ? "bg-webred text-pureWhite-light hover:bg-webred" : "hover:bg-webred-light" }` } >
                <Link href='/admin/dashboard' className="flex items-center w-full p-2 text-base  transition duration-75 rounded-lg group   ">
                  <FaHome className="w-5 h-5  transition duration-75 " />
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Dashboard</span>
                </Link>
              </li>



              { currentUser && (
                <li>
                  <Link
                    href={ "/admin/product/available" }
                    onClick={ () => toggleMenu( "product" ) }
                    className={ `flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-webred-light ${ !isProductOpen ? 'bg-white' : 'bg-pageBg-light' }` }
                  >
                    <BiCategoryAlt className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      Product
                    </span>
                    { isProductOpen ? (
                      <MdOutlineKeyboardArrowUp className="w-5 h-5 " />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                    ) }
                  </Link>
                  { isProductOpen && (
                    <ul className={ `py-2 space-y-2 ${ isProductOpen ? "bg-pageBg-light  p-4" : "" }` }>
                      <li>
                        <Link
                          href="/admin/product/create"
                          className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  ${ isActiveLink( "/admin/product/create" )
                            ? "bg-webred text-pureWhite-light"
                            : "hover:bg-webred-light"
                            }` }
                        >
                          Create
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/product/available" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( '/admin/product/available' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Published</Link>

                      </li>
                      <li>
                        <Link
                          href="/admin/product/draft"
                          className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( "/admin/product/draft" )
                            ? "bg-webred text-pureWhite-light"
                            : "hover:bg-webred-light"
                            }` }
                        >
                          Draft
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/product/archive" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( '/admin/product/archive' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Deleted</Link>
                      </li>
                      <li>
                        {/* <Link href="/admin/product/unavailable" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-webred-light cursor-pointer ${ isActiveLink( '/admin/product/unavailable' ) ? 'bg-webred text-pureWhite-light' : '' }` }>Unavailable</Link> */ }
                      </li>

                    </ul>
                  ) }
                </li>
              ) }
              { currentUser && currentUser.role === "superadmin" && (
                <li>
                  <Link
                    href={ "/admin/user/userList" }
                    onClick={ () => toggleMenu( "user" ) }
                    className={ `flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-webred-light ${ !isUserOpen ? "" : "bg-pageBg-light rounded-none" }` }
                  >
                    <FaUserFriends className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Staff</span>
                    { isUserOpen ? (
                      <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                    ) }
                  </Link>
                  { isUserOpen && (
                    <ul className={ `py-2 space-y-2 ${ !isUserOpen ? "" : "bg-pageBg-light rounded-none p-4" }` }>
                      <li>
                        <Link href="/admin/user/userList" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group cursor-pointer ${ isActiveLink( '/admin/user/userList' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Staff List</Link>
                      </li>
                      <li>
                        <Link href="/admin/user/user-create" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( '/admin/user/user-create' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }> Create Staff</Link>
                      </li>
                      <li>
                        <Link href="/admin/user/user-activity" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( '/admin/user/user-activity' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Staff Activity</Link>
                      </li>
                    </ul>
                  ) }
                </li>
              ) }
              { currentUser && currentUser.role === "superadmin" && (
                <>


                  <li>
                    <Link
                      href={ "/admin/category" }
                      onClick={ () => toggleMenu( "category" ) }
                      className={ `flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-webred-light ${ !isCategoryOpen ? "" : "bg-pageBg-light rounded-none" }` }
                    >
                      <FaCampground className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                      <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Category</span>
                      { isCategoryOpen ? (
                        <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                      ) : (
                        <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                      ) }
                    </Link>
                    { isCategoryOpen && (
                      <ul className={ `py-2 space-y-2 ${ !isCategoryOpen ? "" : "bg-pageBg-light rounded-none p-4" }` }>
                        <li>
                          <Link href="/admin/category/create" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group cursor-pointer ${ isActiveLink( '/admin/category/create' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Add New Category</Link>
                        </li>
                        <li>
                          <Link href="/admin/category" className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( '/admin/category' ) ? 'bg-webred text-pureWhite-light' : 'hover:bg-webred-light' }` }>Categories List</Link>
                        </li>

                      </ul>
                    ) }
                  </li>

                  <li>
                    <a
                      onClick={ () => toggleMenu( "customer" ) }
                      className={ `flex items-center p-2 text-gray-900 rounded-lg hover:bg-webred-light cursor-pointer group ${ isCustomerOpen ? 'bg-pageBg-light rounded-none' : '' }` }
                    >
                      <FaUsers className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        Customers
                      </span>
                      { isCustomerOpen ? (
                        <MdOutlineKeyboardArrowUp className="w-5 h-5" />
                      ) : (
                        <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                      ) }
                    </a>
                    { isCustomerOpen && (
                      <ul className={ `py-2 space-y-2 ${ !isCustomerOpen ? "" : "bg-pageBg-light rounded-none p-4" }` }>
                        <li>
                          <Link
                            href="/admin/subscription"
                            className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( "/admin/subscription" )
                              ? "bg-webred text-pureWhite-light"
                              : "hover:bg-webred-light"
                              }` }
                          >
                            Subscription
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/admin/subscription-history"
                            className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( "/admin/subscription-history" )
                              ? "bg-webred text-pureWhite-light"
                              : "hover:bg-webred-light"
                              }` }
                          >
                            Subscription History
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/admin/transaction"
                            className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( "/admin/transaction" )
                              ? "bg-webred text-pureWhite-light"
                              : "hover:bg-webred-light"
                              }` }
                          >
                            Transaction History
                          </Link>
                        </li>

                        <li>
                          <Link
                            href="/admin/customer-list"
                            className={ `flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  cursor-pointer ${ isActiveLink( "/admin/customer-list" )
                              ? "bg-webred text-pureWhite-light"
                              : "hover:bg-webred-light"
                              }` }
                          >
                            Customer List
                          </Link>
                        </li>

                      </ul>
                    ) }
                  </li>
                </>
              ) }

              {/* <li>
                <a
                  href="/Not-Found"
                  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-webred-light   group"
                >
                  <FaBullhorn className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Marketing
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/Not-Found"
                  className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-webred-light   group"
                >
                  <FaChartBar className="w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900  " />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Analytics
                  </span>
                </a>
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between">
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800"
                >
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
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800"
                >
                  <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3" />
                  Sales Channels
                </a>
                <BiPlus className="h-6 w-6 text-gray-500" />
              </li>

              <li className="mb-1 px-4 py-2 hover:bg-gray-200 flex justify-between items-center">
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800"
                >
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
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800"
                >
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
              </li> */}
            </ul>
          </div>

          <div className="border-t bg-white px-2 py-4 mt-5 rounded-md w-[90%]">
            <div
              className="flex items-center mb-4 border-b pb-2 cursor-pointer"
              onClick={ () => router.push( "/admin/profile" ) }
            >
              <FaUserCircle className="w-10 h-10 mr-3 text-gray-800" />
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  { currentUser.name }
                </h3>
                <p className="text-sm text-gray-600">{ currentUser.email }</p>
              </div>
            </div>
            <ul>
              {/* <li className="mb-1 flex justify-between items-center hover:bg-gray-200">
                <a
                  href="/Not-Found"
                  className="flex items-center text-gray-800  px-4 py-2"
                >
                  <FaCog className="w-5 h-5 mr-3" />
                  Settings
                </a>
                <MdOutlineKeyboardArrowDown className="w-6 h-6 mr-3 cursor-pointer" />
              </li> */}
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
      </div>
  
  );
};

export default Sidebar;
