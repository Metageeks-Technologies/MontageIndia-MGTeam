"use client";
import React, { useState } from "react";
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDropdown, IoMdArrowDropdown } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import CartPopup from "../cart/cartPage";
import { FaUserCircle } from "react-icons/fa";
import instance from "@/utils/axios";
import { ImCross } from "react-icons/im";
import { notifySuccess } from "@/utils/toast";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import Swal from "sweetalert2";
import debounce from "lodash.debounce";
import { setVideoPage } from "@/app/redux/feature/product/slice";
import { getVideo } from "@/app/redux/feature/product/video/api";
import { IoSearchOutline } from "react-icons/io5";

const Sidebar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const categoryParam = category ? ["editor choice"] : "";
  const [isUserOpen, setIsUserOpen] = useState(false);
  const user = useAppSelector((state: any) => state.user?.user?._id);
  const cart = useAppSelector((state) => state.product.cart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);
  const getData = () => {
    fetchData(1);  
  
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getData();
    }
  };
  const handleLogout = async () => {
    try {
      const response = await instance.get("/user/logout");
      // notifySuccess(response.data.message);
      Swal.fire( {
        title: "Logged out successfully",
        icon: "success",
        timer: 2000,
      } );
      router.push("/auth/user/login");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };
  const handleClear = () => {
    setSearchTerm(''); // Clear the search term
    dispatch(setVideoPage(1))
    getVideo(dispatch, {
      page:1,
      mediaType: ["video"],
      productsPerPage: "6",
      category: categoryParam,
    });};
  const fetchData = (page: number) => {
    if (!searchTerm.trim()) {
      // If searchTerm is empty or contains only whitespace, fetch videos automatically
      getVideo(dispatch, {
        page,
        mediaType: ["video"],
        category: categoryParam,
        productsPerPage: "6",
      });
    } else {
      // Fetch videos based on the searchTerm
      getVideo(dispatch, {
        page,
        mediaType: ["video"],
        searchTerm,
        category: categoryParam,
        productsPerPage: "6",
      });
    }
  };
  const handleUserIconClick = () => {
    setIsUserOpen(!isUserOpen);
  };

  const handleProfileClick = () => {
    setIsUserOpen(false);
    router.push("/user-profile");
  };

  return (
  <>
    <div className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-md">
      <div className="flex items-center gap-5">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-44 h-10 cursor-pointer"
          onClick={() => router.push("/")}
        />
        <div className="hidden lg:flex items-center space-x-4">
          <ul className="flex items-center space-x-4 cursor-pointer">
            <li
              className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
              onClick={() => router.push("/image")}
            >
              Images
            </li>
            <li
              className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
              onClick={() => router.push("/video")}
            >
              Video
            </li>
            <li
              className="text-gray-700 hover:text-black transition duration-300 ease-in-out"
              onClick={() => router.push("/audio")}
            >
              Audio
            </li>
            <li
              className="text-gray-700 relative flex flex-row items-center gap-2 hover:text-black transition duration-300 ease-in-out"
              onClick={toggleDropdown}

            >
              Editor Choice <span className={`${isDropdownOpen?"rotate-180 transform duration-75":"rotate-0 transform duration-75"}`}> <IoIosArrowDropdown /></span>
              {isDropdownOpen && (
              <div
                className="absolute w-36 flex flex-col items-center gap-6 -left-4 justify-center  top-full  mt-2 bg-white border rounded shadow-xl p-4 z-50"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={closeDropdown}
              >
              <div className="flex flex-col gap-2">
                <Link
                     href={{
                      pathname: '/image',
                      query: { category: 'editorchoice' },
                    }}
                  className="text-gray-600 hover:text-gray-800 "
                >
                  Editor Image
                </Link>
                <Link
                     href={{
                      pathname: '/video',
                      query: { category: 'editorchoice' },
                    }}
                  className="text-gray-600 hover:text-gray-800 "
                >
                  Editor Video
                  </Link>
                <Link
                     href={{
                      pathname: '/audio',
                      query: { category: 'editorchoice' },
                    }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Editor Audio
                  </Link>
              </div>
            </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="lg:block md:hidden hidden">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-700">
            <span>0 Credits Available</span>
            <IoMdArrowDropdown className="ml-1" />
          </div>
          <Link href="/user-profile/favorites" >
            <AiOutlineHeart
              className="text-gray-700 hover:text-webred cursor-pointer w-7 h-7 transition-transform duration-200 ease-in-out hover:scale-110"
            />
          </Link>
          
          <CartPopup />
          <div className="relative">
            <FaUserCircle
              onClick={handleUserIconClick}
              className="text-gray-700 w-10 h-10 cursor-pointer hover:text-black transition duration-300 ease-in-out"
            />
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
                    onClick={() => router.push("/auth/user/login")}
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
          onClick={() => setMenuOpen(true)}
        />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
          <div className="flex justify-between items-center">
            <AiOutlineClose
              className="text-gray-700 w-6 h-6 cursor-pointer hover:text-black transition-transform duration-200 ease-in-out hover:scale-110"
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <ul className="mt-4 space-y-3">
            <li
              className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
              onClick={() => router.push("/image")}
            >
              Images
            </li>
            <li
              className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
              onClick={() => router.push("/video")}
            >
              Video
            </li>
            <li
              className="block text-gray-700 hover:text-black py-2 transition-colors duration-300 ease-in-out"
              onClick={() => router.push("/audio")}
            >
              Music
            </li>
          </ul>
        </div>
      )}
    </div>
          <div className="flex relative my-6  justify-between items-center flex-row gap-4  bg-gray-100 border border-gray-300 rounded-md w-[90%] m-auto">
            <div className="flex flex-row px-3 w-full  gap-5">
          <button className="md:flex flex-row items-center px-4 py-2  hidden outline-none gap-2 text-black hover:bg-gray-200 rounded-md">
            <img src="/asset/28-camera-1.svg" alt="" />
            <span>Videos</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <img src="/asset/Rectangle 15.png" className="hidden py-2 md:block" alt="" />
          <div className="lg:w-[80%] sm:w-[90%]  w-[90%] md:w-[65%]  py-1 gap-2 md:gap-0 items-center justify-center flex">
          <input
            type="text"
            placeholder="Search for Videos"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyDown={handleKeyDown} 
            className="flex-grow py-1 md:px-4 outline-none  bg-gray-100 rounded-md"
          />
        <span onClick={()=>handleClear()} className={searchTerm ? "block text-gray-400 cursor-pointer": "hidden" }>
          <ImCross />
        </span>
          </div>
          </div>
          <div onClick={getData} className=" cursor-pointer absolute -top-[1px] -bottom-[1px] -right-[1px] flex justify-center m-auto w-12 rounded-r-md bg-[#8D529C]">
            <IoSearchOutline className="h-full text-white w-6 " />
          </div>
        </div>
        </>
  );
};

export default Sidebar;
