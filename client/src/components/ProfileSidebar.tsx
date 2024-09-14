"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import {AiOutlineUser } from "react-icons/ai";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useState } from "react";
import { BsCartCheck } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { MdHistory, MdLogout } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { BsBookmarkHeart } from "react-icons/bs";
import { signOutUser } from "@/utils/loginOptions";

const ProfileSidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState<string>("");

  const pathname = usePathname();
  // console.log("pathname:::", pathname);

  useEffect(() => {
    if (pathname === "/user-profile") {
      setActive("Profile");
    } else if (pathname === "/user-profile/purchased-product") {
      setActive("purchasedProduct");
    } else if (pathname === "/user-profile/purchase-history") {
      setActive("purchasedHistory");
    } else if (pathname === "/user-profile/subscription") {
      setActive("subscription");
    } else if (pathname === "/user-profile/wishlist") {
      setActive("wishlist");
    } else if (pathname === "/user-profile/settings") {
      setActive("settings");
    }
  }, [pathname]);

  const handleLogOut = async () => {
    console.log("logout");
    await signOutUser();
    notifySuccess("Logout successfully");
    router.push("/auth/user/login");
  };

  return (
    <div
      className={`md:block hidden z-50 my-6 ml-4 rounded-md text-black transition-transform duration-300 ease-in-out md:translate-x-0 md:w-[20%]`}
    >
      <div className="px-2 py-4 h-full bg-white rounded-md">
        <h1 className="text-md text-black font-bold px-4">My Account</h1>
        <div className="mt-4">
          <div
            onClick={() => {
              setActive("Profile");
              router.push(`/user-profile`);
            }}
            className={`flex items-center mb-1 px-4 py-2 hover:rounded-lg  cursor-pointer ${
              active === "Profile"
                ? "bg-webred text-white rounded-lg"
                : "hover:bg-gray-300 text-black"
            } `}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <AiOutlineUser className="h-5 w-5" />
                <span className="text-md" >Profile</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            onClick={() => {
              setActive("purchasedProduct");
              router.push(`/user-profile/purchased-product`);
            }}
            className={`flex mb-1 items-center px-4 py-2   hover:rounded-lg cursor-pointer ${
              active === "purchasedProduct"
                ? "bg-webred  text-white rounded-lg"
                : "hover:bg-gray-300 text-black"
            }`}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <BsCartCheck className="h-5 w-5" />
                <span className="text-md" >My Product</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            onClick={() => {
              setActive("purchasedHistory");
              router.push(`/user-profile/purchase-history`);
            }}
            className={`flex mb-1 items-center px-4 py-2 hover:rounded-lg cursor-pointer ${
              active === "purchasedHistory"
                ? "bg-webred text-white rounded-lg"
                : "hover:bg-gray-300 text-black"
            }`}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <MdHistory className=" h-5 w-5" />
                <span className="text-md" >Purchase History</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            onClick={() => {
              setActive("subscription");
              router.push(`/user-profile/subscription`);
            }}
            className={`flex mb-1 items-center px-4 py-2   hover:rounded-lg cursor-pointer ${
              active === "subscription"
                ? "bg-webred text-white  rounded-lg"
                : "text-black hover:bg-gray-300"
            }`}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <FaRegCreditCard className="h-5 w-5" />
                <span className="text-md" >Subscription</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            onClick={() => {
              setActive("wishlist");
              router.push(`/user-profile/wishlist`);
            }}
            className={`flex mb-1 items-center px-4 py-2  hover:rounded-lg cursor-pointer ${
              active === "wishlist"
                ? "bg-webred text-white  rounded-lg"
                : "text-black hover:bg-gray-300"
            }`}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <BsBookmarkHeart className="h-5 w-5" />
                <span className="text-md" >Wishlist</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            onClick={() => {
              setActive("settings");
              router.push("/user-profile/settings");
            }}
            className={`flex mb-1 items-center px-4 py-2  hover:rounded-lg cursor-pointer ${
              active === "settings"
                ? "bg-webred text-white rounded-lg"
                : "text-black hover:bg-gray-300"
            }`}
          >
            <div className="w-full flex justify-between items-center">
              <div className="flex gap-2 justify-start items-center">
                <FiSettings className="h-5 w-5" />
                <span className="text-md" >Settings</span>
              </div>
              <IoIosArrowForward />
            </div>
          </div>
          <div
            className="flex mb-1 items-center text-webred px-4 py-2 hover:bg-gray-300 hover:rounded-lg cursor-pointer"
          >
            <div className="w-full flex justify-between items-center">
              <div
                onClick={()=>handleLogOut()}
                className="flex gap-2 justify-start items-center"
              >
                <MdLogout className="h-5 w-5" />
                <span className="text-md" >Log Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
