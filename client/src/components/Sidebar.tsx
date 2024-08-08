"use client";
import React from 'react';
import { LiaHomeSolid } from "react-icons/lia";
import { MdHelpOutline, MdOutlineGeneratingTokens } from 'react-icons/md';
import { GrCatalogOption } from "react-icons/gr";
import { RiPencilRuler2Line } from 'react-icons/ri';

import { useState } from 'react';
import { AiOutlineHeart, AiOutlineShoppingCart, AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { MdLanguage } from 'react-icons/md';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import CartPopup from './cart/cartPage';


const Sidebar = () =>
{
  const router = useRouter();
  const [ menuOpen, setMenuOpen ] = useState( false );


  return (
    // <div className="fixed top-0 left-0 h-full z-30 w-20 border flex flex-col items-center bg-gray-100 text-gray-700 shadow-md">
    //   <div className="my-4">
    //     <div className="flex flex-col items-center space-y-8">
    //       <div className="flex flex-col items-center">
    //         <LiaHomeSolid className="h-8 w-8" />
    //         <p className="text-xs mt-2">Home</p>
    //       </div>
    //       <div className="flex flex-col items-center">
    //         <MdOutlineGeneratingTokens className="h-8 w-8" />
    //         <p className="text-xs mt-2">Generate</p>
    //       </div>
    //       <div className="flex flex-col items-center">
    //         <GrCatalogOption className="h-8 w-8" />
    //         <p className="text-xs mt-2">Catalog</p>
    //       </div>
    //       <div className="flex flex-col items-center">
    //         <RiPencilRuler2Line className="h-8 w-8" />
    //         <p className="text-xs mt-2">Create</p>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="mt-auto mb-4">
    //     <div className="flex flex-col items-center">
    //       <MdHelpOutline className="h-8 w-8" />
    //       <p className="text-xs mt-2">Help</p>
    //     </div>
    //   </div>
    // </div>

    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md">
      <div className=" flex items-center gap-5">
        <img src={ '/images/logo.png' } alt="logo"
          className='w-44 h-10 cursor-pointer'
          onClick={ () => router.push( '/' ) }
        />
        <div className="hidden lg:flex items-center space-x-4 ">

          <ul className="flex items-center space-x-4 cursor-pointer">
            <li className="text-gray-700 hover:text-black" onClick={ () => router.push( '/' ) }>Images</li>
            <li className="text-gray-700 hover:text-black" onClick={ () => router.push( '/video' ) }>Video</li>
            <li className="text-gray-700 hover:text-black" onClick={ () => router.push( '/audio' ) }>Audio</li>
            <li className="text-gray-700 hover:text-black">AI Generator</li>
            <li className="text-gray-700 hover:text-black">Enterprise</li>
          </ul>
        </div>
      </div>

      <div className='lg:block md:hidden hidden'>
        <div className="flex  items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <span>0 Credits Available</span>
            <IoMdArrowDropdown className="ml-1" />
          </div>
          <a href="#" className="text-gray-700 hover:text-black">Pricing</a>
          <MdLanguage className="text-gray-700 w-6 h-6" />
          <AiOutlineHeart className="text-gray-700 w-6 h-6" />
          {/* <AiOutlineShoppingCart className="text-gray-700 w-6 h-6" /> */ }
          {/* this is cart */ }
          <CartPopup />
          <AiOutlineUser className="text-gray-700 w-6 h-6" />
        </div>
      </div>

      <div className="flex lg:hidden items-center space-x-4">
        <AiOutlineHeart className="text-gray-700 w-6 h-6" />
        {/* here also cart */ }
        <CartPopup />
        <AiOutlineUser className="text-gray-700 w-6 h-6" />
        <AiOutlineMenu className="text-gray-700 w-6 h-6 cursor-pointer" onClick={ () => setMenuOpen( true ) } />
      </div>

      { menuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
          <div className="flex justify-between items-center">

            <AiOutlineClose className="text-gray-700 w-6 h-6 cursor-pointer" onClick={ () => setMenuOpen( false ) } />
          </div>
          <ul className="mt-4 space-y-3 ">
            <li className="block text-gray-700 hover:text-black py-2" onClick={ () => router.push( '/' ) }>Images</li>
            <li className="block text-gray-700 hover:text-black py-2" onClick={ () => router.push( '/video' ) }>Video</li>
            <li className="block text-gray-700 hover:text-black py-2" onClick={ () => router.push( '/audio' ) }>Music</li>
            <li className="block text-gray-700 hover:text-black py-2">Templates</li>
            <li className="block text-gray-700 hover:text-black py-2">Blog</li>
            <li className="block text-gray-700 hover:text-black py-2">Enterprise</li>
            <li className="block text-gray-700 hover:text-black py-2">Pricing</li>
          </ul>
        </div>
      ) }
    </div>

  );
};

export default Sidebar;



