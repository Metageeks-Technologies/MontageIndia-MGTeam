'use client';
import React, { useState } from 'react';
import instance from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const ResetPassword = () =>
{
    const router = useRouter();
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
                '/user/forgetPassword',
                { email },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log( "Password reset requested:", response.data );
            Swal.fire({
            icon:'success',
            title:'Email Sent',
            text:`Password reset instructions have been sent to ${ email }`    
            })
            setShowForgotPasswordModal( false );
            setEmail( "" );
            setTimeout( () =>
            {
                router.push( '/auth/user/login' );
            }, 5000 );

        } catch ( error: any )
        {
            console.error( "Password reset error:", error );

            setShowForgotPasswordModal( true );
            const errorMessage = error.response?.data?.message || `An error occurred. Try gain letter`;
            Swal.fire( {
              icon: 'error',
              title: 'Not found',
              text: errorMessage,
            } );
        }
    };
    return (


        <div className="fixed inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center mb-6 justify-center gap-3 rounded-lg">
                    <div className="w-48 h-14">
                        <img src={ '/images/logo.png' } alt="logo" />
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
                            className="mt-1 block w-full px-3 py-2 bg-[#F4F4F5] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-webgreen focus:border-webgreen sm:text-sm"
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
                            className="px-4 py-2 text-sm font-medium text-white bg-webgreen rounded-md hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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