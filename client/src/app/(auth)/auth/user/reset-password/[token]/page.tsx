"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import instance from '@/utils/axios';
import Swal from 'sweetalert2';
import { Spinner } from '@nextui-org/react';
import {SpinnerLoader} from '@/components/loader/loaders';

const ResetPassword = ( { params }: { params: { token: string; }; } ) =>
{
    const [ newPassword, setNewPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ error, setError ] = useState( '' );
    const [ success, setSuccess ] = useState( '' );
    const [ showPassword, setShowPassword ] = useState( false );
    const [ showConfirmPassword, setShowConfirmPassword ] = useState( false );
    const [loading,setloading]=useState(false)

    const router = useRouter();

    const { token } = params;
    // console.log( token );

    const togglePasswordVisibility = ( field: string ) =>
    {
        if ( field === 'password' )
        {
            setShowPassword( !showPassword );
        } else if ( field === 'confirmPassword' )
        {
            setShowConfirmPassword( !showConfirmPassword );
        }
    };

    const handleResetPassword = async ( e: any ) =>
    {
        e.preventDefault();
        setError( '' );
        setSuccess( '' );

        if ( newPassword !== confirmPassword )
        {
            setError( 'Passwords do not match' );
            return;
        }

        if ( newPassword.length < 8 )
        {
            setError( 'Password must be at least 8 characters long' );
            return;
        }

        try
        {
            setloading(true)
            const response = await instance.post(
                '/user/resetPassword',
                { password: newPassword, token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if(response.status===200){
                setloading(false)
            console.log( "reset password set success:-", response );
            setSuccess( 'Password reset successfully. You will be redirected to login page soon.' );
            setTimeout( () =>
            {
                router.push( '/auth/user/login' );
            }, 3000 );
        }
        } catch ( error: any )
        {
            setloading(false)
            console.error( 'Password reset error:', error );
            setError( error.response?.data?.message || 'An error occurred while resetting the password. Please try again.' );
            const errorMessage = error.response?.data?.message || `Login failed. Please try again later`;
            Swal.fire( {
              icon: 'error',
              title: 'Login error',
              text: errorMessage,
            } );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div className="flex items-center mb-6 justify-center gap-3 rounded-lg">
                    <div className="w-48 h-14">
                        <img src={ '/images/logo.png' } alt="logo" />
                    </div>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
                </div>
                <form className="mt-8 space-y-8" onSubmit={ handleResetPassword }>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <label htmlFor="new-password" className="sr-only">New Password</label>
                            <input
                                id="new-password"
                                name="newPassword"
                                type={ showPassword ? "text" : "password" }
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={ newPassword }
                                onChange={ ( e ) => setNewPassword( e.target.value ) }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={ () => togglePasswordVisibility( 'password' ) }
                            >
                                { showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                ) }
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type={ showConfirmPassword ? "text" : "password" }
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-webgreen focus:border-webgreen focus:z-10 sm:text-sm"
                                placeholder="Confirm New Password"
                                value={ confirmPassword }
                                onChange={ ( e ) => setConfirmPassword( e.target.value ) }
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                                onClick={ () => togglePasswordVisibility( 'confirmPassword' ) }
                            >
                                { showConfirmPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400" />
                                ) }
                            </button>
                        </div>
                    </div>

                    { error && (
                        <div className="text-red-500 text-sm mt-2">{ error }</div>
                    ) }
                    { success && (
                        <div className="text-green-500 text-sm mt-2">{ success }</div>
                    ) }

                    <div>
                    {loading?
                    <button
                        className="flex items-center rounded-md justify-center w-full px-4 py-2 mt-4  bg-webgreen"
                    >
                        <SpinnerLoader/>
                         </button>:
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-webgreen hover:bg-webgreenHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Reset Password
                        </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;