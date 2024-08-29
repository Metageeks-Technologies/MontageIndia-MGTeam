"use client";
import React, {useState} from "react";
import {AiOutlineHeart, AiOutlineMenu, AiOutlineClose} from "react-icons/ai";
import {IoIosArrowDropdown, IoMdArrowDropdown} from "react-icons/io";
import {useRouter, useSearchParams} from "next/navigation";
import CartPopup from "../cart/cartPage";
import {FaUserCircle} from "react-icons/fa";
import instance from "@/utils/axios";
import {BiLogInCircle, BiLogOutCircle} from "react-icons/bi";
import {useAppDispatch, useAppSelector} from "@/app/redux/hooks";
import Link from "next/link";
import Swal from "sweetalert2";
import {notifySuccess} from "@/utils/toast";
//
const Sidebar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState( false );
  const [isUserOpen, setIsUserOpen] = useState( false );
  const {user} = useAppSelector( ( state ) => state.user );
  const cart = useAppSelector( ( state ) => state.product.cart );
  const [isDropdownOpen, setIsDropdownOpen] = useState( false );
  const toggleDropdown = () => setIsDropdownOpen( !isDropdownOpen );
  const closeDropdown = () => setIsDropdownOpen( false );

  const handleLogout = async () => {
    try {
      const response = await instance.get( "/user/logout" );

      router.push( "/auth/user/login" );
      notifySuccess( "Logout successfully" );
    } catch ( error ) {
      console.error( "Error in logout:", error );
    }
  };

  const handleUserIconClick = () => {
    setIsUserOpen( !isUserOpen );
  };

  const handleProfileClick = () => {
    setIsUserOpen( false );
    router.push( "/user-profile" );
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
        <div className="flex items-center gap-5">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-44 h-10 cursor-pointer"
            onClick={() => router.push( "/" )}
          />
          <div className="hidden lg:flex items-center space-x-4">
            <ul className="flex items-center space-x-4 cursor-pointer">
              <li
                className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
                onClick={() => router.push( "/video" )}
              >
                Video
              </li>
              <li
                className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
                onClick={() => router.push( "/image" )}
              >
                Images
              </li>
              <li
                className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
                onClick={() => router.push( "/audio" )}
              >
                Audio
              </li>
              <li
                className="text-gray-700 relative flex flex-row items-center gap-2 hover:text-black transition duration-300 ease-in-out"
                onClick={toggleDropdown}
              >
                Editor Choice{" "}
                <span
                  className={`${isDropdownOpen
                      ? "rotate-180 transform duration-75"
                      : "rotate-0 transform duration-75"
                    }`}
                >
                  {" "}
                  <IoIosArrowDropdown />
                </span>
                {isDropdownOpen && (
                  <div
                    className=" absolute w-36 flex flex-col items-center gap-6 -left-4 justify-center  top-full  mt-2 bg-white border rounded shadow-xl p-4 z-50"
                    onMouseEnter={() => setIsDropdownOpen( true )}
                    onMouseLeave={closeDropdown}
                  >
                    <div className="flex flex-col gap-2">
                      <Link
                        href={{
                          pathname: "/video",
                          query: {
                            category: "editor choice",
                            mediaType: "video",
                          },
                        }}
                        className="text-gray-600 hover:text-gray-800 "
                      >
                        Video
                      </Link> 
                      <Link
                        href={{
                          pathname: "/image",
                          query: {
                            category: "editor choice",
                            mediaType: "image",
                          },
                        }}
                        className="text-gray-600 hover:text-gray-800 "
                      >
                         Image
                      </Link>
                     
                      <Link
                        href={{
                          pathname: "/audio",
                          query: {
                            category: "editor choice",
                            mediaType: "audio",
                          },
                        }}
                        className="text-gray-600 hover:text-gray-800"
                      >
                         Audio
                      </Link>
                    </div>
                  </div>
                )}
              </li>
              <li
                className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
                onClick={() => router.push( "/ondemand" )}
              >
                On Demand
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:block md:hidden hidden">
          <div className="flex items-center space-x-6">
            {user?.subscription.status === "completed" && (
              <div className="flex items-center text-gray-700">
                <span>
                  {user?.subscription?.credits || 0} Credits Available
                </span>
              </div>
            )}
            <Link href="/user-profile/wishlist">
              <AiOutlineHeart className="text-gray-700 hover:text-webred cursor-pointer w-7 h-7 transition-transform duration-200 ease-in-out hover:scale-110" />
            </Link>

            <CartPopup />
            <div className="relative">
              {user ? (
                <img
                  src={user.image}
                  alt="user"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={handleUserIconClick}
                />
              ) : (
                <FaUserCircle
                  className="w-10 h-10 text-gray-700 cursor-pointer"
                  onClick={handleUserIconClick}
                />
              )}
              {isUserOpen && (
                <div className="absolute right-0 z-30 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 transition-all duration-200 ease-in-out transform origin-top-right">
                  {user ? (
                    <>
                      <a
                        onClick={handleLogout}
                        className="flex items-center text-gray-800 hover:bg-gray-100 px-3 py-2 cursor-pointer transition-colors duration-200"
                      >
                        <BiLogOutCircle className="w-6 h-6 mr-3" />
                        Logout
                      </a>

                      <a
                        onClick={handleProfileClick}
                        className="flex items-center text-gray-800 hover:bg-gray-100 px-3 py-2 cursor-pointer transition-colors duration-200"
                      >
                        <FaUserCircle className="w-6 h-6 mr-3" />
                        User Profile
                      </a>
                    </>
                  ) : (
                    <a
                      onClick={() => router.push( "/auth/user/login" )}
                      className="flex items-center text-gray-800 hover:bg-gray-100 cursor-pointer px-3 py-2 transition-colors duration-200"
                    >
                      <BiLogInCircle className="w-6 h-6 mr-3" />
                      Log In
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex lg:hidden items-center space-x-4">
          <AiOutlineHeart className="text-gray-700 w-6 h-6 hover:text-black transition-transform duration-200 ease-in-out hover:scale-110" />
          <CartPopup />
          <AiOutlineMenu
            className="text-gray-700 w-6 h-6 cursor-pointer hover:text-black transition-transform duration-200 ease-in-out hover:scale-110"
            onClick={() => setMenuOpen( true )}
          />
        </div>

        {menuOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
            <div className="flex justify-between items-center">
              <AiOutlineClose
                className="text-gray-700 w-6 h-6 cursor-pointer hover:text-black transition-transform duration-200 ease-in-out hover:scale-110"
                onClick={() => setMenuOpen( false )}
              />
            </div>
            <ul className="mt-4 space-y-3">
              <li
                className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
                onClick={() => router.push( "/image" )}
              >
                Images
              </li>
              <li
                className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
                onClick={() => router.push( "/video" )}
              >
                Video
              </li>
              <li
                className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
                onClick={() => router.push( "/audio" )}
              >
                Music
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
