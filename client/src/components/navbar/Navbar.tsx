"use client";
import React, { useEffect, useState } from 'react';
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import CartPopup from '../cart/cartPage';
import { FaUserCircle } from 'react-icons/fa';
import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';

const Sidebar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>("");


  const handleLogout = async () => {
    try {
      const response = await instance.get("/auth/user/logout");
      notifySuccess(response.data.message);
      setCurrentUser("");
      router.push("/");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  
  useEffect(() => {
    // Fetching user details
    handleLogout()
  }, []);



  const handleUserIconClick = () => {
    setIsUserOpen(!isUserOpen);
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
      <div className=" flex items-center gap-5">
        <img src='/images/logo.png' alt="logo"
          className='w-44 h-10 cursor-pointer'
          onClick={() => router.push('/')}
        />
        <div className="hidden lg:flex items-center space-x-4">
          <ul className="flex items-center space-x-4 cursor-pointer">
            <li className="text-gray-700 hover:text-black" onClick={() => router.push('/')}>Images</li>
            <li className="text-gray-700 hover:text-black" onClick={() => router.push('/video')}>Video</li>
            <li className="text-gray-700 hover:text-black" onClick={() => router.push('/audio')}>Audio</li>
          </ul>
        </div>
      </div>

      <div className='lg:block md:hidden hidden'>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-700">
            <span>0 Credits Available</span>
            <IoMdArrowDropdown className="ml-1" />
          </div>
          <AiOutlineHeart className="text-gray-700 w-7 h-7" />
          <CartPopup />
          <div className="relative">
            <FaUserCircle onClick={handleUserIconClick} className="text-gray-700 w-10 h-10 cursor-pointer" />
            {isUserOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                <ul className='cursor-pointer'>
                  <li className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer" onClick={() => router.push('/user-profile')}>View User Details</li>
                  <li className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer" onClick={() => router.push('/logout')}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex lg:hidden items-center space-x-4">
        <AiOutlineHeart className="text-gray-700 w-6 h-6" />
        <CartPopup />
        <AiOutlineMenu className="text-gray-700 w-6 h-6 cursor-pointer" onClick={() => setMenuOpen(true)} />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
          <div className="flex justify-between items-center">
            <AiOutlineClose className="text-gray-700 w-6 h-6 cursor-pointer" onClick={() => setMenuOpen(false)} />
          </div>
          <ul className="mt-4 space-y-3">
            <li className="block text-gray-700 hover:text-black py-2" onClick={() => router.push('/')}>Images</li>
            <li className="block text-gray-700 hover:text-black py-2" onClick={() => router.push('/video')}>Video</li>
            <li className="block text-gray-700 hover:text-black py-2" onClick={() => router.push('/audio')}>Music</li>
            <li className="block text-gray-700 hover:text-black py-2">Templates</li>
            <li className="block text-gray-700 hover:text-black py-2">Blog</li>
            <li className="block text-gray-700 hover:text-black py-2">Enterprise</li>
            <li className="block text-gray-700 hover:text-black py-2">Pricing</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
