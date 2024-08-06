"use client";

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = (field: string) => {
        if (field === 'oldPassword') {
            setShowOldPassword(!showOldPassword);
        } else if (field === 'newPassword') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div className="flex items-center mb-6 justify-center gap-3 rounded-lg">
                    <div className="w-48 h-14">
                        <img src={'/images/logo.png'} alt="logo" />
                    </div>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Your Password</h2>
                </div>
                <form className="mt-8 space-y-8">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <label htmlFor="old-password" className="sr-only">Old Password</label>
                            <input
                                id="old-password"
                                name="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="Old Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={() => togglePasswordVisibility('oldPassword')}
                            >
                                {showOldPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="new-password" className="sr-only">New Password</label>
                            <input
                                id="new-password"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="New Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={() => togglePasswordVisibility('newPassword')}
                            >
                                {showNewPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="Confirm New Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-webgreen hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
