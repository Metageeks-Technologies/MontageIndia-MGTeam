"use client";
import React, { useState } from "react";
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { useRouter } from "next/navigation";
import CartPopup from "../cart/cartPage";
import { FaUserCircle } from "react-icons/fa";
import instance from "@/utils/axios";
import { notifySuccess } from "@/utils/toast";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useAppSelector } from "@/app/redux/hooks";

const Sidebar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [isUserOpen, setIsUserOpen] = useState(false);
  const user = useAppSelector((state: any) => state.user?.user?._id);

  const handleLogout = async () => {
    try {
      const response = await instance.get("/user/logout");
      notifySuccess(response.data.message);
      router.push("/auth/user/login");
    } catch (error) {
      console.error("Error in logout:", error);
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
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
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
              onClick={() => router.push("/")}
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
          </ul>
        </div>
      </div>

      <div className="lg:block md:hidden hidden">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-700">
            <span>0 Credits Available</span>
            <IoMdArrowDropdown className="ml-1" />
          </div>
          <AiOutlineHeart
            onClick={() => router.push("/wishlist")}
            className="text-gray-700 cursor-pointer w-7 h-7 transition-transform duration-200 ease-in-out hover:scale-110"
          />
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
              onClick={() => router.push("/")}
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
  );
};

export default Sidebar;
