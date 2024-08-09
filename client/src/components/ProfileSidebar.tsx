"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLink,
} from "react-icons/ai";
import { FiSettings } from 'react-icons/fi';
const ProfileSidebar = () => {
  const router = useRouter();
  return (
    <div className="w-80 bg-gray-100 p-4 py-12 border">
        <div>
          <h1 className="text-md text-gray-700 font-medium">My Account</h1>
          <div className="mt-4">
            <div onClick={() => router.push(`/user-profile`)}  className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <AiOutlineUser className="mr-3 h-6 w-6" />
              <span>Profile</span>
            </div>
            <div onClick={() => router.push(`/user-profile/plan`)} className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <FiSettings className="mr-3 h-6 w-6" />
              <span>Plans</span>
            </div>
            <div onClick={() => router.push(`/user-profile/purchase`)}  className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <AiOutlineShoppingCart className="mr-3 h-6 w-6" />
              <span>Purchase History</span>
            </div>
            <hr />
            <div className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <AiOutlineLink className="mr-3 h-6 w-6" />
              <span>Connected Accounts</span>
            </div>
            <div className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <FiSettings className="mr-3 h-6 w-6" />
              <span>Developers</span>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProfileSidebar
