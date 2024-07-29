'use client';

import instance from '@/utils/axios';
import { notifySuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { adminRolesOptions, categoriesOptions, mediaTypesOptions } from '../../../../utils/tempData';

interface User {
    name: string;
    email: string;
    password: string;
    role: string;
    username: string;
    mediaType: string;
    category: string;
}

const UserCreate: React.FC = () => {
    const router = useRouter();
    const [user, setUser] = useState<User>({
        name: '',
        email: '',
        role: '',
        password: '',
        username: '',
        mediaType: '',
        category: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log( user );
        try
        {
            const response = await instance.post( '/auth/admin/createAdmin', user,{withCredentials: true} );
            console.log( response );
            setUser( {
                name: '',
                email: '',
                role: '',
                password: '',
                username: '',
                mediaType: '',
                category: '',
            });
            notifySuccess("New user created successfully");
            router.push("/admin/dashboard");
        } catch (error) {
            console.log("error in creating the user :-", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-6 mt-12 min-h-full shadow-md rounded-lg ">
            <h2 className="text-2xl font-bold mb-6 text-center">Create User</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    >
                        <option value="">Select Role</option>
                        {
                            adminRolesOptions.map((adminRole,index)=>(
                                <option value={adminRole} key={index}>{adminRole}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                    <select
                        id="mediaType"
                        name="mediaType"
                        value={user.mediaType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    >
                        <option value="">Select Media Type</option>
                        {mediaTypesOptions.map((mediaType,index)=>(
                            <option key={index} value={mediaType}>{mediaType}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={user.category}
                        onChange={handleChange}
                        className="lg:w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEF264]"
                    >
                        <option value="">Select Category</option>
                       <>
                        {categoriesOptions.map((category,index)=>(
                            <option key={index} value={category}>{category}</option>
                        ))
                        }
                       </>
                    </select>
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 mt-6 text-white bg-[#BEF264] hover:bg-[#cbff70] rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BEF264]"
            >
                Create User
            </button>
        </form>
    );
};

export default UserCreate;
