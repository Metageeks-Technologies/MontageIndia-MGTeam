"use client";
import React, { useState, useEffect, useRef } from "react";
import CartPopup from "../cart/cartPage";
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDropdown, IoMdArrowDropdown } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import instance from "@/utils/axios";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import { BsBookmarkHeart } from "react-icons/bs";
import { notifySuccess } from "@/utils/toast";
import { signOutUser } from "@/utils/loginOptions";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { MdHistory, MdLogout } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdAudiotrack } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { IoMdStarOutline } from "react-icons/io";

interface User {
  subscription: {
    status: string;
    credits?: number;
  };
  image: string;
  name: string;
  email: string;
}

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [isEditorChosePopupOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<boolean>(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Replace this with your actual user state management
  const { user } = useAppSelector((state) => state.user);

  const editorChoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 770);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorChoiceRef.current &&
        !editorChoiceRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isEditorChosePopupOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // const response = await instance.get("/user/logout");
      await signOutUser();
      notifySuccess("Logout successfully");
      router.push("/auth/user/login");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  const handleUserIconClick = () => {
    if (isUserOpen) return;
    setIsUserOpen(!isUserOpen);
  };

  const handleProfileClick = () => {
    setIsUserOpen(false);
    router.push("/user-profile");
  };

  const handleModalClick = (route:string) => {
    setMenuOpen(false);
    router.push(route);
  }

  const handleEditorClick = () => {
    setIsDropdownOpen(!isEditorChosePopupOpen);
  }

  const NavItem: React.FC<NavItemProps> = ({ href, onClick, children }) => (
    <li
      className="text-gray-700 hover:text-black transition duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      <Link href={href}>{children}</Link>
    </li>
  );

  const DropdownItem: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,

  }) => (
    <Link
      href={href}
      className="text-gray-600 rounded-md py-2 px-8 hover:bg-gray-100 transition duration-200 justify-center items-center flex gap-2"

    >
      {children}
    </Link>
  );

  const userPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userPopupRef.current &&
        !userPopupRef.current.contains(event.target as Node)
      ) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white shadow-md">
      <div className="px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-5">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-32 h-8 cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

            {!isMobile && (
              <nav className="hidden md:block">
                <ul className="flex items-start space-x-6 cursor-pointer">
                  <NavItem href="/video">Video</NavItem>
                  <NavItem href="/image">Images</NavItem>
                  <NavItem href="/audio">Audio</NavItem>
                  <li className="relative group">
                    <button
                      disabled={isEditorChosePopupOpen}
                      onClick={toggleDropdown}
                      className="flex items-center text-gray-700 hover:text-black"
                    >
                      Editor Choice
                      <IoIosArrowDropdown
                        className={`ml-1 transform ${
                          isEditorChosePopupOpen ? "rotate-180" : ""
                        } transition-transform duration-200`}
                      />
                    </button>
                   {isEditorChosePopupOpen && (
                      <div
                        onClick={() => setIsDropdownOpen( false )}
                        ref={editorChoiceRef}
                        className="absolute mt-2 bg-white border rounded-lg shadow-xl z-50 flex flex-col items-start justify-center top-full"
                      >
                        <DropdownItem
                          href="/search/video?category=editor choice&mediaType=video"
                        >
                          <img src="/asset/video_logo.svg" alt="Video Logo" className="w-5 h-5 mr-2" />
                          <span>Video</span>
                        </DropdownItem>
                        <DropdownItem
                          href="/search/image?category=editor choice&mediaType=image"
                        >
                          <img src="/asset/image_logo.svg" alt="Image Logo" className="w-5 h-5 mr-2" />
                          <span>Image</span>
                        </DropdownItem>
                        <DropdownItem
                          href="/search/audio?category=editor choice&mediaType=audio"
                        >
                          <img src="/asset/Vector.svg" alt="Icon" className="w-5 h-5 mr-2" />
                          <span>Audio</span>
                        </DropdownItem>
                      </div>
                    )}

                  </li>
                  <NavItem href="/ondemand">On Demand</NavItem>
                </ul>
              </nav>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user?.subscription.status === "active" && (
              <span className="text-gray-700">
                {user.subscription.credits || 0} Credits Available
              </span>
            )}
            <Link href={!!user ? "/user-profile/wishlist" : "/auth/user/login"}>
              <AiOutlineHeart className="text-gray-700 hover:text-webred cursor-pointer w-7 h-7 transition-transform duration-200 ease-in-out hover:scale-110" />
            </Link>
            <CartPopup />
            <div className="relative">
              {user ? (
                <button disabled={isUserOpen} onClick={handleUserIconClick}>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-7 h-7 rounded-full cursor-pointer"
                  />
                </button>
              ) : (
                <button disabled={isUserOpen} onClick={handleUserIconClick}>
                  <FaUserCircle className="w-7 h-7 rounded-full cursor-pointer" />
                </button>
              )}
              {isUserOpen && (
                <div
                  ref={userPopupRef}
                  className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl z-50"
                >
                  {user ? (
                    <>
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <FaUserCircle className="w-5 h-5 mr-3" />
                        User Profile
                      </button>
                       <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <BiLogOutCircle className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => router.push("/auth/user/login")}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <BiLogInCircle className="w-5 h-5 mr-3" />
                      Log In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              {menuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden">
          <div className="px-6 pt-2 pb-3 space-y-1 sm:px-4 flex gap-2 flex-col">
            <Link href="/video" onClick={() => setMenuOpen(false)}>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <IoVideocamOutline className="w-6 h-6" />
                </span>
                <span>Video</span>
              </div>
            </Link>
            <Link href="/image" onClick={() => setMenuOpen(false)}>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <CiImageOn className="w-6 h-6" />
                </span>
                <span>Image</span>
              </div>
            </Link>
           <div className="relative group">
           <div className="flex justify-start gap-2 items-center">
           <IoMdStarOutline className="w-6 h-6" />
                    <button
                      // disabled={isEditorChosePopupOpen}
                      onClick={toggleDropdown}
                      className="flex items-center text-gray-700 hover:text-black"
                    >
                      Editor Choice
                      <IoIosArrowDropdown
                        className={`ml-1 transform ${
                          isEditorChosePopupOpen ? "rotate-180" : ""
                        } transition-transform duration-200`}
                      />
                    </button>
           </div>
              {isEditorChosePopupOpen && (
                <div
                  onClick={() => setIsDropdownOpen( false )}
                  ref={editorChoiceRef}
                  className="absolute mt-2 bg-white border rounded-lg shadow-xl z-50 flex flex-col items-start justify-center top-full"
                >
                  <DropdownItem
                    href="/search/video?category=editor choice&mediaType=video"
                  >
                    <img src="/asset/video_logo.svg" alt="Video Logo" className="w-5 h-5 mr-2" />
                    <span>Video</span>
                  </DropdownItem>
                  <DropdownItem
                    href="/search/image?category=editor choice&mediaType=image"
                  >
                    <img src="/asset/image_logo.svg" alt="Image Logo" className="w-5 h-5 mr-2" />
                    <span>Image</span>
                  </DropdownItem>
                  <DropdownItem
                    href="/search/audio?category=editor choice&mediaType=audio"
                  >
                    <img src="/asset/Vector.svg" alt="Icon" className="w-5 h-5 mr-2" />
                    <span>Audio</span>
                  </DropdownItem>
                </div>
              )}
            </div>
            <Link href="/ondemand" onClick={() => setMenuOpen(false)}>
              <div className="flex justify-start gap-2 items-center">
                <span>
                  <FaWpforms className="w-6 h-6" />
                </span>
                <span>On Demand</span>
              </div>
            </Link>
            <div className="flex justify-start gap-2 items-center">
              <span>
                <CartPopup />
              </span>
              <span>Cart</span>
            </div>
          </div>
          <div className="py-4 px-6  border-t border-gray-200">
            <div className="flex items-center">
              {user ? (
                <img
                  src={user.image}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-5 h-5 text-gray-700" />
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.name || "Guest"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user?.email || ""}
                </div>
              </div>
            </div>
            <div className="mt-3 sm:px-2 space-y-1">
              {user ? (
                <>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full text-left py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <FaUserCircle className="w-6 h-6 mr-3" />
                    User Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <BiLogOutCircle className="w-6 h-6 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleModalClick("/auth/user/login")}
                  className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
