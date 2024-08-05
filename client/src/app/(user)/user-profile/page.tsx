// pages/index.tsx
import { FC } from "react";
"use client"
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLink,
} from "react-icons/ai";
import { FiSettings } from "react-icons/fi";

interface ProfileField {
  label: string;
  value: string;
}

const profileData: ProfileField[] = [
  { label: "Name", value: "Md Sajid" },
  { label: "User ID", value: "437578279" },
  { label: "User Name", value: "mdsajidalam70615464" },
  { label: "Email", value: "mdsajidalam706154@gmail.com" },
  { label: "Password", value: "******" }, // Masked for security
];



const Home: FC = () => {
  return (
    <div className="flex gap-6 h-screen bg-white">
      {/* Sidebar */}
      <div className=" w-80 bg-gray-100 p-4 py-12 border">
        <div className="">
          <h1 className="text-lg font-medium">My Account</h1>
          <div className="p-4">
            <div className="flex items-center text-gray-700 py-2">
              <AiOutlineUser className="mr-2" />
              <span>Profile</span>
            </div>
            <div className="flex items-center text-gray-700 py-2">
              <FiSettings className="mr-2" />
              <span>Plans</span>
            </div>
            <div className="flex items-center text-gray-700 py-2">
              <AiOutlineShoppingCart className="mr-2" />
              <span>Purchase History</span>
            </div>
            <div className="flex items-center text-gray-700 py-2">
              <AiOutlineLink className="mr-2" />
              <span>Connected Accounts</span>
            </div>
            <div className="flex items-center text-gray-700 py-2">
              <FiSettings className="mr-2" />
              <span>Developers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-8">
        <h2 className="text-2xl font-bold ">Profile</h2>
        <p className="py-6">userList</p>
        <div className="border-t border-gray-200 pt-4 border">
          {profileData.map((field, index) => (
            <div
              key={index}
              className="flex justify-between items-center mx-6 py-3 border-b"
            >
              <div className="text-gray-700">
                <p>{field.label}</p>
              </div>
              <div className="text-gray-700">
                {" "}
                <p>{field.value}</p>
              </div>
              <button className="text-blue-600">Edit</button>
            </div>
          ))}
        </div>
        
        <div className="mt-10">
            <h1>Delete my Acount</h1>
        <div className="border w-full  mt-2 p-6 flex lg:flex-col gap-2">
          <p className="text-sm text-gray-700">
            This will remove all of your personal data forever.
          </p>
          <p className="text-blue-600 ">Delete my Acount</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
