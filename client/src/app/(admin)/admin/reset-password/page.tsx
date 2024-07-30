'use client';
import { notifyError, notifySuccess } from '@/utils/toast';
import React, { useState } from 'react';
import { images } from '../../../../../public/images/image';
import instance from '@/utils/axios';
const ResetPassword = () =>
{
    const [ showForgotPasswordModal, setShowForgotPasswordModal ] = useState( false );
    const [ email, setEmail ] = useState( "" );

    const handleForgotPassword = async ( e: any ) =>
    {
        e.preventDefault();
        if ( !email )
        {
            // setError( "Please enter your email address." );
            return;
        }

        try
        {
            const response = await instance.post(
                'auth/admin/forgetPassword',
                { email },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log( "Password reset requested:", response.data );
            notifySuccess( `Password reset instructions have been sent to ${ email }` );
            setShowForgotPasswordModal( false );
            setEmail( "" );

        } catch ( error: any )
        {
            console.error( "Password reset error:", error );

            setShowForgotPasswordModal( true );

            notifyError( error.response?.data?.message || "An error occurred while requesting password reset. Please try again." );

        }
    };
    return (


        <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center mb-6 justify-center gap-3 rounded-lg">
                    <div className="w-48 h-14 bg-white border border-gray-300 flex justify-center items-center rounded-xl shadow-xl">
                        <img src={ images.logo.src } alt="logo" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <form onSubmit={ handleForgotPassword }>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 required-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 bg-[#F4F4F5] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your email"
                            value={ email }
                            onChange={ ( e ) => setEmail( e.target.value ) }
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={ () => setShowForgotPasswordModal( false ) }
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#BEF264] rounded-md hover:bg-[#cbff70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;