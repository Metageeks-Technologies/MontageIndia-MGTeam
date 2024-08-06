// pages/index.tsx
"use client"
import { FC } from "react";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLink,
} from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { useState, useEffect } from 'react';
import instance from '@/utils/axios';
import { notifyError } from '@/utils/toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    _id: string;
}

const Home: FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = async () => {
        try {
            const response = await instance.get(`/user/getCurrent`);
            console.log("user", response)
            if (response.data && response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            notifyError("Failed to fetch user data");
        }
    };

    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <div className="flex gap-6 h-screen bg-white">
            {/* Sidebar */}
            <div className="w-80 bg-gray-100 p-4 py-12 border">
                <div>
                    <h1 className="text-md text-gray-700 font-medium">My Account</h1>
                    <div className="mt-4">
                        <div className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                            <AiOutlineUser className="mr-3 h-6 w-6" />
                            <span>Profile</span>
                        </div>
                        <div className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                            <FiSettings className="mr-3 h-6 w-6" />
                            <span>Plans</span>
                        </div>
                        <div className="flex items-center text-gray-700 px-4 py-2 hover:bg-gray-200 cursor-pointer">
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

            <div className="w-full p-8">
                <h2 className="text-4xl font-bold">Profile</h2>
                <p className="py-6">User details</p>
                <div className="border border-gray-200 pt-4">
                    {user && (
                        <>
                            <div className="flex justify-between  items-center mx-6 py-2 border-b">
                                <div className="text-gray-700">Name</div>
                                <div className="text-gray-700">{user.name}</div>
                                <button className="text-blue-600">Edit</button>
                            </div>
                            <div className="flex justify-between items-center mx-6 py-3 border-b">
                                <div className="text-gray-700">User ID</div>
                                <div className="text-gray-700">{user._id}</div>
                                <button/>
                            </div>
                            <div className="flex justify-between items-center mx-6 py-3 border-b">
                                <div className="text-gray-700">User Name</div>
                                <div className="text-gray-700">{user.username}</div>
                                <button/>
                            </div>
                            <div className="flex justify-between items-center mx-6 py-3 border-b">
                                <div className="text-gray-700">Password</div>
                                <div className="text-gray-700">********</div>
                                <button className="text-blue-600">Edit</button>
                            </div>
                            <div className="flex justify-between items-center mx-6 py-3 border-b">
                                <div className="text-gray-700">E-mail</div>
                                <div className="text-gray-700">{user.email}</div>
                                <button className="text-blue-600">Edit</button>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-10">
                    <h1 className="text-lg font-bold">Delete my Account</h1>
                    <div className="border w-full mt-2 p-6 flex flex-col gap-2">
                        <p className="text-sm text-gray-700">
                            This will remove all of your personal data forever.
                        </p>
                        <p className="text-blue-600 hover:underline cursor-pointer">Delete my Account</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
