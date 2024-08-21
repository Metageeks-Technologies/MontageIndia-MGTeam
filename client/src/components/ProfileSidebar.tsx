"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLink,
} from "react-icons/ai";
import {useState} from 'react'
import { BsCartCheck } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { MdHistory,MdLogout } from "react-icons/md";
import { FiSettings } from 'react-icons/fi';
import { FaRegCreditCard } from "react-icons/fa";
const ProfileSidebar = () => {
  const router = useRouter();
  const [active, setActive] = useState<string>("");

  return (
    
        <div>
          <h1 className="text-md text-black px-4 font-medium">My Account</h1>
          <div className="mt-4">
            <div onClick={() => {setActive("Profile"); router.push(`/user-profile`)}}  className={`flex items-center  px-4 py-2  hover:bg-webred hover:border-1 hover:shadow-custom hover:text-white hover:border-black hover:rounded-lg  cursor-pointer ${active === "Profile" ? "bg-webred border-1 shadow-custom text-white border-black rounded-lg" : "text-black"} `}>
              <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
              <AiOutlineUser className="h-6 w-6" />
              <span>Profile</span>
              </div>
              <IoIosArrowForward/>
              </div>
            </div>
            <div onClick={() => { setActive("purchasedProduct"); router.push(`/user-profile/purchased-product`)}} className={`flex items-center px-4 py-2 hover:bg-webred hover:border-1 hover:shadow-custom hover:text-white hover:border-black hover:rounded-lg cursor-pointer ${active === "purchasedProduct" ? "bg-webred border-1 shadow-custom text-white border-black rounded-lg" : "text-black"}`}>
               <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
              <BsCartCheck className="h-6 w-6" />
              <span>Purchased Product</span>
              </div>
              <IoIosArrowForward/>
              </div>
            </div>
            <div onClick={() => {setActive("purchasedHistory"); router.push(`/user-profile/purchase-history`)}}  className={`flex items-center text-black px-4 py-2 hover:bg-webred hover:border-1 hover:shadow-custom hover:text-white hover:border-black hover:rounded-lg cursor-pointer ${active === "purchasedHistory" ? "bg-webred border-1 shadow-custom text-white border-black rounded-lg" : "text-black"}`}>
               <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
               <MdHistory className=" h-6 w-6" />
              <span>Purchase History</span>
              </div>
              <IoIosArrowForward/>
              </div>
            </div>
            <div onClick={() => {setActive("subscription"); router.push(`/user-profile/subscription`)}}  className={`flex items-center text-black px-4 py-2 hover:bg-webred hover:border-1 hover:shadow-custom hover:text-white hover:border-black hover:rounded-lg cursor-pointer ${active === "subscription" ? "bg-webred border-1 shadow-custom text-white border-black rounded-lg" : "text-black"}`}>
               <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
               <FaRegCreditCard className="h-6 w-6" />
              <span>Subscription Plan</span>
              </div>
              <IoIosArrowForward/>
              </div>
            </div>
              <div onClick={() => {setActive("settings");router.push('/user-profile/settings')}}  className={`flex items-center text-black px-4 py-2 hover:bg-webred hover:border-1 hover:shadow-custom hover:text-white hover:border-black hover:rounded-lg cursor-pointer ${active === "settings" ? "bg-webred border-1 shadow-custom text-white border-black rounded-lg" : "text-black"}`}>
               <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
               <FiSettings  className="h-6 w-6" />
              <span>Settings</span>
              </div>
              <IoIosArrowForward/>
              </div>
            </div>
            <div className="flex items-center text-webred px-4 py-2 hover:bg-webred hover:text-white hover:border-black hover:border-1 hover:shadow-custom hover:rounded-lg cursor-pointer">
               <div className='w-full flex justify-between items-center'>
              <div className='flex gap-2 justify-start items-center'>
               <MdLogout  className="h-6 w-6" />
              <span>Log Out</span>
              </div>
            
              </div>
            </div>
          </div>
        </div>
      
  )
}

export default ProfileSidebar
