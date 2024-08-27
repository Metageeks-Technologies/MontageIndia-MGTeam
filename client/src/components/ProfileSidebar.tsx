"use client";
import { useRouter,usePathname } from "next/navigation";
import React,{useEffect} from "react";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLink,
} from "react-icons/ai";
import { useState } from "react";
import { BsCartCheck } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { MdHistory, MdLogout } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { FaRegCreditCard } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { CgMenuGridR } from "react-icons/cg";
import { LuPanelRightOpen } from "react-icons/lu";
import { LuPanelRightClose } from "react-icons/lu";
import { BsBookmarkHeart } from "react-icons/bs";
const ProfileSidebar = () => {
  const router= useRouter();
  const [active, setActive] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  console.log("pathname:::", pathname);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`z-50 text-black transition-transform duration-300 ease-in-out md:translate-x-0 md:w-[20%]`}
    >
      <div className="fixed bottom-0 left-0 flex items-center justify-between p-1 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-black bg-white rounded-full p-2  focus:outline-none"
        >
          <LuPanelRightClose size={30}  />
        </button>
      </div>
      <div
        className={`bg-white h-[100vh] flex-col ${
          isOpen ? "fixed bottom-0 left-0 flex rounded-tr-md " : "hidden"
        } md:flex`}
      >
        <div className="px-2 py-6 md:py-12">
          <h1 className="text-md text-black px-4 font-medium">My Account</h1>
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
                  <AiOutlineUser className="h-6 w-6" />
                  <span>Profile</span>
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
                  <BsCartCheck className="h-6 w-6" />
                  <span>Purchased Product</span>
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
                  <MdHistory className=" h-6 w-6" />
                  <span>Purchase History</span>
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
                  <FaRegCreditCard className="h-6 w-6" />
                  <span>Subscription Plan</span>
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
                  <BsBookmarkHeart className="h-6 w-6" />
                  <span>Wishlist</span>
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
                  <FiSettings className="h-6 w-6" />
                  <span>Settings</span>
                </div>
                <IoIosArrowForward />
              </div>
            </div>
            <div className="flex mb-1 items-center text-webred px-4 py-2 hover:bg-gray-300 hover:rounded-lg cursor-pointer">
              <div className="w-full flex justify-between items-center">
                <div className="flex gap-2 justify-start items-center">
                  <MdLogout className="h-6 w-6" />
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex items-center justify-between p-1 md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-black bg-white rounded-full p-2  focus:outline-none"
        >
        <LuPanelRightOpen size={30}  />
          
        </button>
      </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
